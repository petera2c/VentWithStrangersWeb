import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import moment from "moment-timezone";
import Avatar from "avataaars";
import AdSense from "react-adsense";
import db from "../../config/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faUserLock } from "@fortawesome/free-solid-svg-icons/faUserLock";
import { faPray } from "@fortawesome/free-solid-svg-icons/faPray";
import { faLandmark } from "@fortawesome/free-solid-svg-icons/faLandmark";
import { faBaby } from "@fortawesome/free-solid-svg-icons/faBaby";
import { faGlassCheers } from "@fortawesome/free-solid-svg-icons/faGlassCheers";
import { faSchool } from "@fortawesome/free-solid-svg-icons/faSchool";

import LoadingHeart from "../../components/loaders/Heart";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Button from "../../components/views/Button";
import Text from "../../components/views/Text";

import Vent from "../../components/Vent";
import Comment from "../../components/Comment";

import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import HandleOutsideClick from "../../components/containers/HandleOutsideClick";
import LoadMore from "../../components/LoadMore";
import KarmaBadge from "../../components/KarmaBadge";

import {
  blockUser,
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  isMobileOrTablet
} from "../../util";
import { startConversation } from "../../components/Vent/util";
import { getUser } from "./util";
import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
  religiousBeliefsList
} from "../../PersonalOptions";

function ProfileSection({ user }) {
  const history = useHistory();
  const location = useLocation();
  let { search } = location;
  if (!user && !search) {
    history.push("/");
    return <div />;
  }
  const [blockModal, setBlockModal] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState();
  const [postOptions, setPostOptions] = useState(false);
  const [postsSection, setPostsSection] = useState(true);
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});

  if (search) search = search.substring(1);
  if (!search && user) search = user.uid;

  const ventQuery = db
    .collection("/vents/")
    .where("userID", "==", search)
    .orderBy("server_timestamp", "desc")
    .limit(20);

  const [vents] = useCollectionData(ventQuery, { idField: "id" });

  const commentQuery = db
    .collection("/comments/")
    .where("userID", "==", search)
    .orderBy("server_timestamp", "desc")
    .limit(20);
  const [comments] = useCollectionData(commentQuery, { idField: "id" });
  const isActive = page => {
    if (page) return " active";
    else return "";
  };

  useEffect(() => {
    if (search) {
      getUserBasicInfo(setUserBasicInfo, search);
      getUser(userInfo => {
        setUserInfo(userInfo);
      }, search);
    }
  }, [search]);

  const displayName = userBasicInfo.displayName
    ? capitolizeFirstChar(userBasicInfo.displayName)
    : "Anonymous";

  return (
    <Container className="x-fill">
      {!isMobileOrTablet() && location.search && (
        <Container className="container ad column">
          {process.env.NODE_ENV === "production" && (
            <Container className="mb8">
              <AdSense.Google
                className="adsbygoogle"
                client="ca-pub-5185907024931065"
                format=""
                responsive="true"
                slot="9793400477"
                style={{
                  display: "block",
                  minWidth: "100px",
                  width: "100%",
                  maxWidth: "300px",
                  minHeight: "100px",
                  height: "240px",
                  maxHeight: "800px"
                }}
              />
            </Container>
          )}
        </Container>
      )}
      <Container
        className={
          "container column px16 " +
          (isMobileOrTablet() ? "mobile-full" : "large")
        }
      >
        {search && (
          <Container className="ov-hidden column bg-white pa16 mb16 br8">
            <Container className="x-fill full-center">
              {userBasicInfo && !userBasicInfo.avatar && (
                <Container
                  className="bg-blue full-center mb16 br-round"
                  style={{
                    height: "84px",
                    width: "84px"
                  }}
                >
                  <h1 className="white fs-40">{displayName[0]}</h1>
                </Container>
              )}
              {userBasicInfo && userBasicInfo.avatar && (
                <Avatar
                  avatarStyle={"Circle"}
                  topType={userBasicInfo.avatar.topType}
                  accessoriesType={userBasicInfo.avatar.accessoriesType}
                  hairColor={userBasicInfo.avatar.hairColor}
                  facialHairType={userBasicInfo.avatar.facialHairType}
                  clotheType={userBasicInfo.avatar.clotheType}
                  eyeType={userBasicInfo.avatar.eyeType}
                  eyebrowType={userBasicInfo.avatar.eyebrowType}
                  mouthType={userBasicInfo.avatar.mouthType}
                  skinColor={userBasicInfo.avatar.skinColor}
                  style={{ width: "96px", height: "96px" }}
                  className="mr8"
                />
              )}
            </Container>

            <Container className="align-center">
              <h1 className="primary mr8">{displayName}</h1>
              <KarmaBadge karma={calculateKarma(userBasicInfo)} />
            </Container>
            <h6 className="grey-1 fw-400">
              {calculateKarma(userBasicInfo)} Karma Points
            </h6>
            <Container className="mt8">
              {Boolean(
                new moment().year() - new moment(userInfo.birth_date).year()
              ) && (
                <Container className="column">
                  <h6 className="fw-400">Age</h6>
                  <h6 className="grey-1 fw-400">
                    {new moment().year() -
                      new moment(userInfo.birth_date).year()}
                  </h6>
                </Container>
              )}
              {userInfo.gender && (
                <Container className="column ml8">
                  <h6 className="fw-400">Gender</h6>
                  <h6 className="grey-1 fw-400">{userInfo.gender}</h6>
                </Container>
              )}
              {userInfo.pronouns && (
                <Container className="column ml8">
                  <h6 className="fw-400">Pronouns</h6>
                  <h6 className="grey-1 fw-400">{userInfo.pronouns}</h6>
                </Container>
              )}
            </Container>

            <Container className="wrap gap8 mt8">
              {userInfo.education !== undefined && (
                <Container className="border-all align-center px8 py4 br4">
                  <FontAwesomeIcon className="mr8" icon={faSchool} />
                  {educationList[userInfo.education]}
                </Container>
              )}
              {userInfo.kids !== undefined && (
                <Container className="border-all align-center px8 py4 br4">
                  <FontAwesomeIcon className="mr8" icon={faBaby} />
                  {kidsList[userInfo.kids]}
                </Container>
              )}
              {userInfo.partying !== undefined && (
                <Container className="border-all align-center px8 py4 br4">
                  <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                  {partyingList[userInfo.partying]}
                </Container>
              )}
              {userInfo.politics !== undefined && (
                <Container className="border-all align-center px8 py4 br4">
                  <FontAwesomeIcon className="mr8" icon={faLandmark} />
                  {politicalBeliefsList[userInfo.politics]}
                </Container>
              )}
              {userInfo.religion !== undefined && (
                <Container className="border-all align-center px8 py4 br4">
                  <FontAwesomeIcon className="mr8" icon={faPray} />
                  {userInfo.religion}
                </Container>
              )}
            </Container>
            <Container className="align-center justify-between mt16">
              {userBasicInfo.displayName &&
                search &&
                user &&
                search != user.uid && (
                  <Button
                    className="button-2 px16 py8 mr16 br8"
                    onClick={() => {
                      if (!user)
                        alert("You must make an account to message user!");
                      startConversation(history, user.uid, search);
                    }}
                  >
                    <FontAwesomeIcon className="mr8" icon={faComments} />
                    Message User
                  </Button>
                )}
              <div className="relative">
                {userBasicInfo.displayName &&
                  search &&
                  user &&
                  search != user.uid && (
                    <HandleOutsideClick close={() => setPostOptions(false)}>
                      <FontAwesomeIcon
                        className="clickable grey-9 px16"
                        icon={faEllipsisV}
                        onClick={e => {
                          e.preventDefault();

                          setPostOptions(!postOptions);
                        }}
                      />
                      {postOptions && (
                        <div
                          className="absolute flex right-0"
                          style={{
                            bottom: "calc(100% + 8px)",
                            whiteSpace: "nowrap",
                            zIndex: 1
                          }}
                        >
                          <Container className="column x-fill bg-white border-all px16 py8 br8">
                            {userBasicInfo.displayName &&
                              search &&
                              search != user.uid && (
                                <Container
                                  className="button-8 clickable align-center"
                                  onClick={e => {
                                    e.preventDefault();
                                    setBlockModal(!blockModal);
                                  }}
                                >
                                  <Text
                                    className="fw-400 flex-fill"
                                    text="Block User"
                                    type="p"
                                  />
                                  <FontAwesomeIcon
                                    className="ml8"
                                    icon={faUserLock}
                                  />
                                </Container>
                              )}
                          </Container>
                        </div>
                      )}
                    </HandleOutsideClick>
                  )}
              </div>
            </Container>
          </Container>
        )}

        <h4 className="mb16">Activity</h4>
        <Container className="ov-hidden column bg-white mb16 br8">
          <Container>
            <Container
              className={
                "x-50 button-4 clickable full-center py16" +
                isActive(postsSection)
              }
              onClick={() => setPostsSection(true)}
            >
              <h5 className="tac">Posts</h5>
            </Container>
            <Container
              className={
                "x-50 button-4 clickable full-center py16" +
                isActive(!postsSection)
              }
              onClick={() => {
                setPostsSection(false);
              }}
            >
              <h5 className="tac">Comments</h5>
            </Container>
          </Container>
        </Container>
        {postsSection && (
          <Container className="x-fill column">
            {vents &&
              vents.map((vent, index) => (
                <Vent
                  history={history}
                  key={index}
                  previewMode={true}
                  ventInit={vent}
                />
              ))}
            {vents && vents.length === 0 && (
              <h4 className="fw-400">No vents found.</h4>
            )}
            {canLoadMore && (
              <LoadMore canLoadMore={canLoadMore} loadMore={() => {}}>
                <Container className="clickable x-fill column bg-white mb16 br8">
                  <Container className="justify-between pt16 px32">
                    <Container>
                      <div className="round-icon bg-grey-2 mr8" />
                      <div
                        className=" bg-grey-2 br16"
                        style={{ width: "140px", height: "24px" }}
                      />
                    </Container>
                    <div
                      className="bg-grey-2 br16"
                      style={{ width: "140px", height: "24px" }}
                    />
                  </Container>
                  <Container className="pt16 px32">
                    <div
                      className="x-fill bg-grey-2 br8"
                      style={{ height: "100px" }}
                    />
                  </Container>
                  <Container className="py16 px32">
                    <div
                      className=" bg-grey-2 br16"
                      style={{ width: "140px", height: "24px" }}
                    />
                  </Container>
                </Container>
              </LoadMore>
            )}
          </Container>
        )}
        {!postsSection && (
          <Container className="x-fill column">
            <Container className="column br8">
              {comments &&
                comments.map((comment, index) => {
                  return (
                    <Link key={index} to={"/problem/" + comment.ventID + "/"}>
                      <Comment
                        arrayLength={comments.length}
                        commentID={comment.id}
                        commentIndex={index}
                        comment2={comment}
                        key={index}
                      />
                    </Link>
                  );
                })}
            </Container>
            {comments && comments.length === 0 && (
              <h4 className="fw-400">No comments found.</h4>
            )}
          </Container>
        )}
        {((!vents && postsSection) || (!comments && !postsSection)) && (
          <Container className="x-fill full-center">
            <LoadingHeart />
          </Container>
        )}
      </Container>
      {!isMobileOrTablet() && location.search && (
        <Container className="container ad column">
          {process.env.NODE_ENV === "production" && (
            <Container className="mb8">
              <AdSense.Google
                className="adsbygoogle"
                client="ca-pub-5185907024931065"
                format=""
                responsive="true"
                slot="1935732380"
                style={{
                  display: "block",
                  minWidth: "100px",
                  width: "100%",
                  maxWidth: "300px",
                  minHeight: "100px",
                  height: "240px",
                  maxHeight: "800px"
                }}
              />
            </Container>
          )}
        </Container>
      )}
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => blockUser(user.uid, search)}
          title="Block User"
        />
      )}
    </Container>
  );
}

export default ProfileSection;

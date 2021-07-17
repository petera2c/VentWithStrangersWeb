import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db from "../../config/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faUserLock } from "@fortawesome/free-solid-svg-icons/faUserLock";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";

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

import {
  blockUser,
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  isMobileOrTablet,
  karmaBadge
} from "../../util";
import { startConversation } from "../../components/Vent/util";

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
    if (search) getUserBasicInfo(setUserBasicInfo, search);
  }, []);

  return (
    <Container
      className={
        "container column px16 " +
        (isMobileOrTablet() ? "mobile-full" : "large")
      }
    >
      {search && (
        <Container className="ov-hidden column bg-white pa16 mb16 br8">
          <Container className="x-fill full-center">
            <Container
              className="bg-blue full-center mb16 br-round"
              style={{
                height: "84px",
                width: "84px"
              }}
            >
              <h1 className="white fs-40">
                {userBasicInfo.displayName
                  ? capitolizeFirstChar(userBasicInfo.displayName[0])
                  : ""}
              </h1>
            </Container>
          </Container>
          <Container className="align-center">
            <h1 className="primary mr8">
              {userBasicInfo.displayName
                ? capitolizeFirstChar(userBasicInfo.displayName)
                : "Anonymous"}
            </h1>
            {karmaBadge(calculateKarma(userBasicInfo))}
          </Container>
          <h6 className="grey-1 fw-400">
            {calculateKarma(userBasicInfo)} Karma Points
          </h6>
          <Container className="align-center justify-between mt16">
            {userBasicInfo.displayName && search && search != user.uid && (
              <Button
                className="button-2 px16 py8 mr16 br8"
                onClick={() => {
                  if (!user) alert("You must make an account to message user!");
                  startConversation(history, user.uid, search);
                }}
              >
                <FontAwesomeIcon className="mr8" icon={faComments} />
                Message User
              </Button>
            )}
            <div className="relative">
              {userBasicInfo.displayName && search && search != user.uid && (
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

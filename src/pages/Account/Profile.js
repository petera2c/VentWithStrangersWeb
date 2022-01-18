import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import moment from "moment-timezone";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Space } from "antd";

import { faBaby } from "@fortawesome/free-solid-svg-icons/faBaby";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faGlassCheers } from "@fortawesome/free-solid-svg-icons/faGlassCheers";
import { faLandmark } from "@fortawesome/free-solid-svg-icons/faLandmark";
import { faPray } from "@fortawesome/free-solid-svg-icons/faPray";
import { faSchool } from "@fortawesome/free-solid-svg-icons/faSchool";
import { faUserLock } from "@fortawesome/free-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Comment from "../../components/Comment";
import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";
import HandleOutsideClick from "../../components/containers/HandleOutsideClick";
import KarmaBadge from "../../components/KarmaBadge";
import LoadingHeart from "../../components/loaders/Heart";
import MakeAvatar from "../../components/MakeAvatar";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";
import Vent from "../../components/Vent";

import { UserContext } from "../../context";

import { startConversation } from "../../components/Vent/util";
import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
} from "../../PersonalOptions";
import {
  blockUser,
  calculateKarma,
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import { getUser, getUsersComments, getUsersVents } from "./util";

function ProfileSection() {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  let { search } = location;

  const [blockModal, setBlockModal] = useState(false);
  const [canLoadMoreComments, setCanLoadMoreComments] = useState(true);
  const [canLoadMoreVents, setCanLoadMoreVents] = useState(true);
  const [postOptions, setPostOptions] = useState(false);
  const [postsSection, setPostsSection] = useState(true);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});

  const [vents, setVents] = useState([]);
  const [comments, setComments] = useState([]);

  if (search) search = search.substring(1);
  if (!search && user) search = user.uid;

  const isActive = (page) => {
    if (page) return " active";
    else return "";
  };

  useEffect(() => {
    setVents([]);
    setComments([]);

    if (search) {
      getIsUserOnline((isUserOnline) => {
        if (isMounted()) setIsUserOnline(isUserOnline);
      }, search);
      getUserBasicInfo((userBasicInfo) => {
        if (isMounted()) setUserBasicInfo(userBasicInfo);
      }, search);
      getUser((userInfo) => {
        if (isMounted()) setUserInfo(userInfo);
      }, search);
    } else navigate("/");

    getUsersVents(isMounted, search, setCanLoadMoreVents, setVents, []);
    getUsersComments(
      isMounted,
      search,
      setCanLoadMoreComments,
      setComments,
      []
    );
  }, [isMounted, navigate, search]);

  return (
    <Page className="pa16" id="scrollable-div" title="Profile">
      <Container className="flex-fill x-fill">
        <Space className="flex-fill" direction="vertical" size="large">
          {search && (
            <Space
              className="x-fill ov-hidden bg-white pa16 br8"
              direction="vertical"
            >
              <Container className="x-fill full-center">
                <MakeAvatar
                  displayName={userBasicInfo.displayName}
                  size="large"
                  userBasicInfo={userBasicInfo}
                />
              </Container>

              <Space size="large" wrap>
                <Space direction="vertical">
                  <Space align="center">
                    <h1>{capitolizeFirstChar(userBasicInfo.displayName)}</h1>
                    <KarmaBadge karma={calculateKarma(userBasicInfo)} />
                  </Space>
                  <p>{calculateKarma(userBasicInfo)} Karma Points</p>
                </Space>

                {(Boolean(
                  new moment().year() - new moment(userInfo.birth_date).year()
                ) ||
                  userInfo.gender ||
                  userInfo.pronouns) && (
                  <Space>
                    {Boolean(
                      new moment().year() -
                        new moment(userInfo.birth_date).year()
                    ) && (
                      <Container className="column">
                        <h6>Age</h6>
                        <p>
                          {new moment().diff(
                            new moment(userInfo.birth_date),
                            "years"
                          )}
                        </p>
                      </Container>
                    )}

                    {userInfo.gender && (
                      <Container className="column ml8">
                        <h6>Gender</h6>
                        <p>{userInfo.gender}</p>
                      </Container>
                    )}
                    {userInfo.pronouns && (
                      <Container className="column ml8">
                        <h6>Pronouns</h6>
                        <p>{userInfo.pronouns}</p>
                      </Container>
                    )}
                  </Space>
                )}
                {userBasicInfo.server_timestamp && (
                  <Container className="column">
                    <h6>Created Account</h6>
                    <p>
                      {new moment(userBasicInfo.server_timestamp).format(
                        "MMMM Do YYYY"
                      )}
                    </p>
                  </Container>
                )}
              </Space>

              {userInfo.bio && (
                <Container className="column">
                  <h6>Bio</h6>
                  <p className="break-word grey-1">{userInfo.bio}</p>
                </Container>
              )}

              <Space wrap>
                {userInfo.education !== undefined && (
                  <Container className="border-all align-center px8 py4 br4">
                    <FontAwesomeIcon className="mr8" icon={faSchool} />
                    <p>{educationList[userInfo.education]}</p>
                  </Container>
                )}
                {userInfo.kids !== undefined && (
                  <Container className="border-all align-center px8 py4 br4">
                    <FontAwesomeIcon className="mr8" icon={faBaby} />
                    <p>{kidsList[userInfo.kids]}</p>
                  </Container>
                )}
                {userInfo.partying !== undefined && (
                  <Container className="border-all align-center px8 py4 br4">
                    <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                    <p>{partyingList[userInfo.partying]}</p>
                  </Container>
                )}
                {userInfo.politics !== undefined && (
                  <Container className="border-all align-center px8 py4 br4">
                    <FontAwesomeIcon className="mr8" icon={faLandmark} />
                    <p>{politicalBeliefsList[userInfo.politics]}</p>
                  </Container>
                )}
                {userInfo.religion !== undefined && (
                  <Container className="border-all align-center px8 py4 br4">
                    <FontAwesomeIcon className="mr8" icon={faPray} />
                    <p>{userInfo.religion}</p>
                  </Container>
                )}
              </Space>
              {userBasicInfo.displayName &&
                search &&
                (user ? search !== user.uid : true) && (
                  <Container className="align-center justify-between">
                    {userBasicInfo.displayName &&
                      search &&
                      (user ? search !== user.uid : true) && (
                        <button
                          className="button-2 px16 py8 mr16 br8"
                          onClick={() => {
                            const userInteractionIssues = userSignUpProgress(
                              user
                            );

                            if (userInteractionIssues) {
                              if (userInteractionIssues === "NSI")
                                setStarterModal(true);
                              return;
                            }

                            startConversation(navigate, user, search);
                          }}
                        >
                          <FontAwesomeIcon className="mr8" icon={faComments} />
                          Message
                          {capitolizeFirstChar(userBasicInfo.displayName)}
                        </button>
                      )}
                    {userBasicInfo.displayName &&
                      search &&
                      user &&
                      search !== user.uid && (
                        <div className="relative">
                          <HandleOutsideClick
                            close={() => setPostOptions(false)}
                          >
                            <FontAwesomeIcon
                              className="clickable grey-9"
                              icon={faEllipsisV}
                              onClick={(e) => {
                                e.preventDefault();

                                setPostOptions(!postOptions);
                              }}
                              style={{ width: 20 }}
                            />
                            {postOptions && (
                              <div
                                className="absolute flex right-0"
                                style={{
                                  bottom: "calc(100% + 8px)",
                                  whiteSpace: "nowrap",
                                  zIndex: 1,
                                }}
                              >
                                <Container className="column x-fill bg-white border-all px16 py8 br8">
                                  {userBasicInfo.displayName &&
                                    search &&
                                    search !== user.uid && (
                                      <Container
                                        className="button-8 clickable align-center"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setBlockModal(!blockModal);
                                        }}
                                      >
                                        <p className=" flex-fill">Block User</p>
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
                        </div>
                      )}
                  </Container>
                )}
              {isUserOnline && isUserOnline.last_online && (
                <p>Last Seen: {moment(isUserOnline.last_online).fromNow()}</p>
              )}
            </Space>
          )}

          <h1 className="fs-26">Activity</h1>
          <Container className="ov-hidden column bg-white br8">
            <Container>
              <Container
                className={
                  "x-50 button-4 clickable full-center py16" +
                  isActive(postsSection)
                }
                onClick={() => setPostsSection(true)}
              >
                <h5 className="tac inherit-color">Posts</h5>
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
                <h5 className="tac inherit-color">Comments</h5>
              </Container>
            </Container>
          </Container>
          {postsSection && (
            <InfiniteScroll
              dataLength={vents.length}
              endMessage={
                vents.length !== 0 ? (
                  <p className="tac mt16">
                    <b>Yay! You have seen it all</b>
                  </p>
                ) : (
                  <div />
                )
              }
              hasMore={canLoadMoreVents}
              loader={
                <Container className="bg-red clickable x-fill column bg-white mt16 br8">
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
              }
              next={() =>
                getUsersVents(
                  isMounted,
                  search,
                  setCanLoadMoreVents,
                  setVents,
                  vents
                )
              }
              scrollableTarget="scrollable-div"
            >
              <Space className="x-fill" direction="vertical" size="middle">
                {vents &&
                  vents.map((vent, index) => (
                    <Vent
                      key={index}
                      navigate={navigate}
                      previewMode={true}
                      ventInit={vent}
                    />
                  ))}
                {vents && vents.length === 0 && <h4>No vents found.</h4>}
              </Space>
            </InfiniteScroll>
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
              {comments && comments.length === 0 && <h4>No comments found.</h4>}
              {canLoadMoreComments && (
                <Button
                  block
                  className="mt16"
                  onClick={() =>
                    getUsersComments(
                      isMounted,
                      search,
                      setCanLoadMoreComments,
                      setComments,
                      comments
                    )
                  }
                  size="large"
                  type="primary"
                >
                  Load More Comments
                </Button>
              )}
            </Container>
          )}
          {((!vents && postsSection) || (!comments && !postsSection)) && (
            <Container className="x-fill full-center">
              <LoadingHeart />
            </Container>
          )}
        </Space>

        <SubscribeColumn slot="8314288538" />
      </Container>
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => blockUser(user.uid, search)}
          title="Block User"
        />
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

export default ProfileSection;

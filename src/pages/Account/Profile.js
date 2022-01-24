import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import loadable from "@loadable/component";
import moment from "moment-timezone";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Space } from "antd";

import { faBaby } from "@fortawesome/pro-solid-svg-icons/faBaby";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faGlassCheers } from "@fortawesome/pro-solid-svg-icons/faGlassCheers";
import { faLandmark } from "@fortawesome/pro-solid-svg-icons/faLandmark";
import { faPray } from "@fortawesome/pro-solid-svg-icons/faPray";
import { faSchool } from "@fortawesome/pro-solid-svg-icons/faSchool";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  isMobileOrTablet,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import { getUser, getUsersComments, getUsersVents } from "./util";

const Comment = loadable(() => import("../../components/Comment"));
const ConfirmAlertModal = loadable(() =>
  import("../../components/modals/ConfirmAlert")
);
const Container = loadable(() =>
  import("../../components/containers/Container")
);
const HandleOutsideClick = loadable(() =>
  import("../../components/containers/HandleOutsideClick")
);
const KarmaBadge = loadable(() => import("../../components/KarmaBadge"));
const LoadingHeart = loadable(() => import("../../components/loaders/Heart"));
const MakeAvatar = loadable(() => import("../../components/MakeAvatar"));
const Page = loadable(() => import("../../components/containers/Page"));
const StarterModal = loadable(() => import("../../components/modals/Starter"));
const SubscribeColumn = loadable(() =>
  import("../../components/SubscribeColumn")
);
const Vent = loadable(() => import("../../components/Vent"));

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
  const [postsSection, setPostsSection] = useState(false);
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
        <Container
          className="column flex-fill gap16"
          style={{
            maxWidth: isMobileOrTablet() ? "" : "calc(100% - 316px)",
          }}
        >
          {search && (
            <Container className="column x-fill ov-hidden bg-white pa16 gap8 br8">
              <Container className="x-fill full-center">
                <MakeAvatar
                  displayName={userBasicInfo.displayName}
                  size="large"
                  userBasicInfo={userBasicInfo}
                />
              </Container>

              <Container className="wrap gap16">
                <Container className="column" direction="vertical">
                  <Container className="align-center gap8">
                    {isUserOnline && isUserOnline.state === "online" && (
                      <div className="online-dot" />
                    )}
                    <h1 className="ellipsis">
                      {capitolizeFirstChar(userBasicInfo.displayName)}
                    </h1>
                    <KarmaBadge userBasicInfo={userBasicInfo} />
                  </Container>
                  <p>{calculateKarma(userBasicInfo)} Karma Points</p>
                </Container>

                {(Boolean(
                  new moment().year() - new moment(userInfo.birth_date).year()
                ) ||
                  userInfo.gender ||
                  userInfo.pronouns) && (
                  <Container>
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
                  </Container>
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
              </Container>

              {userInfo.bio && (
                <Container className="column">
                  <h6>Bio</h6>
                  <p className="break-word grey-1">{userInfo.bio}</p>
                </Container>
              )}

              {(userInfo.education !== undefined ||
                userInfo.kids !== undefined ||
                userInfo.partying !== undefined ||
                userInfo.politics !== undefined ||
                userInfo.religion !== undefined) && (
                <Container className="wrap gap8">
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
                </Container>
              )}
              {userBasicInfo.displayName &&
                search &&
                (user ? search !== user.uid : true) && (
                  <Container className="align-center justify-between">
                    {userBasicInfo.displayName &&
                      search &&
                      (user ? search !== user.uid : true) && (
                        <Container
                          className="button-2 wrap px16 py8 mr16 br8"
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
                          <p className="inherit-color ellipsis">
                            Message{" "}
                            {capitolizeFirstChar(userBasicInfo.displayName)}
                          </p>
                        </Container>
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
                <Space align="center">
                  <p>Last Seen: {moment(isUserOnline.last_online).fromNow()}</p>
                </Space>
              )}
            </Container>
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
                <Container className="x-fill full-center">
                  <LoadingHeart />
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
              {comments && comments.length > 0 && (
                <Container className="column bg-white br8 px32 py16">
                  {comments &&
                    comments.map((comment, index) => {
                      return (
                        <Link
                          key={index}
                          to={"/problem/" + comment.ventID + "/"}
                        >
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
              )}
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
        </Container>

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

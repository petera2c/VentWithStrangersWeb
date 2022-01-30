import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { MentionsInput, Mention } from "react-mentions";
import { Button, Dropdown } from "antd";

import { faBirthdayCake } from "@fortawesome/pro-duotone-svg-icons/faBirthdayCake";
import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faEdit } from "@fortawesome/pro-light-svg-icons/faEdit";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-duotone-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-duotone-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Comment from "../Comment";
import ConfirmAlertModal from "../modals/ConfirmAlert";
import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import KarmaBadge from "../KarmaBadge";
import LoadingHeart from "../loaders/Heart";
import MakeAvatar from "../MakeAvatar";
import ReportModal from "../modals/Report";
import StarterModal from "../modals/Starter";
import Text from "../views/Text";

import { UserContext } from "../../context";

import {
  blockUser,
  canUserPost,
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
  hasUserBlockedUser,
  isUserAccountNew,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import {
  commentVent,
  deleteVent,
  findPossibleUsersToTag,
  getVent,
  getVentComments,
  getVentDescription,
  getVentPartialLink,
  likeOrUnlikeVent,
  newVentCommentListener,
  reportVent,
  startConversation,
  ventHasLiked,
} from "./util";

const SmartLink = ({ children, className, disablePostOnClick, to }) => {
  if (disablePostOnClick || !to) {
    return <Container className={className}>{children}</Container>;
  } else {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }
};

function Vent({
  disablePostOnClick,
  displayCommentField,
  isOnSingleVentPage,
  previewMode,
  searchPreviewMode,
  setDescription,
  setTitle,
  ventID,
  ventInit,
}) {
  const isMounted = useIsMounted();
  const textInput = useRef(null);
  const { user, userBasicInfo } = useContext(UserContext);

  const [activeSort, setActiveSort] = useState("first");
  const [author, setAuthor] = useState({});
  const [blockModal, setBlockModal] = useState(false);
  const [canLoadMoreComments, setCanLoadMoreComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentString, setCommentString] = useState("");
  const [deleteVentConfirm, setDeleteVentConfirm] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [postOptions, setPostOptions] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [vent, setVent] = useState(ventInit);

  const navigate = useNavigate();

  useEffect(() => {
    let newCommentListenerUnsubscribe;

    const ventSetUp = (newVent) => {
      if (setTitle && newVent && newVent.title && isMounted())
        setTitle(newVent.title);

      if (setDescription && newVent && newVent.description && isMounted())
        setDescription(newVent.description);

      getUserBasicInfo((author) => {
        if (isMounted()) setAuthor(author);
      }, newVent.userID);

      getIsUserOnline((isUserOnline) => {
        if (isMounted()) setIsUserOnline(isUserOnline.state);
      }, newVent.userID);

      if (isMounted()) setVent(newVent);

      if (user)
        hasUserBlockedUser(user.uid, newVent.userID, (isBlocked) => {
          if (isMounted()) setIsContentBlocked(isBlocked);
        });
    };

    if (!vent) getVent(ventSetUp, ventID);
    else ventSetUp(vent);

    if (!searchPreviewMode && displayCommentField)
      newCommentListenerUnsubscribe = newVentCommentListener(
        isMounted,
        setCanLoadMoreComments,
        setComments,
        user ? user.uid : "",
        ventID
      );

    if (!searchPreviewMode && !previewMode) {
      getVentComments(
        activeSort,
        comments,
        isMounted,
        setCanLoadMoreComments,
        setComments,
        false,
        ventID
      );
    }

    if (user && !searchPreviewMode)
      ventHasLiked(
        (newHasLiked) => {
          if (isMounted()) setHasLiked(newHasLiked);
        },
        user.uid,
        ventID
      );

    return () => {
      if (newCommentListenerUnsubscribe) newCommentListenerUnsubscribe();
    };
  }, [isMounted, user, ventID]);

  if ((!vent || (vent && !vent.server_timestamp)) && isOnSingleVentPage)
    return (
      <Container className="x-fill full-center">
        <LoadingHeart />
      </Container>
    );

  if (isContentBlocked) return <div />;

  return (
    <Container className="x-fill">
      {vent && (
        <Container className="x-fill column bg-white pt16 br8">
          <SmartLink
            className={
              "main-container x-fill justify-between border-bottom py16 px32 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            to={vent && vent.title && vent.id ? getVentPartialLink(vent) : ""}
          >
            <Container className="align-center wrap gap8">
              <MakeAvatar
                displayName={author.displayName}
                userBasicInfo={author}
              />
              <Container className="flex-fill full-center ov-hidden">
                <Text
                  className="button-1 ellipsis fw-400 mr8"
                  onClick={(e) => {
                    e.preventDefault();
                    if (author.id) navigate("/profile?" + author.id);
                  }}
                  text={capitolizeFirstChar(author.displayName)}
                  type="h5"
                />
                {isUserOnline && <div className="online-dot mr8" />}
              </Container>
              <KarmaBadge userBasicInfo={author} />
              {vent.is_birthday_post && (
                <Container className="align-center gap8">
                  <FontAwesomeIcon
                    className="orange"
                    icon={faBirthdayCake}
                    size="3x"
                  />
                  <FontAwesomeIcon
                    className="purple"
                    icon={faBirthdayCake}
                    size="3x"
                  />
                </Container>
              )}
            </Container>
            <Container className="relative flex-fill align-center justify-end">
              {user && (
                <HandleOutsideClick close={() => setPostOptions(false)}>
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
                        top: "calc(100% + 8px)",
                        whiteSpace: "nowrap",
                        zIndex: 10,
                      }}
                    >
                      <Container className="column x-fill bg-white border-all px16 py8 br8">
                        {vent.userID === user.uid && (
                          <Container
                            className="button-8 clickable align-center mb8"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate("/vent-to-strangers?" + vent.id);
                            }}
                          >
                            <Text
                              className="fw-400 flex-fill"
                              text="Edit Vent"
                              type="p"
                            />
                            <FontAwesomeIcon className="ml8" icon={faEdit} />
                          </Container>
                        )}
                        {vent.userID === user.uid && (
                          <Container
                            className="button-8 clickable align-center"
                            onClick={(e) => {
                              e.preventDefault();
                              setDeleteVentConfirm(true);
                              setPostOptions(false);
                            }}
                          >
                            <Text
                              className="fw-400 flex-fill"
                              text="Delete Vent"
                              type="p"
                            />
                            <FontAwesomeIcon className="ml8" icon={faTrash} />
                          </Container>
                        )}
                        {vent.userID !== user.uid && (
                          <Container
                            className="button-8 clickable align-center mb8"
                            onClick={(e) => {
                              e.preventDefault();
                              setReportModal(!reportModal);
                            }}
                          >
                            <Text
                              className="fw-400 flex-fill"
                              text="Report Vent"
                              type="p"
                            />
                            <FontAwesomeIcon
                              className="ml8"
                              icon={faExclamationTriangle}
                            />
                          </Container>
                        )}
                        {vent.userID !== user.uid && (
                          <Container
                            className="button-8 clickable align-center"
                            onClick={(e) => {
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
            </Container>
          </SmartLink>
          <SmartLink
            className={
              "main-container column border-bottom py16 px32 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            to={vent && vent.title && vent.id ? getVentPartialLink(vent) : ""}
          >
            <Text className="fs-20 primary mb8" text={vent.title} type="h1" />

            <p
              className="fw-400 grey-1 description"
              style={{
                WebkitLineClamp: displayCommentField ? 150 : 3,
                lineClamp: displayCommentField ? 150 : 3,
              }}
            >
              {getVentDescription(previewMode, vent)}
            </p>
            <Container className="x-fill align-center justify-end">
              <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
              <Text
                className="grey-5 fs-16"
                text={moment(vent.server_timestamp).fromNow()}
                type="p"
              />
            </Container>
          </SmartLink>

          {!searchPreviewMode && (
            <Container
              className={
                "relative justify-between wrap py16 px32 gap8 " +
                (!searchPreviewMode && displayCommentField
                  ? "border-bottom"
                  : "")
              }
            >
              <Container className="align-center gap16">
                <Container className="align-center gap4">
                  <img
                    alt="Support"
                    className={`clickable heart ${hasLiked ? "red" : "grey-5"}`}
                    onClick={(e) => {
                      e.preventDefault();

                      const userInteractionIssues = userSignUpProgress(user);

                      if (userInteractionIssues) {
                        if (userInteractionIssues === "NSI")
                          setStarterModal(true);
                        return;
                      }

                      likeOrUnlikeVent(
                        hasLiked,
                        setHasLiked,
                        setVent,
                        user,
                        vent
                      );
                    }}
                    src={
                      hasLiked
                        ? "/svgs/support-active.svg"
                        : "/svgs/support.svg"
                    }
                    style={{ height: "32px" }}
                    title="Give Support :)"
                  />
                  <Text
                    className="grey-5"
                    text={vent.like_counter ? vent.like_counter : 0}
                    type="p"
                  />
                </Container>

                <SmartLink
                  className="flex align-center gap4"
                  disablePostOnClick={disablePostOnClick}
                  to={
                    vent && vent.title && vent.id
                      ? getVentPartialLink(vent)
                      : ""
                  }
                >
                  <FontAwesomeIcon
                    className="clickable blue"
                    icon={faComments}
                    onClick={() => {
                      if (disablePostOnClick) textInput.current.focus();
                    }}
                    size="2x"
                  />
                  <p className="grey-5">
                    {vent.comment_counter ? vent.comment_counter : 0}
                  </p>
                </SmartLink>
              </Container>

              {(!user || (user && user.uid !== vent.userID && author.id)) && (
                <Container
                  className="button-2 wrap px16 py8 br8"
                  onClick={() => {
                    const userInteractionIssues = userSignUpProgress(user);

                    if (userInteractionIssues) {
                      if (userInteractionIssues === "NSI")
                        setStarterModal(true);
                      return;
                    }

                    startConversation(navigate, user, vent.userID);
                  }}
                >
                  <FontAwesomeIcon className="mr8" icon={faComments} />
                  <p className="inherit-color ellipsis">
                    Message {capitolizeFirstChar(author.displayName)}
                  </p>
                </Container>
              )}
            </Container>
          )}

          {!searchPreviewMode && displayCommentField && comments && (
            <Container className="column gap16">
              {vent.comment_counter > 0 && (
                <Container className="border-bottom px32 py16">
                  <Dropdown
                    overlay={
                      <Container className="column bg-white shadow-2 pa8 br8">
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("first");
                            getVentComments(
                              "first",
                              [],
                              isMounted,
                              setCanLoadMoreComments,
                              setComments,
                              false,
                              ventID ? ventID : vent.id
                            );
                          }}
                        >
                          First
                        </p>
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("best");
                            getVentComments(
                              "best",
                              [],
                              isMounted,
                              setCanLoadMoreComments,
                              setComments,
                              false,
                              ventID ? ventID : vent.id
                            );
                          }}
                        >
                          Best
                        </p>
                        <p
                          className="button-4 py8"
                          onClick={() => {
                            setActiveSort("last");
                            getVentComments(
                              "last",
                              [],
                              isMounted,
                              setCanLoadMoreComments,
                              setComments,
                              false,
                              ventID ? ventID : vent.id
                            );
                          }}
                        >
                          Last
                        </p>
                      </Container>
                    }
                    trigger={["click"]}
                  >
                    <button className="blue">
                      Sort By: {capitolizeFirstChar(activeSort)}
                    </button>
                  </Dropdown>
                </Container>
              )}
              {comments && comments.length > 0 && (
                <Container className="column px32 pb16">
                  {comments.map((comment, index) => {
                    return (
                      <Comment
                        arrayLength={comments.length}
                        commentID={comment.id}
                        commentIndex={index}
                        comment2={comment}
                        setComments={setComments}
                        ventUserID={vent.userID}
                        key={comment.id}
                      />
                    );
                  })}
                  {canLoadMoreComments && (
                    <button
                      className="blue underline"
                      onClick={() => {
                        getVentComments(
                          activeSort,
                          comments,
                          isMounted,
                          setCanLoadMoreComments,
                          setComments,
                          true,
                          vent.id
                        );
                      }}
                      key={comments.length}
                    >
                      Load More Comments
                    </button>
                  )}
                </Container>
              )}
              {vent.comment_counter === 0 &&
                (!comments || (comments && comments.length === 0)) && (
                  <p className="tac px32 py16">
                    There are no comments yet. Please help this person :)
                  </p>
                )}
            </Container>
          )}
          {displayCommentField && !comments && (
            <Container className="x-fill full-center">
              <LoadingHeart />
            </Container>
          )}

          {!searchPreviewMode && displayCommentField && (
            <Container
              className="sticky column x-fill bg-white border-top shadow-2 br8 pa16"
              style={{ bottom: 0 }}
            >
              {isUserAccountNew(userBasicInfo) && (
                <Link to="/rules">
                  <button className="blue ml8 mb8" size="large" type="link">
                    Read Our VWS Rules
                  </button>
                </Link>
              )}
              <Container className="flex-fill align-center gap8">
                <Container className="relative column flex-fill">
                  <MentionsInput
                    className="mentions"
                    onChange={(e) => {
                      if (!canUserPost(userBasicInfo)) return;

                      setCommentString(e.target.value);
                    }}
                    placeholder="Say something nice :)"
                    inputRef={textInput}
                    value={commentString}
                  >
                    <Mention
                      className="mentions__mention"
                      data={(currentTypingTag, callback) => {
                        findPossibleUsersToTag(
                          currentTypingTag,
                          vent.id,
                          callback
                        );
                      }}
                      markup="@[__display__](__id__)"
                      renderSuggestion={(
                        entry,
                        search,
                        highlightedDisplay,
                        index,
                        focused
                      ) => {
                        return (
                          <Container className="flex-fill align-center pa8 gap8">
                            <MakeAvatar
                              displayName={entry.displayName}
                              userBasicInfo={entry}
                            />
                            <Container className="button-7">
                              <h5 className="ellipsis fw-400 mr8">
                                {capitolizeFirstChar(entry.displayName)}
                              </h5>
                            </Container>
                            <KarmaBadge userBasicInfo={entry} noOnClick />
                          </Container>
                        );
                      }}
                      trigger="@"
                    />
                  </MentionsInput>
                </Container>
                <Button
                  onClick={async () => {
                    const userInteractionIssues = userSignUpProgress(user);

                    if (userInteractionIssues) {
                      if (userInteractionIssues === "NSI")
                        setStarterModal(true);
                      return;
                    }

                    if (!commentString) return;
                    commentVent(commentString, setVent, user, vent, vent.id);

                    setCommentString("");
                  }}
                  size="large"
                  type="primary"
                >
                  Send
                </Button>
              </Container>
            </Container>
          )}
        </Container>
      )}

      {deleteVentConfirm && (
        <ConfirmAlertModal
          close={() => setDeleteVentConfirm(false)}
          message="Are you sure you would like to delete this vent?"
          submit={() => deleteVent(navigate, vent.id)}
          title="Delete Vent"
        />
      )}

      {reportModal && (
        <ReportModal
          close={() => setReportModal(false)}
          submit={(option) => reportVent(option, user.uid, vent.id)}
        />
      )}
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => blockUser(user.uid, vent.userID)}
          title="Block User"
        />
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Container>
  );
}

export default Vent;

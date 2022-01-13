import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import { MentionsInput, Mention } from "react-mentions";

import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faEdit } from "@fortawesome/pro-light-svg-icons/faEdit";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-duotone-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-duotone-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "../views/Button";
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
  calculateKarma,
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
  hasUserBlockedUser,
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

import "./style.css";

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
  ventInit,
}) {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const [author, setAuthor] = useState({});
  const [commentString, setCommentString] = useState("");
  const [deleteVentConfirm, setDeleteVentConfirm] = useState(false);
  const [displayCommentField2, setDisplayCommentField] = useState(
    displayCommentField
  );
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [isUserOnline, setIsUserOnline] = useState(false);

  const [blockModal, setBlockModal] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [postOptions, setPostOptions] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [vent, setVent] = useState(ventInit);

  const navigate = useNavigate();

  useEffect(() => {
    let newCommentListenerUnsubscribe;
    getVent((newVent) => {
      if (setTitle && newVent && newVent.title && isMounted())
        setTitle(newVent.title);

      if (setDescription && newVent && newVent.description && isMounted())
        setDescription(newVent.description);

      getUserBasicInfo((author) => {
        if (isMounted()) setAuthor(author);
      }, newVent.userID);

      getIsUserOnline((isUserOnline) => {
        if (isMounted()) setIsUserOnline(isUserOnline);
      }, newVent.userID);

      if (isMounted()) setVent(newVent);
    }, vent.id);

    if (user) {
      hasUserBlockedUser(user.uid, vent.userID, (isBlocked) => {
        if (isMounted()) setIsContentBlocked(isBlocked);
      });
    }

    if (!searchPreviewMode && displayCommentField2)
      newCommentListenerUnsubscribe = newVentCommentListener(
        isMounted,
        setComments,
        vent.id
      );

    if (!searchPreviewMode)
      getVentComments(comments, isMounted, setComments, vent.id);

    if (user && !searchPreviewMode)
      ventHasLiked(
        (newHasLiked) => {
          if (isMounted()) setHasLiked(newHasLiked);
        },
        user.uid,
        vent.id
      );

    return () => {
      if (newCommentListenerUnsubscribe) newCommentListenerUnsubscribe();
    };
  }, []);

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
        <Container className="x-fill column bg-white py16 br8">
          <SmartLink
            className={
              "main-container x-fill justify-between border-bottom py16 px32 " +
              (disablePostOnClick ? "" : "clickable")
            }
            disablePostOnClick={disablePostOnClick}
            to={vent && vent.title && vent.id ? getVentPartialLink(vent) : ""}
          >
            <Container
              className="full-center pr32"
              onClick={(e) => {
                e.preventDefault();
                if (author.id) navigate("/profile?" + author.id);
              }}
            >
              <MakeAvatar
                displayName={author.displayName}
                userBasicInfo={author}
              />
              <Container className="flex-fill full-center ov-hidden">
                <Text
                  className="button-1 ellipsis fw-400 mr8"
                  text={capitolizeFirstChar(author.displayName)}
                  type="h5"
                />
                {isUserOnline && <div className="online-dot mr8" />}
              </Container>
              <KarmaBadge karma={calculateKarma(author)} />
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
              className="fs-18 fw-400 grey-1"
              style={{ whiteSpace: "pre-line" }}
            >
              {getVentDescription(previewMode, vent)}
            </p>
            <Container className="x-fill align-center justify-end">
              <FontAwesomeIcon className="grey-5 mr8" icon={faClock} />
              <Text
                className="grey-5 fs-16"
                text={moment(vent.server_timestamp)
                  .subtract(1, "minute")
                  .fromNow()}
                type="p"
              />
            </Container>
          </SmartLink>

          {!searchPreviewMode && (
            <Container
              className={
                "relative wrap justify-between py16 px32 " +
                (!searchPreviewMode && displayCommentField2
                  ? "border-bottom"
                  : "")
              }
            >
              <Container className="x-fill align-center justify-between wrap">
                <Container className="align-center mb16">
                  <img
                    alt="Support"
                    className={`clickable heart ${
                      hasLiked ? "red" : "grey-5"
                    } mr4`}
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
                    className="grey-5 mr8"
                    text={vent.like_counter ? vent.like_counter : 0}
                    type="p"
                  />

                  <Button
                    className="button-2 no-text-wrap px16 py8 mr16 br8"
                    onClick={(e) => {
                      e.preventDefault();
                      setDisplayCommentField(!displayCommentField2);
                    }}
                  >
                    {vent.comment_counter ? vent.comment_counter : 0}{" "}
                    {vent.comment_counter === 1 ? "Comment" : "Comments"}
                  </Button>
                </Container>

                <Container className="mb16">
                  {(!user ||
                    (user && user.uid !== vent.userID && author.id)) && (
                    <Button
                      className="button-2 px16 py8 br8"
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
                      Message {capitolizeFirstChar(author.displayName)}
                    </Button>
                  )}
                </Container>
              </Container>
            </Container>
          )}
          {!searchPreviewMode && displayCommentField2 && (
            <Container
              className={
                "x-fill " +
                (comments && comments.length > 0 ? "border-bottom" : "")
              }
            >
              <Container className="x-fill column py16 br8">
                <Container className="x-fill px16">
                  <Container className="column x-fill align-end br8">
                    <Container className="relative x-fill">
                      <MentionsInput
                        autoFocus
                        className="mentions"
                        onChange={(e) => setCommentString(e.target.value)}
                        placeholder="Say something nice :)"
                        value={commentString}
                      >
                        <Mention
                          className="mentions__mention"
                          data={(currentTypingTag, callback) => {
                            findPossibleUsersToTag(
                              currentTypingTag,
                              () => {},
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
                              <Container
                                className="button-7 column pa16"
                                key={entry.id}
                              >
                                <Text text={entry.display} type="h6" />
                              </Container>
                            );
                          }}
                          trigger="@"
                        />
                      </MentionsInput>
                    </Container>

                    <Button
                      className="button-2 px32 py8 mt8 br4"
                      onClick={async () => {
                        const userInteractionIssues = userSignUpProgress(user);

                        if (userInteractionIssues) {
                          if (userInteractionIssues === "NSI")
                            setStarterModal(true);
                          return;
                        }

                        if (!commentString) return;
                        commentVent(
                          commentString,
                          setVent,
                          user,
                          vent,
                          vent.id
                        );

                        setCommentString("");
                      }}
                      text="Send"
                    />
                  </Container>
                </Container>
              </Container>
            </Container>
          )}
          {!searchPreviewMode && displayCommentField2 && comments && (
            <Container className="column mb16">
              <Container className="column br8">
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
                {vent.comment_counter > comments.length && (
                  <Button
                    className="blue underline"
                    onClick={() => {
                      getVentComments(
                        comments,
                        isMounted,
                        setComments,
                        vent.id
                      );
                    }}
                    key={comments.length}
                  >
                    Load More Comments
                  </Button>
                )}
              </Container>
            </Container>
          )}
          {displayCommentField2 && !comments && (
            <Container className="x-fill full-center">
              <LoadingHeart />
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

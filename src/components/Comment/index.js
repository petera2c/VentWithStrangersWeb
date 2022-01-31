import React, { useContext, useEffect, useState } from "react";
import moment from "moment-timezone";
import { MentionsInput, Mention } from "react-mentions";
import { useNavigate } from "react-router-dom";
import { Space } from "antd";

import { faClock } from "@fortawesome/pro-regular-svg-icons/faClock";
import { faEdit } from "@fortawesome/pro-light-svg-icons/faEdit";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons/faExclamationTriangle";
import { faHeart } from "@fortawesome/pro-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/pro-solid-svg-icons/faHeart";
import { faTrash } from "@fortawesome/pro-duotone-svg-icons/faTrash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "../views/Button";
import ConfirmAlertModal from "../modals/ConfirmAlert";
import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import KarmaBadge from "../KarmaBadge";
import ReportModal from "../modals/Report";
import StarterModal from "../modals/Starter";
import Text from "../views/Text";
import MakeAvatar from "../MakeAvatar";

import { UserContext } from "../../context";

import {
  blockUser,
  userSignUpProgress,
  capitolizeFirstChar,
  getIsUserOnline,
  getUserBasicInfo,
  hasUserBlockedUser,
  useIsMounted,
} from "../../util";
import {
  deleteComment,
  editComment,
  getCommentHasLiked,
  likeOrUnlikeComment,
  reportComment,
  swapTags,
} from "./util";
import { findPossibleUsersToTag } from "../Vent/util";

function Comment({
  arrayLength,
  comment2,
  commentID,
  commentIndex,
  setComments,
  ventUserID,
}) {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [blockModal, setBlockModal] = useState(false);
  const [comment, setComment] = useState(comment2);
  const [commentOptions, setCommentOptions] = useState(false);
  const [commentString, setCommentString] = useState("");
  const [deleteCommentConfirm, setDeleteCommentConfirm] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState({});

  useEffect(() => {
    if (user) {
      hasUserBlockedUser(user.uid, comment.userID, setIsContentBlocked);
      getCommentHasLiked(
        commentID,
        (hasLiked) => {
          if (isMounted()) setHasLiked(hasLiked);
        },
        user.uid
      );
    }

    getUserBasicInfo((newBasicUserInfo) => {
      if (isMounted()) setUserBasicInfo(newBasicUserInfo);
    }, comment2.userID);
    getIsUserOnline((isUserOnline) => {
      if (isMounted()) setIsUserOnline(isUserOnline.state);
    }, comment2.userID);
  }, [commentID, comment2.userID, comment.userID, isMounted, user]);

  if (isContentBlocked) return <div />;

  return (
    <Container
      className="x-fill column bg-white mt1"
      style={{
        borderTopLeftRadius: commentIndex === 0 ? "8px" : "",
        borderTopRightRadius: commentIndex === 0 ? "8px" : "",
        borderBottomLeftRadius: arrayLength - 1 === commentIndex ? "8px" : "",
        borderBottomRightRadius: arrayLength - 1 === commentIndex ? "8px" : "",
      }}
    >
      <Container className="justify-between py16">
        <Space
          align="center"
          className="clickable mb8"
          onClick={(e) => {
            e.preventDefault();
            navigate("/profile?" + comment.userID);
          }}
          wrap
        >
          <MakeAvatar
            displayName={userBasicInfo.displayName}
            userBasicInfo={userBasicInfo}
          />
          {userBasicInfo && (
            <Container className="full-center">
              <Text
                className="button-1 fw-400 mr8"
                text={capitolizeFirstChar(userBasicInfo.displayName)}
                type="h5"
              />
              {isUserOnline && <div className="online-dot mr8" />}
            </Container>
          )}
          {userBasicInfo && <KarmaBadge userBasicInfo={userBasicInfo} />}
        </Space>
        <Container className="relative column full-center">
          {user && (
            <HandleOutsideClick close={() => setCommentOptions(false)}>
              <FontAwesomeIcon
                className="clickable grey-9"
                icon={faEllipsisV}
                onClick={(e) => {
                  e.preventDefault();
                  setCommentOptions(!commentOptions);
                }}
              />
              {commentOptions && (
                <div
                  className="absolute flex right-0"
                  style={{
                    top: "calc(100% - 8px)",
                    whiteSpace: "nowrap",
                    zIndex: 1,
                  }}
                >
                  <Container className="column x-fill bg-white border-all px16 py8 br8">
                    {user && comment.userID === user.uid && (
                      <Container
                        className="button-8 clickable align-center mb8"
                        onClick={(e) => {
                          e.preventDefault();
                          setCommentOptions(false);
                          setCommentString(comment.text);
                          setEditingComment(true);
                        }}
                      >
                        <p className="flex-fill ic">Edit Comment</p>
                        <FontAwesomeIcon className="ml8" icon={faEdit} />
                      </Container>
                    )}
                    {user &&
                      (comment.userID === user.uid ||
                        (ventUserID && ventUserID === user.uid)) && (
                        <Container
                          className="button-8 clickable align-center"
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteCommentConfirm(true);
                            setCommentOptions(false);
                          }}
                        >
                          <p className="flex-fill ic">Delete Comment</p>
                          <FontAwesomeIcon className="ml8" icon={faTrash} />
                        </Container>
                      )}
                    {comment.userID !== user.uid && (
                      <Container
                        className="button-8 clickable align-center"
                        onClick={(e) => {
                          e.preventDefault();
                          setReportModal(!reportModal);
                        }}
                      >
                        <p className="flex-fill ic">Report Comment</p>
                        <FontAwesomeIcon
                          className="ml8"
                          icon={faExclamationTriangle}
                        />
                      </Container>
                    )}
                    {comment.userID !== user.uid && (
                      <Container
                        className="button-8 clickable align-center"
                        onClick={(e) => {
                          e.preventDefault();
                          setBlockModal(!blockModal);
                        }}
                      >
                        <p className="flex-fill ic">Block User</p>
                        <FontAwesomeIcon
                          className="ml8"
                          icon={faExclamationTriangle}
                        />
                      </Container>
                    )}
                  </Container>
                </div>
              )}
            </HandleOutsideClick>
          )}
        </Container>
      </Container>
      {!editingComment && <Text type="p">{swapTags(comment.text)}</Text>}
      {editingComment && (
        <Container className="column x-fill align-end br8">
          <Container className="relative x-fill">
            <MentionsInput
              className="mentions"
              onChange={(e) => {
                setCommentString(e.target.value);
              }}
              value={commentString}
            >
              <Mention
                className="mentions__mention"
                data={(currentTypingTag, callback) => {
                  findPossibleUsersToTag(
                    currentTypingTag,
                    comment.ventID,
                    callback
                  );
                }}
                markup="@{{[[[__id__]]]||[[[__display__]]]}}"
                renderSuggestion={(
                  entry,
                  search,
                  highlightedDisplay,
                  index,
                  focused
                ) => {
                  return (
                    <Container className="button-7 column pa16" key={entry.id}>
                      <Text text={entry.display} type="h6" />
                    </Container>
                  );
                }}
                trigger="@"
              />
            </MentionsInput>
          </Container>
          <Container className="mt8">
            <Button
              className="button-5 px32 py8 mr8 br4"
              text="Cancel"
              onClick={() => setEditingComment(false)}
            />
            <Button
              className="button-2 px32 py8 br4"
              onClick={() => {
                editComment(comment.id, commentString, setComments);
                setEditingComment(false);
              }}
              text="Save"
            />
          </Container>
        </Container>
      )}
      <Space className="align-center justify-between py16" wrap>
        <Container
          className="clickable align-center"
          onClick={async (e) => {
            e.preventDefault();
            const userInteractionIssues = userSignUpProgress(user);

            if (userInteractionIssues) {
              if (userInteractionIssues === "NSI") setStarterModal(true);
              return;
            }

            await likeOrUnlikeComment(comment, hasLiked, user);
            await getCommentHasLiked(commentID, setHasLiked, user.uid);
            if (hasLiked) comment.like_counter--;
            else comment.like_counter++;
            setComment({ ...comment });
          }}
        >
          <FontAwesomeIcon
            className={`heart ${hasLiked ? "red" : "grey-5"} mr4`}
            icon={hasLiked ? faHeart2 : faHeart}
          />
          <Text
            className="grey-5"
            text={comment.like_counter ? comment.like_counter : 0}
            type="p"
          />
        </Container>
        <Container className="align-center">
          <FontAwesomeIcon className="clickable grey-5 mr8" icon={faClock} />
          <Text
            className="grey-5 fs-16"
            text={moment(comment.server_timestamp).fromNow()}
            type="p"
          />
        </Container>
      </Space>
      {reportModal && (
        <ReportModal
          close={() => setReportModal(false)}
          submit={(option) =>
            reportComment(option, user.uid, comment.id, comment.ventID)
          }
        />
      )}
      {deleteCommentConfirm && (
        <ConfirmAlertModal
          close={() => setDeleteCommentConfirm(false)}
          message="Are you sure you would like to delete this comment?"
          submit={() => deleteComment(comment.id, setComments)}
          title="Delete Comment"
        />
      )}
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their vents or comments. Are you sure you would like to block this user?"
          submit={() => blockUser(user.uid, comment.userID)}
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

export default Comment;

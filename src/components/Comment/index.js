import React, { useContext, useEffect, useState } from "react";
import moment from "moment-timezone";
import TextArea from "react-textarea-autosize";
import { MentionsInput, Mention } from "react-mentions";
import { useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons/faClock";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import { faHeart as faHeart2 } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faEdit } from "@fortawesome/pro-light-svg-icons/faEdit";
import { faTrash } from "@fortawesome/pro-duotone-svg-icons/faTrash";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons/faExclamationTriangle";

import Container from "../containers/Container";
import Text from "../views/Text";
import Button from "../views/Button";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import ConfirmAlertModal from "../modals/ConfirmAlert";
import ReportModal from "../modals/Report";
import KarmaBadge from "../KarmaBadge";
import { UserContext } from "../../context";

import {
  blockUser,
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  hasUserBlockedUser
} from "../../util";
import {
  deleteComment,
  editComment,
  getComment,
  getCommentHasLiked,
  likeOrUnlikeComment,
  reportComment,
  swapTags
} from "./util";
import { findPossibleUsersToTag } from "../Vent/util";

function Comment({
  arrayLength,
  comment2,
  commentID,
  commentIndex,
  setComments,
  setPossibleUsersToTag,
  ventUserID
}) {
  const history = useHistory();
  const user = useContext(UserContext);
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [blockModal, setBlockModal] = useState(false);
  const [comment, setComment] = useState(comment2);
  const [commentOptions, setCommentOptions] = useState(false);
  const [commentString, setCommentString] = useState("");
  const [deleteCommentConfirm, setDeleteCommentConfirm] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isContentBlocked, setIsContentBlocked] = useState(user ? true : false);
  const [reportModal, setReportModal] = useState(false);

  useEffect(() => {
    if (user) hasUserBlockedUser(user.uid, comment.userID, setIsContentBlocked);
    getUserBasicInfo(setUserBasicInfo, comment2.userID);
    if (user) getCommentHasLiked(commentID, setHasLiked, user.uid);
  }, []);
  if (isContentBlocked) return <div />;

  const displayName = userBasicInfo.displayName
    ? userBasicInfo.displayName
    : "Anonymous";

  return (
    <Container
      className="x-fill column bg-white mt1"
      style={{
        borderTopLeftRadius: commentIndex === 0 ? "8px" : "",
        borderTopRightRadius: commentIndex === 0 ? "8px" : "",
        borderBottomLeftRadius: arrayLength - 1 === commentIndex ? "8px" : "",
        borderBottomRightRadius: arrayLength - 1 === commentIndex ? "8px" : ""
      }}
    >
      <Container className="justify-between wrap py16 px32">
        <Container
          className="clickable align-center mb8"
          onClick={e => {
            e.preventDefault();
            history.push("/profile?" + comment.userID);
          }}
        >
          {userBasicInfo && (
            <Text
              className="round-icon bg-blue white mr8"
              text={capitolizeFirstChar(displayName[0])}
              type="h6"
            />
          )}
          {userBasicInfo && (
            <Text
              className="button-1 fw-400 mr8"
              text={capitolizeFirstChar(displayName)}
              type="h5"
            />
          )}
          {userBasicInfo && (
            <KarmaBadge karma={calculateKarma(userBasicInfo)} />
          )}
        </Container>
        <Container className="relative column full-center">
          {user && (
            <HandleOutsideClick close={() => setCommentOptions(false)}>
              <FontAwesomeIcon
                className="clickable grey-9 pl16"
                icon={faEllipsisV}
                onClick={e => {
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
                    zIndex: 1
                  }}
                >
                  <Container className="column x-fill bg-white border-all px16 py8 br8">
                    {user && comment.userID === user.uid && (
                      <Container
                        className="button-8 clickable align-center mb8"
                        onClick={e => {
                          e.preventDefault();
                          setCommentOptions(false);
                          setCommentString(comment.text);
                          setEditingComment(true);
                        }}
                      >
                        <Text
                          className="flex-fill"
                          text="Edit Comment"
                          type="p"
                        />
                        <FontAwesomeIcon className="ml8" icon={faEdit} />
                      </Container>
                    )}
                    {user &&
                      (comment.userID === user.uid ||
                        (ventUserID && ventUserID === user.uid)) && (
                        <Container
                          className="button-8 clickable align-center"
                          onClick={e => {
                            e.preventDefault();
                            setDeleteCommentConfirm(true);
                            setCommentOptions(false);
                          }}
                        >
                          <Text
                            className="flex-fill"
                            text="Delete Comment"
                            type="p"
                          />
                          <FontAwesomeIcon className="ml8" icon={faTrash} />
                        </Container>
                      )}
                    {comment.userID !== user.uid && (
                      <Container
                        className="button-8 clickable align-center"
                        onClick={e => {
                          e.preventDefault();
                          setReportModal(!reportModal);
                        }}
                      >
                        <Text
                          className="flex-fill"
                          text="Report Comment"
                          type="p"
                        />
                        <FontAwesomeIcon
                          className="ml8"
                          icon={faExclamationTriangle}
                        />
                      </Container>
                    )}
                    {comment.userID !== user.uid && (
                      <Container
                        className="button-8 clickable align-center"
                        onClick={e => {
                          e.preventDefault();
                          setBlockModal(!blockModal);
                        }}
                      >
                        <Text
                          className="flex-fill"
                          text="Block User"
                          type="p"
                        />
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
      {!editingComment && (
        <Text className="px32" type="p">
          {swapTags(comment.text)}
        </Text>
      )}
      {editingComment && (
        <Container className="column x-fill align-end px32 br8">
          <Container className="relative x-fill">
            <MentionsInput
              className="mentions"
              onChange={e => {
                setCommentString(e.target.value);
              }}
              value={commentString}
            >
              <Mention
                className="mentions__mention"
                data={(currentTypingTag, callback) => {
                  findPossibleUsersToTag(
                    currentTypingTag,
                    setPossibleUsersToTag,
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
      <Container className="align-center justify-between">
        <Container
          className="clickable align-center py16 px32"
          onClick={async e => {
            e.preventDefault();
            if (!user)
              return alert(
                "You must sign in or register an account to support a comment!"
              );
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
        <Container className="align-center wrap py16 px32">
          <FontAwesomeIcon className="clickable grey-5 mr8" icon={faClock} />
          <Text
            className="grey-5 fs-16"
            text={moment(comment.server_timestamp)
              .subtract(1, "minute")
              .fromNow()}
            type="p"
          />
        </Container>
      </Container>
      {reportModal && (
        <ReportModal
          close={() => setReportModal(false)}
          submit={option =>
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
    </Container>
  );
}

export default Comment;

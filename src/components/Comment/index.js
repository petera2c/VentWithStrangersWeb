import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import TextArea from "react-textarea-autosize";
import { MentionsInput, Mention } from "react-mentions";

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

import { capitolizeFirstChar } from "../../util";
import {
  commentListener,
  deleteComment,
  editComment,
  likeComment,
  swapTags,
} from "./util";
import { findPossibleUsersToTag } from "../Vent/util";

function Comment({ arrayLength, commentID, commentIndex }) {
  const [comment, setComment] = useState(false);
  const [commentOptions, setCommentOptions] = useState(false);
  const [commentString, setCommentString] = useState("");
  const [deleteCommentConfirm, setDeleteCommentConfirm] = useState(false);
  const [editingComment, setEditingComment] = useState(false);

  useEffect(() => {
    commentListener(commentID, setComment);
  }, []);

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
      <Container className="justify-between wrap py16 px32">
        <Container
          className="clickable align-center mb8"
          onClick={(e) => {
            e.preventDefault();
            history.push("/activity?" + comment.authorID);
          }}
        >
          <Text
            className="round-icon bg-blue white mr8"
            text={capitolizeFirstChar(comment.author)}
            type="h6"
          />
          <Text
            className="button-1 fw-400"
            text={capitolizeFirstChar(comment.author)}
            type="h5"
          />
        </Container>
        <Container className="relative column full-center">
          <HandleOutsideClick close={() => setCommentOptions(false)}>
            <FontAwesomeIcon
              className="clickable grey-9 pl16"
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
                <Container className="column x-fill bg-white border-all2 border-all px16 py8 br8">
                  {comment.wasCreatedByUser && (
                    <Container
                      className="button-8 clickable align-center mb8"
                      onClick={(e) => {
                        e.preventDefault();
                        setCommentOptions(false);
                        setCommenetString(comment.text);
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
                  {comment.wasCreatedByUser && (
                    <Container
                      className="button-8 clickable align-center"
                      onClick={(e) => {
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
                  {!comment.wasCreatedByUser && (
                    <Container
                      className="button-8 clickable align-center"
                      onClick={(e) => {
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
                </Container>
              </div>
            )}
          </HandleOutsideClick>
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
              onChange={(e) => {
                setCommenetString(e.target.value);
              }}
              value={commentString}
            >
              <Mention
                className="mentions__mention"
                data={(currentTypingTag, callback) => {
                  findPossibleUsersToTag(
                    this.handleChange,
                    currentTypingTag,
                    socket,
                    comment.problemID,
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
                editComment(comment._id, commentString, socket);
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
          onClick={(e) => {
            e.preventDefault();

            if (comment.hasLiked) likeComment(comment);
            else likeComment(comment);
          }}
        >
          <FontAwesomeIcon
            className={`heart ${comment.hasLiked ? "red" : "grey-5"} mr4`}
            icon={comment.hasLiked ? faHeart2 : faHeart}
          />
          <Text
            className="grey-5"
            text={comment.upVotes ? comment.upVotes : 0}
            type="p"
          />
        </Container>
        <Container className="align-center wrap py16 px32">
          <FontAwesomeIcon className="clickable grey-5 mr8" icon={faClock} />
          <Text
            className="grey-5"
            text={moment(comment.server_timestamp)
              .subtract(1, "minute")
              .fromNow()}
            type="p"
          />
        </Container>
      </Container>
      {deleteCommentConfirm && (
        <ConfirmAlertModal
          close={() => setDeleteCommentConfirm(faslse)}
          message="Are you sure you would like to delete this comment?"
          submit={() => deleteComment(comment._id)}
          title="Delete Comment"
        />
      )}
    </Container>
  );
}

export default Comment;

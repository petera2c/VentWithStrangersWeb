import React from "react";

export const deleteComment = (
  commentID,
  commentIndex,
  removeComment,
  socket
) => {
  socket.emit("delete_comment", { commentID }, (returnObj) => {
    const { message, success } = returnObj;

    if (success) {
      alert("Comment deleted successfully");

      if (removeComment && Number.isInteger(commentIndex)) {
        removeComment(commentIndex);
      }
    } else alert(message);
  });
};

export const editComment = (commentID, commentString, socket) => {
  socket.emit("edit_comment", { commentID, commentString }, (returnObj) => {
    const { message, success } = returnObj;

    if (success) {
    } else alert(message);
  });
};

export const likeComment = (
  context,
  comment,
  commentIndex,
  updateCommentLikes
) => {
  context.socket.emit(
    "like_comment",
    { commentID: comment._id },
    (returnObj) => {
      const { message, success } = returnObj;

      if (success && updateCommentLikes) {
        updateCommentLikes(commentIndex, returnObj);
      } else {
        context.notify({
          message,
          type: "danger",
        });
      }
    }
  );
};

export const swapTags = (commentText) => {
  return commentText;
  /*
  //  @{{[[[__id__]]]||[[[__display__]]]}}
  //const test = "\u03A9";

  const regexFull = /@\{\{\[\[\[[\x21-\x5A|\x61-\x7A]+\]\]\]\|\|\[\[\[[\x21-\x5A|\x61-\x7A|\x5f]+\]\]\]\}\}/gi;
  const regexID = /(?<=@\{\{\[\[\[)[\x21-\x5A|\x61-\x7A]+(?=\]\]\]\|\|)/gi;
  const regexDisplay = /(?<=\|\|\[\[\[)[\x21-\x5A|\x61-\x7A]+(?=\]\]\]\}\})/gi;
  const tags = commentText.match(regexFull) || [];

  let something = [];

  commentText.replace(regexFull, (possibleTag, index) => {
    const displayNameArray = possibleTag.match(regexDisplay);

    if (displayNameArray && displayNameArray[0]) {
      something.push({
        start: index,
        end: possibleTag.length + index,
        value: displayNameArray[0]
      });
      return displayNameArray[0];
    } else return possibleTag;
  });

  if (something.length === 0) return commentText;
  else {
    return [
      ...something.map((obj, index) => {
        if (index === 0)
          return [
            commentText.slice(0, obj.start),
            <span className="mentions__mention" key={index}>
              {obj.value}
            </span>
          ];
        else
          return [
            commentText.slice(something[index - 1].end, obj.start),
            <span className="mentions__mention" key={index}>
              {obj.value}
            </span>
          ];
      }),
      commentText.slice(something[something.length - 1].end, commentText.length)
    ];
  }
  */
};

export const unlikeComment = (
  context,
  comment,
  commentIndex,
  updateCommentLikes
) => {
  context.socket.emit(
    "unlike_comment",
    { commentID: comment._id },
    (returnObj) => {
      const { message, success } = returnObj;

      if (success && updateCommentLikes) {
        updateCommentLikes(commentIndex, returnObj);
      } else {
        context.notify({
          message,
          type: "danger",
        });
      }
    }
  );
};

export const likeComment = (
  context,
  comment,
  commentIndex,
  updateCommentLikes
) => {
  context.socket.emit("like_comment", { commentID: comment._id }, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      updateCommentLikes(commentIndex, returnObj);
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
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
    returnObj => {
      const { message, success } = returnObj;

      if (success) {
        updateCommentLikes(commentIndex, returnObj);
      } else {
        context.notify({
          message,
          type: "danger"
        });
      }
    }
  );
};

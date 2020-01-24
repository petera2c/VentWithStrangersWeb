export const likeComment = (context, comment, commentIndex, updateComment) => {
  context.socket.emit("like_comment", { commentID: comment._id }, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      comment.upVotes++;
      comment.dailyUpvotes++;
      comment.hasLiked = true;

      context.handleChange({});
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
  updateComment
) => {
  context.socket.emit(
    "unlike_comment",
    { commentID: comment._id },
    returnObj => {
      const { message, success } = returnObj;

      if (success) {
        comment.upVotes--;
        comment.dailyUpvotes--;
        comment.hasLiked = false;

        context.handleChange({});
      } else {
        context.notify({
          message,
          type: "danger"
        });
      }
    }
  );
};

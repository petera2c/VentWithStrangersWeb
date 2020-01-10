export const commentProblem = (
  commentString,
  context,
  problem1,
  problemIndex,
  handleChange
) => {
  context.socket.emit(
    "comment_problem",
    commentString,
    problem1._id,
    returnObj => {
      const { comment, success } = returnObj;

      if (problemIndex) context.addComment(comment, problemIndex);
      else if (handleChange) handleChange({ problem });
    }
  );
};
export const getProblemComments = (
  context,
  problem,
  problemIndex,
  handleChange
) => {
  context.socket.emit("get_problem_comments", problem._id, returnObj => {
    const { comments, message, success } = returnObj;

    if (success) {
      problem.commentsArray = comments;
    }

    if (problemIndex) context.updateProblem(problem, problemIndex);
    else if (handleChange) handleChange({ problem });
  });
};
export const likeProblem = (context, problem, problemIndex, handleChange) => {
  context.socket.emit("like_problem", problem._id, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      problem.upVotes++;
      problem.dailyUpvotes++;
      problem.hasLiked = true;
      if (problemIndex) context.updateProblem(problem, problemIndex);
      else if (handleChange) handleChange({ problem });
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
};

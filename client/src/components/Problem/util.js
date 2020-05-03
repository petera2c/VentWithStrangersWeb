export const commentProblem = (
  commentString,
  context,
  problem1,
  addComment
) => {
  context.socket.emit(
    "comment_problem",
    commentString,
    problem1._id,
    returnObj => {
      const { comment, message, success } = returnObj;
      if (success) {
        //addComment({ comment });
      } else context.notify({ message, type: "danger" });
    }
  );
};
export const getProblemComments = (context, handleChange, problem) => {
  context.socket.emit("get_problem_comments", problem._id, returnObj => {
    const { comments, message, success } = returnObj;

    if (success) handleChange({ comments });
    else context.notify({ message, type: "danger" });
  });
};
export const likeProblem = (context, problem, updateProblemLikes) => {
  context.socket.emit("like_problem", problem._id, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      //updateProblemLikes(returnObj);
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
};

export const reportProblem = (
  context,
  history,
  id,
  option,
  pathname,
  problemIndex
) => {
  context.socket.emit(
    "report_problem",
    { option, problemID: id },
    returnObj => {
      const { message, success } = returnObj;

      if (success && pathname.substring(0, 9) === "/problem/")
        history.push("/trending/reported");
      else if (success) context.removeProblem(problemIndex);
      else
        context.notify({
          message,
          type: "danger"
        });
    }
  );
};

export const unlikeProblem = (context, problem, updateProblemLikes) => {
  context.socket.emit("unlike_problem", problem._id, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      //updateProblemLikes(returnObj);
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
};

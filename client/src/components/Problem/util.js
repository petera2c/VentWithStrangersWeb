export const commentProblem = (
  commentString,
  context,
  problem1,
  problemIndex
) => {
  context.socket.emit(
    "comment_problem",
    commentString,
    problem1._id,
    returnObj => {
      const { comment, success } = returnObj;

      context.addComment(comment, problemIndex);
    }
  );
};
export const getProblemComments = (context, problem, problemIndex) => {
  context.socket.emit("get_problem_comments", problem._id, returnObj => {
    const { comments, message, success } = returnObj;

    if (success) {
      problem.commentsArray = comments;
    }
    console.log(comments);
    context.updateProblem(problem, problemIndex);
  });
};
export const likeProblem = (context, problem1, problemIndex) => {
  context.socket.emit("like_problem", problem1._id, returnObj => {
    let { message, problem, success } = returnObj;
    if (success) {
      problem.author = problem1.author;

      context.updateProblem(problem, problemIndex);
    } else {
      context.notify({
        message,
        type: "danger",
        title: "Something went wrong!"
      });
    }
  });
};

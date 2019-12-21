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

export const likeProblem = (context, problem1, problemIndex) => {
  context.socket.emit("like_problem", problem1._id, returnObj => {
    let { message, problem, success } = returnObj;
    problem.author = problem1.author;

    context.updateProblem(problem, problemIndex);
  });
};

export const hasLikedProblem = (problem, user) => {
  return problem.upVotesList.find(upVote => upVote.userID === user._id);
};

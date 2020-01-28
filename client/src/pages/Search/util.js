export const searchProblems = (
  handleChange,
  oldProblems,
  searchPostString,
  skip,
  socket
) => {
  socket.emit("search_problems", { searchPostString, skip }, problems => {
    let newProblems = problems;
    let canLoadMorePosts = true;

    if (skip && oldProblems) newProblems = oldProblems.concat(newProblems);

    if (problems && problems.length < 10) canLoadMorePosts = false;

    handleChange({ canLoadMorePosts, problems: newProblems });
  });
};

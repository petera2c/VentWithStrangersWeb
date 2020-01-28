import io from "socket.io-client";

export const initSocket = callback => {
  let socket;
  if (process.env.NODE_ENV === "development")
    socket = io("http://localhost:5000");
  else socket = io();

  callback({ socket });
};

export const getUsersComments = (
  handleChange,
  notify,
  search,
  socket,
  user
) => {
  let searchID = user._id;
  if (search) searchID = search;

  socket.emit("get_users_comments", { searchID }, result => {
    const { comments, message, success } = result;

    if (success) handleChange({ comments });
    else {
      handleChange({ comments });
      notify({ message, type: "danger" });
    }
  });
};

export const getUsersPosts = (
  handleChange,
  notify,
  oldProblems,
  search,
  skip,
  socket,
  user
) => {
  let searchID = user._id;
  if (search) searchID = search;

  socket.emit("get_users_posts", { searchID, skip }, result => {
    const { message, problems, success } = result;
    let newProblems = problems;
    let canLoadMorePosts = true;

    if (problems && problems.length < 10) canLoadMorePosts = false;
    if (skip && oldProblems) newProblems = oldProblems.concat(newProblems);

    handleChange({ canLoadMorePosts, problems: newProblems });
  });
};

const { searchTags } = require("./tag");
const { updateUser } = require("./user");

const { commentProblem, getProblemComments } = require("./comment");

const {
  createConversation,
  emitWaitingConversations,
  findConversation,
  leaveChat,
  sendMessage
} = require("./conversation");

const {
  addUserToObject,
  getProblem,
  getUsersPosts,
  likeProblem,
  searchProblem
} = require("./problem");

module.exports = io => {
  return socket => {
    socket.on("get_users_waiting", () => emitWaitingConversations(socket));
    socket.on("find_conversation", dataObj =>
      findConversation(dataObj, socket)
    );

    socket.on("send_message", dataObj => sendMessage(dataObj, socket));
    socket.on("user_left_chat", () => leaveChat(socket));

    socket.on("disconnect", () => leaveChat(socket));

    socket.on("user_reported", () => {});

    socket.on("search_tags", searchTags);
    socket.on("search_problems", searchProblem);
    socket.on("like_problem", (problemID, callback) =>
      likeProblem(problemID, callback, socket)
    );

    socket.on("comment_problem", (commentString, problemID, callback) =>
      commentProblem(commentString, problemID, callback, socket)
    );
    socket.on("get_problem_comments", (problemID, callback) =>
      getProblemComments(problemID, callback, socket)
    );

    socket.on("update_user", (dataObj, callback) =>
      updateUser(dataObj, callback, socket)
    );
    socket.on("get_problem", (id, callback) =>
      getProblem(id, callback, socket)
    );
    socket.on("get_users_posts", (dataObj, callback) =>
      getUsersPosts(dataObj, callback)
    );
  };
};

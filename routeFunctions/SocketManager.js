const { searchTags } = require("./tag");
const { updateUser } = require("./user");

const {
  commentProblem,
  getProblemComments,
  getUsersComments,
  likeComment,
  unlikeComment
} = require("./comment");

const {
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
  searchProblems,
  unlikeProblem
} = require("./problem");

const { getSettings, saveSettings } = require("./settings");

module.exports = io => {
  return socket => {
    socket.on("get_users_waiting", () => emitWaitingConversations(socket));
    socket.on("find_conversation", (dataObj, callback) =>
      findConversation(dataObj, callback, socket)
    );

    socket.on("send_message", dataObj => sendMessage(dataObj, socket));
    socket.on("user_left_chat", () => leaveChat(socket));

    socket.on("disconnect", () => leaveChat(socket));

    socket.on("user_reported", () => {});

    socket.on("search_tags", searchTags);
    socket.on("search_problems", searchProblems);
    socket.on("like_problem", (problemID, callback) =>
      likeProblem(problemID, callback, socket)
    );
    socket.on("unlike_problem", (dateObj, callback) =>
      unlikeProblem(dateObj, callback, socket)
    );

    socket.on("comment_problem", (commentString, problemID, callback) =>
      commentProblem(commentString, problemID, callback, socket)
    );
    socket.on("like_comment", (dateObj, callback) =>
      likeComment(dateObj, callback, socket)
    );
    socket.on("unlike_comment", (dateObj, callback) =>
      unlikeComment(dateObj, callback, socket)
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
      getUsersPosts(dataObj, callback, socket)
    );
    socket.on("get_users_comments", (dataObj, callback) =>
      getUsersComments(dataObj, callback, socket)
    );

    socket.on("get_settings", callback => getSettings(callback, socket));
    socket.on("save_settings", (dataObj, callback) =>
      saveSettings(dataObj, callback, socket)
    );
  };
};

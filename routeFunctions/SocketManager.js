const { searchTags } = require("./tag");
const { updateUser } = require("./user");

const {
  commentVent,
  deleteComment,
  editComment,
  getVentComments,
  getUsersComments,
  likeComment,
  reportComment,
  unlikeComment,
} = require("./comment");

const {
  emitWaitingConversations,
  findConversation,
  getUsersWaiting,
  leaveChat,
  sendMessage,
} = require("./conversation");

const { getNotifications, readNotifications } = require("./notification");

const {
  addUserToObject,
  deleteVent,
  findPossibleUsersToTag,
  getProblem,
  getVents,
  getUsersPosts,
  likeVent,
  reportVent,
  searchVents,
  unlikeVent,
} = require("./problem");

const { getSettings, saveSettings } = require("./settings");

module.exports = (io) => {
  return (socket) => {
    socket.on("get_users_waiting", getUsersWaiting);
    socket.on("find_conversation", (dataObj, callback) =>
      findConversation(dataObj, callback, socket)
    );
    socket.on("send_message", (dataObj) => sendMessage(dataObj, socket));
    socket.on("leave_chat", () => leaveChat(socket));
    socket.on("disconnecting", () => leaveChat(socket));

    socket.on("get_problems", (dataObj, callback) =>
      getVents(callback, dataObj, socket)
    );

    socket.on("search_tags", searchTags);
    socket.on("search_problems", searchVents);
    socket.on("like_problem", (problemID, callback) =>
      likeVent(problemID, callback, socket)
    );
    socket.on("unlike_problem", (dataObj, callback) =>
      unlikeVent(dataObj, callback, socket)
    );
    socket.on("report_problem", (dataObj, callback) =>
      reportVent(dataObj, callback, socket)
    );

    socket.on("delete_vent", (dataObj, callback) =>
      deleteVent(callback, dataObj, socket)
    );
    socket.on("get_problem", (id, callback) =>
      getProblem(id, callback, socket)
    );
    socket.on("comment_problem", (dataObj, callback) =>
      commentVent(dataObj, callback, socket)
    );
    socket.on("edit_comment", (dataObj, callback) =>
      editComment(dataObj, callback, socket)
    );
    socket.on("delete_comment", (dataObj, callback) =>
      deleteComment(dataObj, callback, socket)
    );
    socket.on("like_comment", (dataObj, callback) =>
      likeComment(dataObj, callback, socket)
    );
    socket.on("unlike_comment", (dataObj, callback) =>
      unlikeComment(dataObj, callback, socket)
    );
    socket.on("get_problem_comments", (problemID, callback) =>
      getVentComments(problemID, callback, socket)
    );
    socket.on("report_comment", (dataObj, callback) =>
      reportComment(dataObj, callback, socket)
    );

    socket.on("get_users_posts", (dataObj, callback) =>
      getUsersPosts(dataObj, callback, socket)
    );
    socket.on("get_users_comments", (dataObj, callback) =>
      getUsersComments(dataObj, callback, socket)
    );

    socket.on("update_user", (dataObj, callback) =>
      updateUser(dataObj, callback, socket)
    );
    socket.on("user_reported", () => {});

    socket.on("get_settings", (callback) => getSettings(callback, socket));
    socket.on("save_settings", (dataObj, callback) =>
      saveSettings(dataObj, callback, socket)
    );

    socket.on("get_notifications", (dataObj, callback) =>
      getNotifications(dataObj, callback, socket)
    );
    socket.on("read_notifications", (callback) =>
      readNotifications(callback, socket)
    );

    socket.on("find_relevant_users_to_tag", (dataObj, callback) =>
      findPossibleUsersToTag(dataObj, callback)
    );
  };
};

export const findConversation = (socket, type) => {
  socket.emit("find_conversation", { type });
};

export const initUserJoined = (callback, socket) => {
  socket.emit("get_users_waiting");
  socket.on("user_joined_chat", stateObj => {
    callback(stateObj);
  });
};

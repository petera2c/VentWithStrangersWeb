export const findConversation = (socket, type) => {
  socket.emit("find_conversation", { type });
};

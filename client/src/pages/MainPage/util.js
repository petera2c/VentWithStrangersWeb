import io from "socket.io-client";
const socketUrl = "http://localhost:5000";

export const initSocket = (callback, port) => {
  let socket;
  if (port) socket = io();
  else socket = io(socketUrl);

  socket.on("user_joined_chat", stateObj => {
    callback(stateObj);
  });

  callback({ socket });
};

export const findConversation = (socket, type) => {
  socket.emit("find_conversation", { type });
};

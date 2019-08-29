import io from "socket.io-client";

export const initSocket = callback => {
  let socket;
  if (process.env.NODE_ENV === "development")
    socket = io("http://localhost:5000");
  else socket = io();

  socket.on("user_joined_chat", stateObj => {
    callback(stateObj);
  });

  callback({ socket });
};

export const findConversation = (socket, type) => {
  socket.emit("find_conversation", { type });
};

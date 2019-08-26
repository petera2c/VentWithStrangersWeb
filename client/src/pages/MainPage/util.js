import io from "socket.io-client";
const socketUrl = "http://localhost:5000";

export const initSocket = (callback, port) => {
  let socket;
  if (port) socket = io();
  else socket = io(socketUrl);

  socket.on("found_conversation", conversation => {
    callback({ conversation });
  });

  callback({ socket });
};

import io from "socket.io-client";

export const initSocket = callback => {
  let socket;
  if (process.env.NODE_ENV === "development")
    socket = io("http://localhost:5000");
  else socket = io();

  callback({ socket });
};

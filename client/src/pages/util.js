import io from "socket.io-client";
import axios from "axios";

export const initSocket = callback => {
  let socket;
  if (process.env.NODE_ENV === "development")
    socket = io("http://localhost:5000");
  else socket = io();

  callback({ socket });
};

export const getProblems = callback => {
  axios.get("/api/problems").then(res => {
    const { success, problems } = res.data;

    if (success) callback(problems);
    else {
      // TODO: handle error
    }
  });
};

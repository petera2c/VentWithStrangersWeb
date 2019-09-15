import axios from "axios";

export const addComment = (callback, comment, problemID) => {
  axios.post("/api/new-comment", { comment, problemID }).then(res => {
    const { comments, success } = res.data;
    callback(comments, success);
  });
};

export const getComments = (callback, problemID) => {
  axios.post("/api/comments", { problemID }).then(res => {
    const { comments, success } = res.data;
    callback({ comments });
  });
};

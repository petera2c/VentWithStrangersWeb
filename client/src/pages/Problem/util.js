import axios from "axios";

export const addComment = (callback, comment, problemID) => {
  axios.post("/api/new-comment", { comment, problemID }).then(res => {
    const { comments, success } = res.data;
    callback(comments, success);
  });
};

import axios from "axios";

export const saveProblem = (callback, problemObject) => {
  axios.post("/api/new-problem", problemObject).then(res => {
    const { success } = res.data;
    if (success) {
      callback();
    } else {
      alert(
        "An unkown error has occured. Please reload the page and try again."
      );
    }
  });
};

export const updateTags = (tags, socket) => {
  let something = "";
  for (let i = tags.length - 1; i >= 0; i--) {
    if (tags[i] !== ",") {
      something += tags[i];
    } else break;
  }
  socket.emit("something", something, res => {
    console.log(res);
  });
};

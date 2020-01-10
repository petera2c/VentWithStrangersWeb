import axios from "axios";

export const saveProblem = (callback, problemObject) => {
  axios.post("/api/new-problem", problemObject).then(res => {
    const { problemID, success } = res.data;

    if (success) {
      callback(problemID);
    } else {
      alert(
        "An unkown error has occured. Please reload the page and try again."
      );
    }
  });
};

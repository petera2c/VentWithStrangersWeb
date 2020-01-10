import axios from "axios";

export const saveProblem = (callback, problemObject, notify) => {
  axios.post("/api/new-problem", problemObject).then(res => {
    const { message, problemID, success } = res.data;

    if (success) {
      callback(problemID);
    } else {
      notify({ message, type: "danger" });
    }
  });
};

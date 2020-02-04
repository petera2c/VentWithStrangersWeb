import axios from "axios";

export const saveProblem = (callback, problemObject, notify) => {
  axios.post("/api/new-problem", problemObject).then(res => {
    const { message, problem, success } = res.data;

    if (success) {
      callback(problem);
    } else {
      notify({ message, type: "danger" });
    }
  });
};

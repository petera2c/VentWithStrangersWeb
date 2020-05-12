import axios from "axios";

export const saveVent = (callback, ventObject, notify) => {
  axios.post("/api/new-problem", ventObject).then(res => {
    const { message, problem, success } = res.data;

    if (success) {
      callback(problem);
    } else {
      notify({ message, type: "danger" });
    }
  });
};

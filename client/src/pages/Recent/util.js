import axios from "axios";

export const getRecentProblems = callback => {
  axios.get("/api/problems/recent").then(res => {
    const { success, problems } = res.data;

    if (success) callback(problems);
    else {
      // TODO: handle error
    }
  });
};

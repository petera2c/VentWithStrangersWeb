import axios from "axios";
export const getPopularProblems = callback => {
  axios.get("/api/problems/popular").then(res => {
    const { success, problems } = res.data;

    if (success) callback(problems);
    else {
      // TODO: handle error
    }
  });
};

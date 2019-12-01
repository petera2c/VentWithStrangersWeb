import axios from "axios";
export const getTrendingProblems = callback => {
  axios.get("/api/problems/trending").then(res => {
    const { success, problems } = res.data;

    if (success) callback(problems);
    else {
      // TODO: handle error
    }
  });
};

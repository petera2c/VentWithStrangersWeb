import axios from "axios";

export const getTrendingTags = callback => {
  axios.get("/api/tags/trending").then(res => {
    const { success, tags } = res.data;

    if (success) callback(tags);
    else {
      // TODO: handle error
    }
  });
};

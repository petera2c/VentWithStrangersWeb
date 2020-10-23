import axios from "axios";

export const updateRecentTags = (callback, selectedTags) => {
  axios.post("/api/tags/recent/update", { selectedTags }).then(res => {
    const { success, user } = res.data;

    callback(user);
  });
};

export const getWordsFromSearch = search => {
  let tagTemp = "";
  let tags = [];

  for (let index in search) {
    if (search[index] == "?") continue;
    else if (search[index] == "+") {
      tags.push({ name: tagTemp });
      tagTemp = "";
    } else tagTemp += search[index];
  }
  if (tagTemp) tags.push({ name: tagTemp });

  return tags;
};

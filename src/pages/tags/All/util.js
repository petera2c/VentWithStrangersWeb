import db from "../../../config/firebase";

import { getEndAtValueTimestamp } from "../../../util";

export const getTags = async (isMounted, setTags, tags) => {
  let startAt = getEndAtValueTimestamp(tags);

  const tagsSnapshot = await db
    .collection("vent_tags")
    .orderBy("display")
    .startAfter(startAt)
    .limit(10)
    .get();

  if (!isMounted()) return;

  let newTags = [];

  for (let index in tagsSnapshot.docs) {
    newTags.push({
      id: tagsSnapshot.docs[index].id,
      doc: tagsSnapshot.docs[index],
      ...tagsSnapshot.docs[index].data(),
    });
  }

  if (tags)
    return setTags((oldTags) => {
      if (oldTags) return [...oldTags, ...newTags];
      else return newTags;
    });
  else return setTags(newTags);
};

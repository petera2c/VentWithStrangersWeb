import db from "../../../config/firebase";

import { getEndAtValueTimestamp } from "../../../util";

export const getTagVents = async (isMounted, setVents, tagID, vents) => {
  let startAt = getEndAtValueTimestamp(vents);

  const ventsSnapshot = await db
    .collection("vents")
    .where("new_tags", "array-contains", tagID)
    .orderBy("like_counter", "desc")
    .startAfter(startAt)
    .limit(10)
    .get();

  if (!isMounted.current) return;

  let newVents = [];

  for (let index in ventsSnapshot.docs) {
    newVents.push({
      id: ventsSnapshot.docs[index].id,
      doc: ventsSnapshot.docs[index],
      ...ventsSnapshot.docs[index].data(),
    });
  }

  if (vents)
    return setVents((oldVents) => {
      if (oldVents) return [...oldVents, ...newVents];
      else return newVents;
    });
  else return setVents(newVents);
};

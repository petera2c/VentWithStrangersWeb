import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

import { db } from "../../../config/db_init";

import { getEndAtValueTimestamp } from "../../../util";

export const getTagVents = async (isMounted, setVents, tagID, vents) => {
  let startAt = getEndAtValueTimestamp(vents);

  const ventsSnapshot = await getDocs(
    query(
      collection(db, "vents"),
      where("new_tags", "array-contains", tagID),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

  if (!isMounted()) return;

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

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../../config/db_init";

import { userSignUpProgress } from "../../../util";

export const createGroup = async (navigate, user, users) => {
  const userInteractionIssues = userSignUpProgress(user);
  if (userInteractionIssues) return false;

  const sortedMemberIDs = users
    .map((user) => user.objectID)
    .push(user.uid)
    .sort();

  console.log(sortedMemberIDs);

  let tempHasSeenObject = {};
  for (let index in sortedMemberIDs) {
    tempHasSeenObject[sortedMemberIDs[index]] = false;
  }

  const conversationDocNew = await addDoc(collection(db, "conversations"), {
    is_group: true,
    last_updated: Timestamp.now().toMillis(),
    members: sortedMemberIDs,
    server_timestamp: Timestamp.now().toMillis(),
    ...tempHasSeenObject,
  });

  navigate("/chat?" + conversationDocNew.id);
};

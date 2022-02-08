import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../config/db_init";

export const saveGroup = async (
  chatNameString,
  groupChatEditting,
  navigate,
  users
) => {
  const sortedMemberIDs = users.map((user) => user.id).sort();

  let tempHasSeenObject = {};
  for (let index in sortedMemberIDs) {
    tempHasSeenObject[sortedMemberIDs[index]] = false;
  }

  let conversationDoc;

  if (groupChatEditting) {
    await updateDoc(doc(db, "conversations", groupChatEditting.id), {
      chat_name: chatNameString,
      last_updated: Timestamp.now().toMillis(),
      ...tempHasSeenObject,
    });
    for (let index in sortedMemberIDs) {
      await updateDoc(doc(db, "conversations", groupChatEditting.id), {
        members: arrayUnion(sortedMemberIDs[index]),
      });
    }
  } else {
    conversationDoc = await addDoc(collection(db, "conversations"), {
      chat_name: chatNameString,
      is_group: true,
      last_updated: Timestamp.now().toMillis(),
      members: sortedMemberIDs,
      server_timestamp: Timestamp.now().toMillis(),
      ...tempHasSeenObject,
    });
  }

  if (!groupChatEditting) navigate("/chat?" + conversationDoc.id);
};

import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../config/firebase_init";

export const joinQueue = async (userID) => {
  await setDoc(doc(db, "chat_queue", userID), {
    server_timestamp: Timestamp.now().toMillis(),
    userID,
  });
};

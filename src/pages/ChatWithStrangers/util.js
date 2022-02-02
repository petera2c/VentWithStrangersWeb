import firebase from "firebase/compat/app";
import { db }from "../../config/localhost_init";

export const joinQueue = async (userID) => {
  await db.collection("chat_queue").doc(userID).set({
    server_timestamp: firebase.firestore.Timestamp.now().toMillis(),
    userID,
  });
};

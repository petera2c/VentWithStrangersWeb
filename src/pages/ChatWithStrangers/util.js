import firebase from "firebase/compat/app";
import db from "../../config/firebase";

export const joinQueue = async (section, setIsInQueue, userID) => {
  setIsInQueue(true);
  await db
    .collection("chat_queue")
    .doc(userID)
    .set({
      [section]: true,
      server_timestamp: firebase.firestore.Timestamp.now().toMillis(),
      userID,
    });
};

export const leaveQueue = async (userID) => {
  await db.collection("chat_queue").doc(userID).delete();
};

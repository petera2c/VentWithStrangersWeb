import firebase from "firebase/compat/app";
import db from "../../config/firebase";

export const countHelpersOrVenters = (queue, section) => {
  let counter = 0;

  for (let index in queue) if (queue[index][section]) counter++;

  return counter;
};

export const joinQueue = async (userID) => {
  await db.collection("chat_queue").doc(userID).set({
    server_timestamp: firebase.firestore.Timestamp.now().toMillis(),
    userID,
  });
};

import firebase from "firebase/compat/app";
import db from "../../config/firebase";

export const conversationsListener = (navigate, userID) => {
  const unsubscribe = db
    .collection("conversations")
    .where("members", "array-contains", userID)
    .orderBy("last_updated", "desc")
    .limit(1)
    .onSnapshot((snapshot) => {
      if (snapshot.docs && snapshot.docs[0]) {
        const doc = snapshot.docs[0];
        if (doc.data().go_to_inbox) navigate("/chat?" + doc.id);
      }
    });

  return unsubscribe;
};
export const countHelpersOrVenters = (queue, section) => {
  let counter = 0;

  for (let index in queue) if (queue[index][section]) counter++;

  return counter;
};

export const isUserInQueue = (queue, userID) => {
  for (let index in queue) {
    if (queue[index].id === userID) {
      return true;
    }
  }
  return false;
};

export const queueListener = (isMounted, setQueue) => {
  const unsubscribe = db
    .collection("chat_queue")
    .limit(50)
    .onSnapshot("value", (snapshot) => {
      let chatQueueList = [];

      if (snapshot.docs)
        for (let index in snapshot.docs) {
          chatQueueList.push({
            doc: snapshot.docs[index],
            id: snapshot.docs[index].id,
            ...snapshot.docs[index].data(),
          });
        }

      if (isMounted()) setQueue(chatQueueList);
    });

  return unsubscribe;
};

export const joinQueue = async (section, userID) => {
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

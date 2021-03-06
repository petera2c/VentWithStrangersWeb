import db from "../../config/firebase";
import firebase from "firebase/app";
export const saveVent = async (callback, ventObject, id, user, notify) => {
  if (user) {
    ventObject.userID = user.uid;
  }
  ventObject.server_timestamp =
    firebase.firestore.Timestamp.now().seconds * 1000;
  ventObject.comment_counter = 0;
  ventObject.like_counter = 0;

  const newVent = await db.collection("/vents/").add(ventObject);
  callback({ _id: newVent.id, title: ventObject.title });
};

import firebase from "firebase/app";
import db from "../../config/firebase";

export const getVent = async (setDescription, setTags, setTitle, ventID) => {
  const ventDoc = await db
    .collection("vents")
    .doc(ventID)
    .get();

  const vent = ventDoc.data();

  if (vent) {
    setDescription(vent.description);
    setTags(vent.tags);
    setTitle(vent.title);
  }
};

export const saveVent = async (callback, ventObject, ventID, user) => {
  if (!user) {
    return alert("You must be signed in to create a vent.");
  }
  if (!ventID) {
    ventObject.server_timestamp =
      firebase.firestore.Timestamp.now().seconds * 1000;
    ventObject.comment_counter = 0;
    ventObject.like_counter = 0;
  }
  ventObject.userID = user.uid;
  ventObject.last_updated = firebase.firestore.Timestamp.now().seconds * 1000;

  let newVent = ventObject;
  if (ventID) {
    await db
      .collection("vents")
      .doc(ventID)
      .update(ventObject);
  } else newVent = await db.collection("vents").add(ventObject);
  callback({ id: newVent.id ? newVent.id : ventID, title: ventObject.title });
};

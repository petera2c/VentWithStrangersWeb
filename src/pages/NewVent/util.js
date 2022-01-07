import firebase from "firebase/app";
import moment from "moment-timezone";
import db from "../../config/firebase";

export const getUserVentTimeOut = async (callback, userID) => {
  const userVentTimeOutDoc = await db
    .collection("user_vent_timeout")
    .doc(userID)
    .get();

  let timeOutDate;
  const currentDate = new moment();

  if (userVentTimeOutDoc.exists) {
    timeOutDate = new moment(userVentTimeOutDoc.data().value);
  }

  if (timeOutDate && currentDate.diff(timeOutDate) < 0) callback(timeOutDate);
  else callback(false);
};

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
    return alert("You must be signed in to create a vent");
  }
  if (!ventID) {
    ventObject.server_timestamp = firebase.firestore.Timestamp.now().toMillis();
    ventObject.comment_counter = 0;
    ventObject.like_counter = 0;
  }
  ventObject.userID = user.uid;
  ventObject.last_updated = firebase.firestore.Timestamp.now().toMillis();

  let newVent = ventObject;
  if (ventID) {
    await db
      .collection("vents")
      .doc(ventID)
      .update(ventObject);
  } else newVent = await db.collection("vents").add(ventObject);
  callback({ id: newVent.id ? newVent.id : ventID, title: ventObject.title });
};

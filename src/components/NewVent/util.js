import firebase from "firebase/compat/app";
import moment from "moment-timezone";
import db from "../../config/firebase";

import { formatSeconds } from "../../util";

export const createPlaceholderDescription = (
  encouragingText,
  isBirthdayPost,
  userVentTimeOut
) => {
  if (isBirthdayPost) return "Have the best birthday ever!";
  else if (userVentTimeOut > 0)
    return "You can vent again in " + formatSeconds(userVentTimeOut);
  else return encouragingText + " :)";
};

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
  const ventDoc = await db.collection("vents").doc(ventID).get();

  const vent = ventDoc.data();

  if (vent) {
    setDescription(vent.description);
    setTags(vent.tags);
    setTitle(vent.title);
  }
};

export const saveVent = async (
  callback,
  checks,
  isBirthdayPost,
  ventObject,
  ventID,
  user
) => {
  if (!ventID) {
    ventObject.server_timestamp = firebase.firestore.Timestamp.now().toMillis();
    ventObject.comment_counter = 0;
    ventObject.like_counter = 0;
  }
  ventObject.userID = user.uid;
  ventObject.last_updated = firebase.firestore.Timestamp.now().toMillis();

  if (isBirthdayPost) ventObject.is_birthday_post = isBirthdayPost;

  let newVent = ventObject;
  if (ventID) {
    await db.collection("vents").doc(ventID).update(ventObject);
  } else newVent = await db.collection("vents").add(ventObject);
  callback({ id: newVent.id ? newVent.id : ventID, title: ventObject.title });
};

export const selectEncouragingMessage = () => {
  const nicePlaceholdersArray = [
    "Let it all out. You are not alone.",
    "What is going on in your life?",
    "What are you working through?",
    "We are here for you.",
  ];

  return nicePlaceholdersArray[
    Math.floor(Math.random() * nicePlaceholdersArray.length)
  ];
};

export const updateTags = (
  checks,
  inputText,
  setSaving,
  setStarterModal,
  setTags,
  setTagText,
  tags,
  user
) => {
  if (!checks) return;

  let word = "";
  for (let index in inputText) {
    if (inputText[index] === " " || inputText[index] === ",") {
      if (word) tags.push(word);
      word = "";
    } else word += inputText[index];
  }
  setTags(tags);
  setTagText(word);
  setSaving(false);
};

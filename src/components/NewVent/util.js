import firebase from "firebase/compat/app";
import moment from "moment-timezone";
import db from "../../config/firebase";

import { message } from "antd";

import { calculateKarma, userSignUpProgress } from "../../util";

export const checks = async (
  isUserKarmaSufficient,
  setStarterModal,
  user,
  userBasicInfo,
  ventID,
  userVentTimeOut
) => {
  if (userVentTimeOut && !ventID) {
    return () => () => message.info("You need to wait to vent again");
  }

  const userInteractionIssues = userSignUpProgress(user, true);

  if (userInteractionIssues) {
    if (userInteractionIssues === "NSI")
      return () => () => setStarterModal(true);
    else return () => () => userSignUpProgress(user);
  }

  if (!isUserKarmaSufficient) {
    return () => () =>
      message.error(
        "Your karma is currently " +
          calculateKarma(userBasicInfo) +
          ". This indicates you have not been following our rules and are now forbidden to comment or post."
      );
  }

  return false;
};

export const getQuote = async (isMounted, setQuote) => {
  const yesterdaysFormattedDate = new moment(
    firebase.firestore.Timestamp.now().toMillis()
  )
    .utcOffset(0)
    .subtract(1, "days")
    .format("MM-DD-YYYY");

  const quotesSnapshot = await db
    .collection("quotes")
    .where("formatted_date", "==", yesterdaysFormattedDate)
    .orderBy("like_counter", "desc")
    .limit(1)
    .get();

  if (
    quotesSnapshot.docs &&
    quotesSnapshot.docs[0] &&
    quotesSnapshot.docs[0].data() &&
    isMounted.current
  ) {
    const author = await db
      .collection("users_display_name")
      .doc(quotesSnapshot.docs[0].data().userID)
      .get();

    const displayName = author.data() ? author.data().displayName : "Anonymous";
    setQuote({
      displayName,
      id: quotesSnapshot.docs[0].id,
      ...quotesSnapshot.docs[0].data(),
    });
  }
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
    setTags(
      vent.new_tags
        ? vent.new_tags.map((tag, index) => {
            return { objectID: tag };
          })
        : []
    );
    setTitle(vent.title);
  }
};

export const saveVent = async (
  callback,
  isBirthdayPost,
  tags,
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

  let tagIDs = [];
  for (let index in tags) {
    tagIDs.push(tags[index].objectID);
  }

  ventObject.new_tags = tagIDs.sort();

  if (ventObject.new_tags && ventObject.new_tags.length >= 4)
    return message.info("You can not set more than 3 tags in a vent!");

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

export const updateTags = (setTags, tag) => {
  setTags((oldTags) => {
    if (
      oldTags &&
      oldTags.findIndex((oldTag) => oldTag.objectID === tag.objectID) >= 0
    ) {
      message.info("Tag is already added :)");
      return oldTags;
      return [tag];
    } else {
      return [tag, ...oldTags].sort((a, b) => {
        if (a.objectID < b.objectID) return -1;
        if (a.objectID > b.objectID) return 1;
        return 0;
      });
    }
  });
};

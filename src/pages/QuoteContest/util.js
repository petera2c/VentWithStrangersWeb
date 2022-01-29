import firebase from "firebase/compat/app";
import moment from "moment-timezone";
import db from "../../config/firebase";

import { getEndAtValueTimestamp } from "../../util";

export const getCanUserCreateQuote = async (
  isMounted,
  setCanUserCreateQuote,
  userID
) => {
  const todaysFormattedDate = new moment(
    firebase.firestore.Timestamp.now().toMillis()
  )
    .utcOffset(0)
    .format("MM-DD-YYYY");

  const userQuotesTodaySnapshot = await db
    .collection("quotes")
    .where("formatted_date", "==", todaysFormattedDate)
    .where("userID", "==", userID)
    .get();

  if (
    userQuotesTodaySnapshot.docs &&
    userQuotesTodaySnapshot.docs.length > 0 &&
    isMounted()
  )
    setCanUserCreateQuote(false);
  else if (isMounted()) setCanUserCreateQuote(true);
};

export const getHasUserLikedQuote = async (setHasLiked, quoteID, userID) => {
  const quoteHasLikedDoc = await db
    .collection("quote_likes")
    .doc(quoteID + "|||" + userID)
    .get();

  if (!quoteHasLikedDoc.exists) return;
  let value = quoteHasLikedDoc.data();
  if (value) value = value.liked;

  setHasLiked(Boolean(value));
};

export const getQuotes = async (quotes, setQuotes) => {
  let startAt = getEndAtValueTimestamp(quotes);
  const todaysFormattedDate = new moment().utcOffset(0).format("MM-DD-YYYY");

  const quotesSnapshot = await db
    .collection("quotes")
    .where("formatted_date", "==", todaysFormattedDate)
    .orderBy("server_timestamp", "desc")
    .startAfter(startAt)
    .limit(10)
    .get();

  let newQuotes = [];
  for (let index in quotesSnapshot.docs) {
    const quoteDoc = quotesSnapshot.docs[index];
    newQuotes.push({
      id: quoteDoc.id,
      ...quoteDoc.data(),
    });
  }

  if (quotes) {
    return setQuotes((oldQuotes) => {
      if (oldQuotes) return [...oldQuotes, ...newQuotes];
      else return newQuotes;
    });
  } else return setQuotes(newQuotes);
};

export const saveQuote = async (
  canUserCreateQuote,
  isMounted,
  quote,
  quoteID,
  setCanUserCreateQuote,
  userID
) => {
  if (quoteID) {
    await db.collection("vents").doc(quoteID).update({ value: quote });
  } else if (true) {
    console.log("sending");
    await db.collection("quotes").add({
      userID,
      value: quote,
    });
    if (isMounted()) setCanUserCreateQuote(false);
  }
};

/*
export const likeOrUnlikeVent = async (
  hasLiked,
  setHasLiked,
  setVent,
  user,
  vent
) => {
  setHasLiked(!hasLiked);

  setVent(incrementVentCounter("like_counter", !hasLiked, vent));

  await db
    .collection("vent_likes")
    .doc(vent.id + "|||" + user.uid)
    .set({ liked: !hasLiked, userID: user.uid, ventID: vent.id });
};

export const reportVent = async (option, userID, ventID) => {
  await db
    .collection("vent_reports")
    .doc(ventID + "|||" + userID)
    .set({ option, userID, ventID });

  message.success("Report successful :)");
};*/

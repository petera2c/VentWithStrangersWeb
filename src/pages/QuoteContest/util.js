import firebase from "firebase/compat/app";
import db from "../../config/firebase";
import moment from "moment-timezone";
import { message } from "antd";

import { getEndAtValueTimestamp } from "../../util";

export const deleteQuote = async (quoteID, setQuotes) => {
  await db.collection("quotes").doc(quoteID).delete();

  if (setQuotes)
    setQuotes((quotes) => {
      quotes.splice(
        quotes.findIndex((comment) => comment.id === quoteID),
        1
      );
      return [...quotes];
    });
  message.success("Quote deleted!");
};

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

export const reportQuote = async (option, quoteID, userID) => {
  await db
    .collection("quote_reports")
    .doc(quoteID + "|||" + userID)
    .set({ option, quoteID, userID });

  message.success("Report successful :)");
};

export const saveQuote = async (
  canUserCreateQuote,
  isMounted,
  quote,
  quoteID,
  setCanUserCreateQuote,
  setQuotes,
  userID
) => {
  if (quoteID) {
    await db.collection("quotes").doc(quoteID).update({ userID, value: quote });

    setQuotes((oldQuotes) => {
      const quoteIndex = oldQuotes.findIndex((quote) => quote.id === quoteID);
      oldQuotes[quoteIndex].value = quote;
      return [...oldQuotes];
    });
    message.success("Updated successfully! :)");
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
*/

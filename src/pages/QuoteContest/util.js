import firebase from "firebase/compat/app";
import db from "../../config/firebase";
import moment from "moment-timezone";
import { message } from "antd";

import { getEndAtValueTimestamp } from "../../util";

export const deleteQuote = async (
  quoteID,
  setCanUserCreateQuote,
  setQuotes
) => {
  await db.collection("quotes").doc(quoteID).delete();

  if (setQuotes)
    setQuotes((quotes) => {
      quotes.splice(
        quotes.findIndex((comment) => comment.id === quoteID),
        1
      );
      return [...quotes];
    });
  setCanUserCreateQuote(true);
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

export const getHasUserLikedQuote = async (quoteID, setHasLiked, userID) => {
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

export const likeOrUnlikeQuote = async (hasLiked, quote, user) => {
  if (!user)
    return message.info(
      "You must sign in or register an account to support a comment!"
    );

  console.log("here");

  await db
    .collection("quote_likes")
    .doc(quote.id + "|||" + user.uid)
    .set({ liked: !hasLiked, quoteID: quote.id, userID: user.uid });
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
    console.log("here");
    await db.collection("quotes").doc(quoteID).update({ userID, value: quote });

    setQuotes((oldQuotes) => {
      const quoteIndex = oldQuotes.findIndex((quote) => quote.id === quoteID);
      oldQuotes[quoteIndex].value = quote;
      return [...oldQuotes];
    });
    message.success("Updated successfully! :)");
  } else if (canUserCreateQuote) {
    console.log("sending");
    const newQuote = await db.collection("quotes").add({
      userID,
      value: quote,
    });
    setQuotes((oldQuotes) => [
      { id: newQuote.id, value: quote, userID },
      ...oldQuotes,
    ]);
    if (isMounted()) setCanUserCreateQuote(false);
  }
};

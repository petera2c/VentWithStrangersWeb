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

export const getQuotes = async (quotes, setQuotes) => {
  let startAt = getEndAtValueTimestamp(quotes);
  const todaysFormattedDate = new moment().format("MM-DD-YYYY");

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

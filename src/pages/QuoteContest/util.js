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
  ).format("MM-DD-YYYY");
  console.log(todaysFormattedDate);

  const userQuotesTodaySnapshot = await db
    .collection("quotes")
    //  .where("userID", "==", userID)
    .where("formatted_date", "==", todaysFormattedDate)
    .get();

  console.log(userQuotesTodaySnapshot.docs);

  if (
    userQuotesTodaySnapshot.docs &&
    userQuotesTodaySnapshot.docs.length > 0 &&
    isMounted()
  )
    setCanUserCreateQuote(false);
  else if (isMounted()) setCanUserCreateQuote(true);
};

export const getQuotes = async (quotes) => {
  let startAt = getEndAtValueTimestamp(quotes);
  const todaysFormattedDate = new moment().format("MM-DD-YYYY");

  const quotesSnapshot = await db
    .collection("quotes")
    .where("formatted_date", "==", todaysFormattedDate)
    .startAfter(startAt)
    .limit(10)
    .get();
};

export const saveQuote = async (
  canUserCreateQuote,
  isMounted,
  quote,
  quoteID,
  setCanUserCreateQuote,
  userID
) => {
  console.log("sending");
  if (quoteID) {
    await db.collection("vents").doc(quoteID).update({ value: quote });
  } else if (canUserCreateQuote) {
    await db.collection("quotes").add({
      userID,
      value: quote,
    });
    if (isMounted()) setCanUserCreateQuote(false);
  }
};

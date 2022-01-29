const admin = require("firebase-admin");
const moment = require("moment-timezone");

const newQuoteListener = async (doc, context) => {
  const quote = { id: doc.id, ...doc.data() };

  const todaysFormattedDate = new moment(
    admin.firestore.Timestamp.now().toMillis()
  ).format("MM-DD-YYYY");

  const userQuotesTodaySnapshot = await admin
    .firestore()
    .collection("quotes")
    .where("userID", "==", quote.userID)
    .where("formatted_date", "==", todaysFormattedDate)
    .get();

  if (userQuotesTodaySnapshot.docs && userQuotesTodaySnapshot.docs.length > 0)
    return await admin.firestore().collection("quotes").doc(quote.id).delete();
  else {
    await admin.firestore().collection("quotes").doc(quote.id).update({
      formatted_date: todaysFormattedDate,
      like_counter: 0,
      server_timestamp: admin.firestore.Timestamp.now().toMillis(),
    });
  }
};

module.exports = {
  newQuoteListener,
};

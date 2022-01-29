const admin = require("firebase-admin");
const moment = require("moment-timezone");

const newQuoteListener = async (doc, context) => {
  const quote = { id: doc.id, ...doc.data() };

  console.log(admin.firestore.Timestamp.now().toMillis());
  const todaysFormattedDate = new moment(
    admin.firestore.Timestamp.now().toMillis()
  ).format("MM-DD-YYYY");

  const userQuotesTodaySnapshot = await admin
    .firestore()
    .collection("quotes")
    .where("userID", "==", quote.userID)
    .where("formatted_date", "==", todaysFormattedDate);

  console.log(userQuotesTodaySnapshot.docs);

  if (userQuotesTodaySnapshot.docs && userQuotesTodaySnapshot.docs.length > 1)
    return await admin.firestore().collection("quotes").doc(quote.id).delete();
  else {
    await admin.firestore().collection("quotes").doc(quote.id).update({
      formatted_date: todaysFormattedDate,
      server_timestamp: admin.firestore.Timestamp.now().toMillis(),
    });
  }
};

module.exports = {
  newQuoteListener,
};

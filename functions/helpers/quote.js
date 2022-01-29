const admin = require("firebase-admin");
const moment = require("moment-timezone");

const { calculateKarmaUserCanStrip } = require("./util");

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

const newQuoteReportListener = async (doc, context) => {
  const quoteID = doc.id.split("|||")[0];
  const userID = doc.id.split("|||")[1];

  await admin
    .firestore()
    .collection("quotes")
    .doc(quoteID)
    .update({
      report_counter: admin.firestore.FieldValue.increment(1),
    });

  const quoteDoc = await admin
    .firestore()
    .collection("quotes")
    .doc(quoteID)
    .get();

  const usereBasicInfoDoc = await admin
    .firestore()
    .collection("users_display_name")
    .doc(userID)
    .get();
  const karmaUserCanStrip = calculateKarmaUserCanStrip(
    usereBasicInfoDoc.data()
  );

  await admin
    .firestore()
    .collection("users_display_name")
    .doc(quoteDoc.data().userID)
    .set(
      {
        karma: admin.firestore.FieldValue.increment(-karmaUserCanStrip),
      },
      { merge: true }
    );

  await admin.firestore().collection("admin_notifications").add({
    quoteID,
    user_that_reported: userID,
    user_that_got_reported: quoteDoc.data().userID,
  });
};

module.exports = {
  newQuoteListener,
  newQuoteReportListener,
};

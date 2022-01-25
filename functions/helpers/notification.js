const admin = require("firebase-admin");
const fetch = require("node-fetch");
const sgMail = require("@sendgrid/mail");

const { sendGridApiKey } = require("../config/keys");
sgMail.setApiKey(sendGridApiKey);

const createNotification = async (
  canPushMobileNotification,
  canSendEmailNotification,
  link,
  message,
  userID
) => {
  if (!userID) return;

  await admin.firestore().collection("notifications").add({
    hasSeen: false,
    link,
    message,
    server_timestamp: admin.firestore.Timestamp.now().toMillis(),
    userID,
  });

  /*
if(canSendEmailNotification){
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
}
  */

  admin
    .database()
    .ref("status/" + userID)
    .once("value", (doc) => {
      if (doc.val().state !== "online" && canPushMobileNotification)
        sendMobilePushNotifications(message, userID);
    });
};

const sendMobilePushNotifications = async (message, userID) => {
  userExpoTokensDoc = await admin
    .firestore()
    .collection("user_expo_tokens")
    .doc(userID)
    .get();

  if (userExpoTokensDoc.data())
    for (let index in userExpoTokensDoc.data().tokens) {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userExpoTokensDoc.data().tokens[index],
          sound: "default",
          title: "Vent With Strangers",
          body: message,
        }),
      });
    }
};

module.exports = { createNotification, sendMobilePushNotifications };

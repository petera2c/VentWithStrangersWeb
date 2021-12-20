const admin = require("firebase-admin");
const fetch = require("node-fetch");

const createNotification = async (
  canPushMobileNotification,
  canSendEmailNotification,
  link,
  message,
  userID
) => {
  if (!userID) return;

  await admin
    .firestore()
    .collection("notifications")
    .add({
      hasSeen: false,
      link,
      message,
      server_timestamp: admin.firestore.Timestamp.now().seconds * 1000,
      userID,
    });

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

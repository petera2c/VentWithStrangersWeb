const admin = require("firebase-admin");

const createNotification = (link, message, userID) => {
  if (!userID) return;
  return admin
    .firestore()
    .collection("notifications")
    .add({
      hasSeen: false,
      link,
      message,
      server_timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userID,
    });
};

const createConversationNotification = (userID) => {
  if (!userID) return;
  return admin
    .firestore()
    .collection("notifications")
    .add({
      hasSeen: false,
      message,
      server_timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userID,
    });
};

module.exports = { createConversationNotification, createNotification };

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
      server_timestamp: admin.firestore.Timestamp.now().seconds * 1000,
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
      server_timestamp: admin.firestore.Timestamp.now().seconds * 1000,
      userID,
    });
};

module.exports = { createConversationNotification, createNotification };

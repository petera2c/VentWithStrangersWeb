const admin = require("firebase-admin");

const createNotification = async (link, message, userID) => {
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
};

module.exports = { createNotification };

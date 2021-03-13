const admin = require("firebase-admin");

const messagesListener = async (doc, context) => {
  const { conversationID, messageID } = context.params;

  await admin
    .firestore()
    .collection("conversations")
    .doc(conversationID)
    .set(
      {
        last_updated: admin.firestore.Timestamp.now().seconds * 1000,
      },
      { merge: true }
    );
};

module.exports = { messagesListener };

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

  const conversationDoc = await admin
    .firestore()
    .collection("conversations")
    .doc(conversationID)
    .get();

  if (!conversationDoc || !conversationDoc.data()) {
    return "";
  }

  let conversation = conversationDoc.data();
  for (let index in conversation) {
    if (typeof conversation[index] === "boolean") conversation[index] = false;
  }

  await admin
    .firestore()
    .collection("conversations")
    .doc(conversationID)
    .set(conversation);
};

module.exports = { messagesListener };

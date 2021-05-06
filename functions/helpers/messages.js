const admin = require("firebase-admin");
const { sendMobilePushNotifications } = require("./notification");

const messagesListener = async (doc, context) => {
  const { conversationID, messageID } = context.params;
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
    if (typeof conversation[index] === "boolean") {
      conversation[index] = false;
      if (doc.data().userID !== index) {
        await admin
          .firestore()
          .collection("unread_conversations_count")
          .doc(index)
          .set({ count: admin.firestore.FieldValue.increment(1) });
        sendMobilePushNotifications("You have a new message!", index);
      }
    }
  }
  conversation.last_updated = admin.firestore.Timestamp.now().seconds * 1000;
  conversation.last_message = doc.data().body;

  await admin
    .firestore()
    .collection("conversations")
    .doc(conversationID)
    .set(conversation);
};

module.exports = { messagesListener };

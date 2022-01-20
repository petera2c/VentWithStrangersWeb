const admin = require("firebase-admin");

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const chatQueueListener = async (change, context) => {
  const doc = change.before.data();
  if (doc) {
    const section = doc.data().listener ? "listener" : "helper";
    const lookingFor = section === "helper" ? "helper" : "venter";

    const partnerDoc = await db
      .collection("chat_queue")
      .where(lookingFor, "==", true)
      .orderBy("server_timestamp", "asc")
      .limit(1);
  }
};

const conversationUpdateListener = async (change, context) => {
  const { conversationID } = context.params;

  const conversationBefore = change.before.data();
  const conversationAfter = change.after.data();

  // If user has deleted conversation code
  if (
    conversationBefore &&
    !arraysEqual(conversationBefore.members, conversationAfter.members)
  ) {
    for (let index in conversationBefore.members) {
      if (
        conversationBefore.members[index] !== conversationAfter.members[index]
      ) {
        const snapshot = await admin
          .firestore()
          .collection("conversation_extra_data")
          .doc(conversationID)
          .collection("messages")
          .where("userID", "==", conversationBefore.members[index])
          .get();
        if (snapshot && snapshot.docs)
          for (let index in snapshot.docs) {
            await admin
              .firestore()
              .collection("conversation_extra_data")
              .doc(conversationID)
              .collection("messages")
              .doc(snapshot.docs[index].id)
              .delete();
          }
      }
    }
  }
};

module.exports = { chatQueueListener, conversationUpdateListener };

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

const conversationUpdateListener = async (change, context) => {
  const { conversationID } = context.params;

  const conversationBefore = change.before.data();
  const conversationAfter = change.after.data();

  // If user has deleted conversation code
  if (!arraysEqual(conversationBefore.members, conversationAfter.members)) {
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

  // Is user typing code
  if (
    JSON.stringify(conversationBefore.isTyping) !==
    JSON.stringify(conversationAfter.isTyping)
  ) {
    let areAnyUsersTyping = false;
    let isTypingChangeObject = {};
    for (let index in conversationAfter.isTyping) {
      isTypingChangeObject[index] = conversationAfter.isTyping[index];
      if (conversationAfter.isTyping[index]) areAnyUsersTyping = true;
      if (
        conversationAfter.isTyping[index] !==
          conversationBefore.isTyping[index] &&
        conversationAfter.isTyping[index]
      )
        isTypingChangeObject[index] = false;
    }
    if (areAnyUsersTyping) {
      setTimeout(async () => {
        await admin
          .firestore()
          .collection("conversations")
          .doc(conversationID)
          .set({ isTyping: isTypingChangeObject }, { merge: true });
      }, 4000);
    }
  }
};

module.exports = { conversationUpdateListener };

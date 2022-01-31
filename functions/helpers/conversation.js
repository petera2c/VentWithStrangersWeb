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
  const { userID } = context.params;
  const doc = change.after.data();

  if (doc) {
    const partnerSnapshot = await admin
      .firestore()
      .collection("chat_queue")
      .orderBy("server_timestamp", "asc")
      .limit(1)
      .get();

    if (!partnerSnapshot.docs || !partnerSnapshot.docs[0]) return;
    const partnerDoc = partnerSnapshot.docs[0];

    if (partnerDoc.id === userID) return;

    const partnerDocRef = admin
      .firestore()
      .collection("chat_queue")
      .doc(partnerDoc.id);

    return admin
      .firestore()
      .runTransaction((transaction) => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(partnerDocRef).then(async (partnerDoc) => {
          if (!partnerDoc.exists) {
            throw "Document does not exist!";
          }

          // create chat
          await startConversation(partnerDoc.id, userID);

          admin
            .firestore()
            .collection("chat_queue")
            .doc(partnerDoc.id)
            .delete();
          admin.firestore().collection("chat_queue").doc(userID).delete();
        });
      })
      .then(() => {
        console.log("Transaction successfully committed!");
      })
      .catch((error) => {
        console.log("Transaction failed: ", error);
      });
  }
};

const startConversation = async (partnerID, userID) => {
  const sortedMemberIDs = [userID, partnerID].sort();
  const conversationQuerySnapshot = await admin
    .firestore()
    .collection("conversations")
    .where("members", "==", sortedMemberIDs)
    .get();

  const goToPage = async (conversationID) => {
    await admin.firestore().collection("conversations").doc(conversationID).set(
      {
        go_to_inbox: true,
        last_updated: admin.firestore.Timestamp.now().toMillis(),
      },
      { merge: true }
    );
  };

  if (!conversationQuerySnapshot.empty) {
    conversationQuerySnapshot.forEach(async (conversationDoc, i) => {
      return await goToPage(conversationDoc.id);
    });
  } else {
    let tempHasSeenObject = {};
    for (let index in sortedMemberIDs) {
      tempHasSeenObject[sortedMemberIDs[index]] = false;
    }

    const conversationDocNew = await admin
      .firestore()
      .collection("conversations")
      .add({
        last_updated: admin.firestore.Timestamp.now().toMillis(),
        members: sortedMemberIDs,
        server_timestamp: admin.firestore.Timestamp.now().toMillis(),
        ...tempHasSeenObject,
      });
    return await goToPage(conversationDocNew.id);
  }
};

const conversationUpdateListener = async (change, context) => {
  const { conversationID } = context.params;

  const conversationBefore = change.before.data();
  const conversationAfter = change.after.data();

  if (conversationAfter && conversationBefore) {
    if (conversationAfter.members.length === 0) {
      const messagesSnapshot = await admin
        .firestore()
        .collection("conversation_extra_data")
        .doc(conversationID)
        .collection("messages")
        .get();
      for (let index in messagesSnapshot.docs)
        await admin
          .firestore()
          .collection("conversation_extra_data")
          .doc(conversationID)
          .collection("messages")
          .doc(messagesSnapshot.docs[index].id)
          .delete();

      await admin
        .firestore()
        .collection("conversation_extra_data")
        .doc(conversationID)
        .delete();

      await admin
        .firestore()
        .collection("conversations")
        .doc(conversationID)
        .delete();
    } else if (
      !arraysEqual(conversationBefore.members, conversationAfter.members)
    ) {
      // If user has deleted conversation code
      for (let index in conversationBefore.members) {
        if (
          conversationBefore.members[index] !== conversationAfter.members[index]
        ) {
          const snapshot = await admin
            .firestore()
            .collection("conversation_extra_data")
            .doc(conversationID)
            .collection("messages")
            .add({
              body: "User has left chat.",
              server_timestamp: admin.firestore.Timestamp.now().toMillis(),
              user_left_chat: true,
            });
        }
      }
    }
  } else if (conversationAfter) {
    const conversationSnapshot = await admin
      .firestore()
      .collection("conversations")
      .where("members", "==", conversationAfter.members)
      .limit(1)
      .get();
    if (conversationSnapshot.docs && conversationSnapshot.docs[0]) {
      const conversationDoc = conversationSnapshot.docs[0];

      if (conversationDoc.id !== change.after.id) {
        await admin
          .firestore()
          .collection("conversation_extra_data")
          .doc(change.after.id)
          .delete();
        await admin
          .firestore()
          .collection("conversations")
          .doc(change.after.id)
          .delete();
      }
    }
  }
};

module.exports = { chatQueueListener, conversationUpdateListener };

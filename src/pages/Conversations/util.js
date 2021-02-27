import db from "../../config/firebase";
import { getEndAtValueTimestamp } from "../../util";

export const getConversation = async (
  conversationID,
  setConversation,
  userID
) => {
  const unsubscribe = await db
    .collection("conversations")
    .doc(conversationID)
    .onSnapshot("value", async doc => {
      if (!doc.exists) return;
      let conversation = doc.data();

      if (!conversation.name) {
        let conversationFriendUserID;
        for (let index in conversation.members) {
          if (conversation.members[index] !== userID)
            conversationFriendUserID = conversation.members[index];
        }

        if (conversationFriendUserID) {
          let test = await db
            .collection("users")
            .doc(conversationFriendUserID)
            .get();
          console.log(test.exists);
        }
      }
      if (conversation) setConversation({ id: doc.id, ...conversation });
      else setConversation(false);
    });

  return () => unsubscribe();
};

export const getConversations = async (
  conversations,
  setConversations,
  userID
) => {
  const startAt = getEndAtValueTimestamp(conversations);

  const conversationsQuerySnapshot = await db
    .collection("conversations")
    .where("members", "array-contains", userID)
    .orderBy("server_timestamp", "desc")
    .startAfter(startAt)
    .limitToLast(10)
    .get();

  if (!conversationsQuerySnapshot.empty) {
    let counter = 0;

    let conversations = [];
    conversationsQuerySnapshot.docs.forEach((item, i) => {
      conversations.push({
        id: item.id,
        ...item.data(),
        doc: conversationsQuerySnapshot.docs[i]
      });
    });
    return setConversations(conversations);
  }
};

import firebase from "firebase/app";
import db from "../../config/firebase";
import { getEndAtValueTimestamp } from "../../util";

export const getConversation = async (
  conversationID,
  setConversation,
  setConversationName,
  userID
) => {
  const unsubscribe = await db
    .collection("conversations")
    .doc(conversationID)
    .onSnapshot("value", async doc => {
      if (!doc.exists) return;
      const conversation = doc.data();

      if (!conversation.name) {
        let conversationFriendUserID;
        for (let index in conversation.members) {
          if (conversation.members[index] !== userID)
            conversationFriendUserID = conversation.members[index];
        }

        if (conversationFriendUserID) {
          const userDisplayDoc = await db
            .collection("users_display_name")
            .doc(conversationFriendUserID)
            .get();

          if (userDisplayDoc.data() && userDisplayDoc.data().displayName) {
            conversation.name = userDisplayDoc.data().displayName;
            setConversationName(userDisplayDoc.data().displayName);
          }
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

export const getMessages = async (messages, setMessages) => {
  const startAt = getEndAtValueTimestamp(comments);

  const snapshot = await db
    .collection("vent_data")
    .doc(ventID)
    .collection("comments")
    .orderBy("server_timestamp", "desc")
    .startAfter(startAt)
    .limit(10)
    .get();

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newComments = [];
    snapshot.docs.forEach((doc, index) => {
      newComments.push({ ...doc.data(), id: doc.id, doc });
    });

    setMessages(oldComments => {
      if (oldComments) return [...oldComments, ...newComments];
      else return newComments;
    });
  } else setMessages([]);

  const messagesRef = db
    .collection("conversation_extra_data")
    .doc(conversation.id)
    .collection("messages");
  const query = messagesRef.orderBy("server_timestamp").limit(25);
};

export const sendMessage = async (conversationID, message, userID) => {
  await db
    .collection("conversation_extra_data")
    .doc(conversationID)
    .collection("messages")
    .add({
      body: message,
      server_timestamp: firebase.firestore.Timestamp.now().seconds * 1000,
      userID
    });
};

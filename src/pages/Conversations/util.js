import firebase from "firebase/app";
import db from "../../config/firebase";
import { getEndAtValueTimestamp } from "../../util";

export const getConversationName = async (
  conversation,
  setConversationNames,
  userID
) => {
  let conversationFriendUserID;
  for (let index in conversation.members) {
    if (conversation.members[index] !== userID)
      conversationFriendUserID = conversation.members[index];
  }
  if (!conversationFriendUserID) return;
  const userDisplayDoc = await db
    .collection("users_display_name")
    .doc(conversationFriendUserID)
    .get();

  if (userDisplayDoc.data() && userDisplayDoc.data().displayName) {
    setConversationNames(oldNames => {
      oldNames[conversation.id] = userDisplayDoc.data().displayName;
      return { ...oldNames };
    });
  }
};

export const messageListener = (
  conversationID,
  scrollToBottom,
  setMessages,
  first = true
) => {
  const unsubscribe = db
    .collection("conversation_extra_data")
    .doc(conversationID)
    .collection("messages")
    .where(
      "server_timestamp",
      ">=",
      firebase.firestore.Timestamp.now().seconds * 1000
    )
    .orderBy("server_timestamp", "desc")
    .limit(1)
    .onSnapshot(
      querySnapshot => {
        if (first) {
          first = false;
        } else if (querySnapshot.docs && querySnapshot.docs[0]) {
          if (
            querySnapshot.docChanges()[0].type === "added" ||
            querySnapshot.docChanges()[0].type === "removed"
          ) {
            scrollToBottom();

            setMessages(oldMessages => [
              {
                ...querySnapshot.docs[0].data(),
                id: querySnapshot.docs[0].id,
                doc: querySnapshot.docs[0]
              },
              ...oldMessages
            ]);
          }
        }
      },
      err => {}
    );
  return unsubscribe;
};

export const getConversations = async (
  conversations,
  setActiveConversation,
  setConversations,
  userID
) => {
  const startAt = getEndAtValueTimestamp(conversations);

  const conversationsQuerySnapshot = await db
    .collection("conversations")
    .where("members", "array-contains", userID)
    .orderBy("last_updated", "desc")
    .startAfter(startAt)
    .limitToLast(10)
    .get();

  if (!conversationsQuerySnapshot.empty) {
    let conversations = [];
    conversationsQuerySnapshot.docs.forEach((item, i) => {
      conversations.push({
        id: item.id,
        ...item.data(),
        doc: conversationsQuerySnapshot.docs[i]
      });
    });
    setConversations(conversations);
  }
};

export const getMessages = async (
  conversationID,
  messages,
  scrollToBottom,
  setCanLoadMore,
  setMessages,
  first = true
) => {
  let startAt = getEndAtValueTimestamp(messages);
  if (first) startAt = getEndAtValueTimestamp([]);
  const snapshot = await db
    .collection("conversation_extra_data")
    .doc(conversationID)
    .collection("messages")
    .orderBy("server_timestamp", "desc")
    .startAfter(startAt)
    .limit(10)
    .get();

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newMessages = [];
    snapshot.docs.forEach((doc, index) => {
      newMessages.push({ ...doc.data(), id: doc.id, doc });
    });

    if (first) {
      setMessages(newMessages);
      scrollToBottom();
    } else {
      if (newMessages.length < 10) setCanLoadMore(false);
      setMessages(oldMessages => {
        if (oldMessages) return [...oldMessages, ...newMessages];
        else return newMessages;
      });
    }
  } else {
    setCanLoadMore(false);
  }
};

export const readConversation = async (conversation, userID) => {
  await db
    .collection("conversations")
    .doc(conversation.id)
    .set({ [userID]: true }, { merge: true });
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

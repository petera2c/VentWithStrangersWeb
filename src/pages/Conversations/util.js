import firebase from "firebase/compat/app";
import db from "../../config/firebase";

import { getEndAtValueTimestamp, getIsUserOnline } from "../../util";

export const deleteConversation = async (
  conversationID,
  setConversations,
  userID
) => {
  setConversations((oldConversations) => {
    const deleteIndex = oldConversations.findIndex(
      (conversation) => conversation.id === conversationID
    );
    oldConversations.splice(deleteIndex, 1);
    return [...oldConversations];
  });

  await db
    .collection("conversations")
    .doc(conversationID)
    .update({
      members: firebase.firestore.FieldValue.arrayRemove(userID),
    });

  alert("Conversation deleted!");
};
export const deleteMessage = async (conversationID, messageID, setMessages) => {
  await db
    .collection("conversation_extra_data")
    .doc(conversationID)
    .collection("messages")
    .doc(messageID)
    .delete();

  setMessages((messages) => {
    messages.splice(
      messages.findIndex((message) => message.id === messageID),
      1
    );
    return [...messages];
  });
  alert("Message deleted!");
};

export const getConversationBasicData = async (
  conversation,
  setConversationsBasicDatas,
  userID
) => {
  let conversationFriendUserID;
  for (let index in conversation.members) {
    if (conversation.members[index] !== userID)
      conversationFriendUserID = conversation.members[index];
  }
  if (!conversationFriendUserID) return;
  const userBasicInfo = await db
    .collection("users_display_name")
    .doc(conversationFriendUserID)
    .get();

  if (userBasicInfo.data() && userBasicInfo.data().displayName) {
    getIsUserOnline((isUserOnline) => {
      setConversationsBasicDatas((currentUsersBasicInfo) => {
        currentUsersBasicInfo[conversation.id] = {
          ...userBasicInfo.data(),
          isUserOnline,
        };
        return { ...currentUsersBasicInfo };
      });
    }, conversationFriendUserID);
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
      firebase.firestore.Timestamp.now().toMillis()
    )
    .orderBy("server_timestamp", "desc")
    .limit(1)
    .onSnapshot(
      (querySnapshot) => {
        if (first) {
          first = false;
        } else if (querySnapshot.docs && querySnapshot.docs[0]) {
          if (
            querySnapshot.docChanges()[0].type === "added" ||
            querySnapshot.docChanges()[0].type === "removed"
          ) {
            setMessages((oldMessages) => [
              {
                ...querySnapshot.docs[0].data(),
                id: querySnapshot.docs[0].id,
                doc: querySnapshot.docs[0],
              },
              ...oldMessages,
            ]);
            setTimeout(() => {
              scrollToBottom();
            }, 200);
          }
        }
      },
      (err) => {}
    );
  return unsubscribe;
};

export const getConversation = async (
  isMounted,
  conversationID,
  setConversations,
  userID
) => {
  const conversationDoc = await db
    .collection("conversations")
    .doc(conversationID)
    .get();
  if (!conversationDoc.exists) return;

  if (isMounted())
    setConversations((oldConversations) => {
      oldConversations.push({
        id: conversationDoc.id,
        ...conversationDoc.data(),
        doc: conversationDoc,
      });
      return oldConversations;
    });
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
    .limit(5)
    .get();

  let newConversations = [];
  conversationsQuerySnapshot.docs.forEach((item, i) => {
    if (conversations.find((conversation) => conversation.id === item.id))
      return;

    const temp = {
      id: item.id,
      ...item.data(),
      doc: conversationsQuerySnapshot.docs[i],
    };

    newConversations.push(temp);
  });

  setConversations(newConversations);
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

    if (newMessages.length < 10) setCanLoadMore(false);
    if (first) {
      setMessages(newMessages);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    } else {
      setMessages((oldMessages) => {
        if (oldMessages) return [...oldMessages, ...newMessages];
        else return newMessages;
      });
    }
  } else {
    setCanLoadMore(false);
  }
};

export const mostRecentConversationListener = (
  currentConversations,
  setConversations,
  userID,
  first = true
) => {
  const unsubscribe = db
    .collection("conversations")
    .where("members", "array-contains", userID)
    .where("last_updated", ">=", firebase.firestore.Timestamp.now().toMillis())
    .orderBy("last_updated", "desc")
    .limit(1)
    .onSnapshot((querySnapshot) => {
      const conversationDoc = querySnapshot.docs[0];

      if (first) {
        first = false;
      } else if (conversationDoc) {
        if (currentConversations && currentConversations.length > 0) {
          setConversations((oldConversations) => {
            const isConversationAlreadyListening = oldConversations.some(
              (obj) => obj.id === conversationDoc.id
            );

            if (!isConversationAlreadyListening)
              return [
                {
                  doc: conversationDoc,
                  id: conversationDoc.id,
                  ...conversationDoc.data(),
                },
                ...oldConversations,
              ];
            else return oldConversations;
          });
        }
      }
    });
  return unsubscribe;
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
      server_timestamp: firebase.firestore.Timestamp.now().toMillis(),
      userID,
    });
};

export const setConversationIsTyping = async (conversationID, userID) => {
  await db
    .collection("conversations")
    .doc(conversationID)
    .set(
      {
        isTyping: {
          [userID]: firebase.firestore.Timestamp.now().toMillis(),
        },
      },
      { merge: true }
    );
};

export const conversationListener = (
  currentConversation,
  setConversations,
  setCurrentConversation
) => {
  const unsubscribe = db
    .collection("conversations")
    .doc(currentConversation.id)
    .onSnapshot((doc) => {
      const updatedConversation = { ...doc.data(), id: doc.id };

      setCurrentConversation((oldConversation) => updatedConversation);

      if (
        currentConversation.last_updated !== updatedConversation.last_updated
      ) {
        setConversations((oldConversations) => {
          const indexOfUpdatedConversation = oldConversations.findIndex(
            (conversation) => conversation.id === updatedConversation.id
          );

          oldConversations[indexOfUpdatedConversation] = updatedConversation;
          oldConversations.sort((a, b) =>
            a.last_updated < b.last_updated ? 1 : -1
          );

          return [...oldConversations];
        });
      }
    });

  return unsubscribe;
};

import {
  arrayRemove,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/db_init";

import { message } from "antd";

import {
  getEndAtValueTimestamp,
  getEndAtValueTimestampFirst,
  getIsUserOnline,
} from "../../util";

export const deleteConversation = async (
  conversationID,
  navigate,
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

  await updateDoc(doc(db, "conversations", conversationID), {
    [userID]: deleteField(),
    members: arrayRemove(userID),
  });

  navigate("/chat");

  message.success("Conversation deleted!");
};

export const deleteMessage = async (conversationID, messageID, setMessages) => {
  await deleteDoc(
    doc(db, "conversation_extra_data", conversationID, "messages", messageID)
  );

  setMessages((messages) => {
    messages.splice(
      messages.findIndex((message) => message.id === messageID),
      1
    );
    return [...messages];
  });
  message.success("Message deleted!");
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

  const userBasicInfo = await getDoc(
    doc(db, "users_display_name", conversationFriendUserID)
  );

  if (userBasicInfo.data() && userBasicInfo.data().displayName) {
    getIsUserOnline((isUserOnline) => {
      setConversationsBasicDatas((currentUsersBasicInfo) => {
        currentUsersBasicInfo[conversation.id] = {
          ...userBasicInfo.data(),
          isUserOnline: isUserOnline.state,
        };
        return { ...currentUsersBasicInfo };
      });
    }, conversationFriendUserID);
  }
};

export const messageListener = (
  conversationID,
  isMounted,
  scrollToBottom,
  setMessages,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "conversation_extra_data", conversationID, "messages"),
      where("server_timestamp", ">=", Timestamp.now().toMillis()),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      if (first) {
        first = false;
      } else if (querySnapshot.docs && querySnapshot.docs[0]) {
        if (
          querySnapshot.docChanges()[0].type === "added" ||
          querySnapshot.docChanges()[0].type === "removed"
        ) {
          if (isMounted.current)
            setMessages((oldMessages) => [
              ...oldMessages,
              {
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data(),
                doc: querySnapshot.docs[0],
              },
            ]);
          setTimeout(() => {
            scrollToBottom();
          }, 200);
        }
      }
    }
  );

  return unsubscribe;
};

export const getConversations = async (
  activeConversation,
  conversations,
  isMounted,
  setActiveConversation,
  setConversations,
  userID
) => {
  const startAt = getEndAtValueTimestamp(conversations);

  const conversationsQuerySnapshot = await getDocs(
    query(
      collection(db, "conversations"),
      where("members", "array-contains", userID),
      orderBy("last_updated", "desc"),
      startAfter(startAt),
      limit(5)
    )
  );

  let isActiveConversationInNewConversations = 0;
  let newConversations = [];
  conversationsQuerySnapshot.docs.forEach((item, i) => {
    if (conversations.find((conversation) => conversation.id === item.id)) {
      isActiveConversationInNewConversations++;
      return;
    }

    newConversations.push({
      id: item.id,
      ...item.data(),
      doc: conversationsQuerySnapshot.docs[i],
      useToPaginate: true,
    });
  });

  if (
    activeConversation &&
    !conversations.find(
      (conversation) => conversation.id === activeConversation
    ) &&
    !newConversations.find(
      (conversation) => conversation.id === activeConversation
    )
  ) {
    const conversationDoc = await getDoc(
      doc(db, "conversations", activeConversation)
    );

    if (conversationDoc.exists)
      newConversations.push({
        id: conversationDoc.id,
        doc: conversationDoc,
        ...conversationDoc.data(),
        useToPaginate: false,
      });
  }

  if (isMounted.current)
    setConversations(newConversations, isActiveConversationInNewConversations);
};

export const getMessages = async (
  conversationID,
  isMounted,
  messages,
  scrollToBottom,
  setCanLoadMore,
  setMessages,
  first = true
) => {
  let startAt = getEndAtValueTimestampFirst(messages);
  if (first) startAt = getEndAtValueTimestampFirst([]);

  const snapshot = await getDocs(
    query(db, "conversation_extra_data", conversationID, "messages"),
    orderBy("server_timestamp", "desc"),
    startAfter(startAt),
    limit(10)
  );

  if (!isMounted.current) return;

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newMessages = [];
    snapshot.docs.forEach((doc, index) => {
      newMessages.unshift({ id: doc.id, doc, ...doc.data() });
    });

    if (newMessages.length < 10) setCanLoadMore(false);
    if (first) {
      setMessages(newMessages);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    } else {
      setMessages((oldMessages) => {
        if (oldMessages) return [...newMessages, ...oldMessages];
        else return newMessages;
      });
    }
  } else {
    setMessages([]);
    setCanLoadMore(false);
  }
};

export const mostRecentConversationListener = (
  isMounted,
  setConversations,
  userID,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "conversations"),
      where("members", "array-contains", userID),
      where("last_updated", ">=", Timestamp.now().toMillis()),
      orderBy("last_updated", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      const conversationDoc = querySnapshot.docs[0];

      if (first) {
        first = false;
      } else if (conversationDoc && isMounted.current) {
        setConversations((oldConversations) => {
          const isConversationAlreadyListening = oldConversations.some(
            (obj) => obj.id === conversationDoc.id
          );

          if (!isConversationAlreadyListening)
            return [
              ...oldConversations,
              {
                doc: conversationDoc,
                id: conversationDoc.id,
                ...conversationDoc.data(),
              },
            ];
          else return oldConversations;
        });
      }
    }
  );

  return unsubscribe;
};

export const readConversation = async (conversation, userID) => {
  await db
    .collection("conversations")
    .doc(conversation.id)
    .set({ [userID]: true, go_to_inbox: false }, { merge: true });
};

export const sendMessage = async (conversationID, message, userID) => {
  await db
    .collection("conversation_extra_data")
    .doc(conversationID)
    .collection("messages")
    .add({
      body: message,
      server_timestamp: Timestamp.now().toMillis(),
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
          [userID]: Timestamp.now().toMillis(),
        },
      },
      { merge: true }
    );
};

export const conversationListener = (currentConversation, setConversations) => {
  const unsubscribe = db
    .collection("conversations")
    .doc(currentConversation.id)
    .onSnapshot((doc) => {
      const updatedConversation = { id: doc.id, ...doc.data() };

      setConversations((oldConversations) => {
        const indexOfUpdatedConversation = oldConversations.findIndex(
          (conversation) => conversation.id === updatedConversation.id
        );

        for (let index in updatedConversation) {
          oldConversations[indexOfUpdatedConversation][index] =
            updatedConversation[index];
        }

        oldConversations.sort((a, b) =>
          a.last_updated < b.last_updated ? 1 : -1
        );

        return [...oldConversations];
      });
    });

  return unsubscribe;
};

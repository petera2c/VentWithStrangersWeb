import db from "../../config/firebase";
import { soundNotify } from "../../util";

export const conversationsListener = (navigate, userID) => {
  const unsubscribe = db
    .collection("conversations")
    .where("members", "array-contains", userID)
    .orderBy("last_updated", "desc")
    .limit(1)
    .onSnapshot((snapshot) => {
      if (snapshot.docs && snapshot.docs[0]) {
        const doc = snapshot.docs[0];
        if (doc.data().go_to_inbox) navigate("/chat?" + doc.id);
      }
    });

  return unsubscribe;
};

export const getNotifications = (
  isMounted,
  notifications,
  setNotificationCounter,
  setNotifications,
  user,
  firstLoad = true
) => {
  const unsubscribe = db
    .collection("notifications")
    .orderBy("server_timestamp")
    .where("userID", "==", user.uid)
    .limitToLast(10)
    .onSnapshot("value", (snapshot) => {
      if (snapshot.docs) {
        if (isMounted.current) {
          const newNotifications = snapshot.docs
            .map((item, i) => {
              return { id: item.id, ...item.data(), doc: item };
            })
            .reverse();

          let counter1 = 0;
          for (let index in notifications)
            if (!notifications[index].hasSeen) counter1++;

          let counter2 = 0;
          for (let index in newNotifications)
            if (!newNotifications[index].hasSeen) counter2++;
          if (counter2 > counter1 && !firstLoad) soundNotify();

          setNotificationCounter(counter2 + counter1);
          setNotifications((oldNotifications) => {
            return [...newNotifications, ...oldNotifications];
          });
        }
      } else {
        if (isMounted.current) setNotifications([]);
      }
      firstLoad = false;
    });

  return unsubscribe;
};

export const getUnreadConversations = (
  isMounted,
  isOnSearchPage,
  pathname,
  setUnreadConversations,
  userID,
  first = true
) => {
  const unsubscribe = db
    .collection("unread_conversations_count")
    .doc(userID)
    .onSnapshot("value", (doc) => {
      if (doc.data() && doc.data().count) {
        if (!first && !isOnSearchPage) soundNotify();
        if (pathname === "/chat" && doc.data().count > 0) {
          return resetUnreadConversationCount(
            isMounted,
            setUnreadConversations,
            userID
          );
        }

        if (isMounted.current) setUnreadConversations(doc.data().count);
      } else {
        if (isMounted.current) setUnreadConversations(0);
      }
      first = false;
    });

  return unsubscribe;
};

export const howCompleteIsUserProfile = (
  setMissingAccountPercentage,
  userBasicInfo
) => {
  let percentage = 0;

  if (userBasicInfo.gender) percentage += 0.125;
  if (userBasicInfo.pronouns) percentage += 0.125;
  if (userBasicInfo.birth_date) percentage += 0.125;
  if (userBasicInfo.partying) percentage += 0.125;
  if (userBasicInfo.politicalBeliefs) percentage += 0.125;
  if (userBasicInfo.education) percentage += 0.125;
  if (userBasicInfo.kids) percentage += 0.125;
  if (userBasicInfo.avatar) percentage += 0.125;

  setMissingAccountPercentage(percentage);
};

export const isUserInQueueListener = (isMounted, setIsUserInQueue, userID) => {
  const unsubscribe = db
    .collection("chat_queue")
    .doc(userID)
    .onSnapshot("value", (doc) => {
      if (doc.data() && doc.data().userID === userID && isMounted.current)
        setIsUserInQueue(true);
      else if (isMounted.current) setIsUserInQueue(false);
    });

  return unsubscribe;
};

export const leaveQueue = async (userID) => {
  await db.collection("chat_queue").doc(userID).delete();
};

export const readNotifications = (notifications) => {
  for (let index in notifications) {
    const notification = notifications[index];
    if (!notification.hasSeen) {
      db.collection("notifications").doc(notification.id).update({
        hasSeen: true,
      });
    }
  }
};

export const resetUnreadConversationCount = (
  isMounted,
  setUnreadConversationsCount,
  userID
) => {
  if (isMounted.current)
    db.collection("unread_conversations_count").doc(userID).set({ count: 0 });
  if (isMounted.current) setUnreadConversationsCount(0);
};

import db from "../../config/firebase";
import { soundNotify } from "../../util";

export const getNotifications = (
  isMounted,
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
        if (isMounted())
          setNotifications((oldNotifications) => {
            const newNotifications = snapshot.docs
              .map((item, i) => {
                return { id: item.id, ...item.data(), doc: item };
              })
              .reverse();
            let counter1 = 0;
            for (let index in oldNotifications)
              if (!oldNotifications[index].hasSeen) counter1++;

            let counter2 = 0;
            for (let index in newNotifications)
              if (!newNotifications[index].hasSeen) counter2++;
            if (counter2 > counter1 && !firstLoad) soundNotify();
            return newNotifications;
          });
      } else {
        if (isMounted()) setNotifications([]);
      }
      firstLoad = false;
    });

  return unsubscribe;
};

export const getUnreadConversations = (
  isMounted,
  isOnSearchPage,
  setUnreadConversations,
  userID,
  first = true
) => {
  const unsubscribe = db
    .collection("unread_conversations_count")
    .doc(userID)
    .onSnapshot("value", (doc) => {
      if (doc.data() && doc.data().count) {
        if (isMounted()) setUnreadConversations(doc.data().count);
        if (!first && !isOnSearchPage) soundNotify();
      } else {
        if (isMounted()) setUnreadConversations(0);
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

export const newNotificationCounter = (notifications) => {
  let counter = 0;

  for (let index in notifications) {
    if (!notifications[index].hasSeen) counter++;
  }

  if (!counter) return false;
  else return counter;
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

export const resetUnreadConversationCount = (userID) => {
  db.collection("unread_conversations_count").doc(userID).set({ count: 0 });
};

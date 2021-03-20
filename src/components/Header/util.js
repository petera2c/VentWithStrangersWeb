import db from "../../config/firebase";
import { soundNotify } from "../../util";

export const getNotifications = (setNotifications, user, firstLoad = true) => {
  db.collection("notifications")
    .orderBy("server_timestamp")
    .where("userID", "==", user.uid)
    .limitToLast(10)
    .onSnapshot("value", snapshot => {
      if (snapshot.docs)
        setNotifications(oldNotifications => {
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
      else setNotifications([]);
      firstLoad = false;
    });
};

export const getUnreadConversations = (
  setUnreadConversations,
  userID,
  first = true
) => {
  db.collection("unread_conversations_count")
    .doc(userID)
    .onSnapshot("value", doc => {
      if (doc.data() && doc.data().count) {
        setUnreadConversations(doc.data().count);
        if (!first) {
          soundNotify();
        }
      } else setUnreadConversations(0);
      first = false;
    });
};

export const newNotificationCounter = notifications => {
  let counter = 0;

  for (let index in notifications) {
    if (!notifications[index].hasSeen) counter++;
  }

  if (!counter) return false;
  else return counter;
};

export const readNotifications = notifications => {
  for (let index in notifications) {
    const notification = notifications[index];
    if (!notification.hasSeen) {
      db.collection("notifications")
        .doc(notification.id)
        .update({
          hasSeen: true
        });
    }
  }
};

export const resetUnreadConversationCount = userID => {
  db.collection("unread_conversations_count")
    .doc(userID)
    .set({ count: 0 });
};

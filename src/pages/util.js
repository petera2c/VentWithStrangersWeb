import io from "socket.io-client";

export const initReceiveNotifications = (
  socket,
  soundNotify,
  updateNotifications,
  userID
) => {
  socket.on(userID + "_receive_new_notifications", dataObj => {
    const { newNotifications } = dataObj;

    soundNotify("bing");

    if (Notification.permission !== "granted") Notification.requestPermission();
    else {
      const notificationObj = newNotifications[0];
      if (notificationObj) {
        var notification = new Notification(notificationObj.title, {
          icon: "https://www.ventwithstrangers.com/favicon.ico",
          body: notificationObj.body
        });

        notification.onclick = () => {
          window.open(notificationObj.link);
        };
      }
    }

    updateNotifications(newNotifications);
  });
};

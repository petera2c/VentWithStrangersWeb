import io from "socket.io-client";

export const getNotifications = (skip, socket, updateNotifications) => {
  socket.emit("get_notifications", { skip }, (dataObj) => {
    const { newNotifications } = dataObj;

    updateNotifications(newNotifications);
  });
};

export const getUsersComments = (
  handleChange,
  notify,
  search,
  socket,
  user
) => {
  let searchID = user._id;
  if (search) searchID = search;

  socket.emit("get_users_comments", { searchID }, (result) => {
    const { comments, message, success } = result;

    if (success) handleChange({ comments });
    else {
      handleChange({ comments });
      notify({ message, type: "danger" });
    }
  });
};

export const getUsersPosts = (
  handleChange,
  notify,
  oldVents,
  search,
  skip,
  socket,
  user
) => {
  let searchID = user._id;
  if (search) searchID = search;

  socket.emit("get_users_posts", { searchID, skip }, (result) => {
    const { message, problems, success } = result;
    let newVents = problems;
    let canLoadMorePosts = true;

    if (newVents && newVents.length < 10) canLoadMorePosts = false;
    if (skip && oldVents) newVents = oldVents.concat(newVents);

    handleChange({ canLoadMorePosts, vents: newVents });
  });
};

export const initSocket = (callback) => {
  let socket;
  if (process.env.NODE_ENV === "development")
    socket = io("http://localhost:5000");
  else socket = io();

  callback({ socket });
};

export const initReceiveNotifications = (
  socket,
  soundNotify,
  updateNotifications,
  userID
) => {
  socket.on(userID + "_receive_new_notifications", (dataObj) => {
    const { newNotifications } = dataObj;

    soundNotify("bing");

    if (Notification.permission !== "granted") Notification.requestPermission();
    else {
      const notificationObj = newNotifications[0];
      if (notificationObj) {
        var notification = new Notification(notificationObj.title, {
          icon: "https://www.ventwithstrangers.com/favicon.ico",
          body: notificationObj.body,
        });

        notification.onclick = () => {
          window.open(notificationObj.link);
        };
      }
    }

    updateNotifications(newNotifications);
  });
};

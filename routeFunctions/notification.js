const Notification = require("../models/Notification");
const Settings = require("../models/Settings");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const keys = require("../config/keys");

const { notificationTypes } = require("../constants/lists");

const getNotificationBody = (title, type, userDisplayName) => {
  if (type === 1)
    return userDisplayName + " commented on your post '" + title + "'";
  else if (type === 2)
    return userDisplayName + " loved your comment '" + title + "'";
  else if (type === 3)
    return userDisplayName + " loved your post '" + title + "'";
};
const getNotificationTitle = type => {
  if (type === 1) return "Someone commented on your post!";
  else if (type === 2) return "Someone loved your comment!";
  else if (type === 3) return "Someone loved your post!";
};

const getProblemLink = problem => {
  return (
    "https://www.ventwithstrangers.com/problem/" +
    problem._id +
    "/" +
    problem.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase()
  );
};

const getNotifications = (dataObj, socket) => {
  const userID = socket.request.user._id;
  const { skip } = dataObj;

  Notification.find({ receiverID: userID }, (err, notifications) => {
    if (notifications)
      socket.emit("receive_new_notifications", {
        newNotifications: notifications
      });
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(10);
};

const sendEmail = (body, callback, sendToEmail, subject) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: keys.email,
      pass: keys.emailPassword
    }
  });

  var mailOptions = {
    from: keys.email,
    to: sendToEmail,
    subject: subject,
    text: body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      if (callback)
        callback({
          success: false,
          errorMessage:
            "Could not send email to this address. Please contact us immediately for assistance."
        });
    } else if (callback) callback({ success: true });
  });
};
const saveNotification = (
  body,
  link,
  objectID,
  receiverID,
  senderID,
  title,
  type,
  userSockets
) => {
  if (receiverID && senderID && String(receiverID) !== String(senderID))
    Settings.findOne({ userID: receiverID }, (err, settings) => {
      User.findById(receiverID, { email: 1 }, (err, receiverUser) => {
        new Notification({
          body,
          hasSeen: false,
          link,
          objectID,
          receiverID,
          senderID,
          title,
          type
        }).save((err, notification) => {
          if (notification) {
            if (userSockets[receiverID])
              userSockets[receiverID].emit("receive_new_notifications", {
                newNotifications: [notification]
              });
            if (receiverUser && receiverUser.email) {
              if (
                (type === 1 && settings.postCommented) ||
                (type === 2 && settings.commentLiked) ||
                (type === 3 && settings.postLiked)
              )
                sendEmail(
                  body + " Check it out at " + link,
                  undefined,
                  receiverUser.email,
                  title
                );
            }
          }
        });
      });
    });
};

const commentPostNotification = (problem, socket, userSockets) => {
  const type = 1;
  const { user } = socket.request;

  saveNotification(
    getNotificationBody(problem.title, type, user.displayName),
    getProblemLink(problem),
    problem._id,
    problem.authorID,
    user._id,
    getNotificationTitle(type),
    type,
    userSockets
  );
};

const likeCommentNotification = (comment, problem, socket, userSockets) => {
  const type = 2;
  const { user } = socket.request;

  saveNotification(
    getNotificationBody(comment.text, type, user.displayName),
    getProblemLink(problem),
    problem._id,
    comment.authorID,
    user._id,
    getNotificationTitle(type),
    type,
    userSockets
  );
};

const likeProblemNotification = (problem, socket, userSockets) => {
  const type = 3;
  const { user } = socket.request;

  saveNotification(
    getNotificationBody(problem.title, type, user.displayName),
    getProblemLink(problem),
    problem._id,
    problem.authorID,
    user._id,
    getNotificationTitle(type),
    type,
    userSockets
  );
};

const readNotifications = (callback, socket) => {
  const userID = socket.request.user._id;
  let counter = 0;
  Notification.find(
    { hasSeen: false, receiverID: userID },
    { hasSeen: 1 },
    (err, notifications) => {
      if (err || !notifications) return callback({ success: false });
      for (let index in notifications) {
        counter++;
        notifications[index].hasSeen = true;
        notifications[index].save((err, result) => {
          if (err || !result) return callback({ success: false });
          counter--;
          if (counter === 0) return callback({ success: true });
        });
      }
    }
  );
};

module.exports = {
  commentPostNotification,
  getNotifications,
  likeCommentNotification,
  likeProblemNotification,
  readNotifications
};
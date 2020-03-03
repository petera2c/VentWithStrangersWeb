const Notification = require("../models/Notification");
const Settings = require("../models/Settings");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const keys = require("../config/keys");

const { notificationTypes } = require("../constants/lists");

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
  type
) => {
  if (receiverID && senderID && String(receiverID) !== String(senderID))
    User.findById(receiverID, { email: 1 }, (err, receiverUser) => {
      new Notification({
        hasSeen: false,
        link,
        objectID,
        receiverID,
        senderID,
        type
      }).save((err, notification) => {
        if (notification) {
          if (receiverUser && receiverUser.email) {
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
};

const commentPostNotification = (problem, user) => {
  saveNotification(
    user.displayName + " commented on your post '" + problem.title + "'",
    "https://www.ventwithstrangers.com/problem/" +
      problem._id +
      "/" +
      problem.title
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/ /g, "-")
        .toLowerCase(),
    problem._id,
    problem.authorID,
    user._id,
    "Someone commented on your post!",
    1
  );
};

const likeCommentNotification = (problem, user) => {
  saveNotification(
    user.displayName + " loved your comment '" + comment.text + "'",
    "https://www.ventwithstrangers.com/problem/" +
      problem._id +
      "/" +
      problem.title
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/ /g, "-")
        .toLowerCase(),
    problem._id,
    comment.authorID,
    user._id,
    "Someone loved your comment!",
    2
  );
};

const likeProblemNotification = (problem, user) => {
  saveNotification(
    user.displayName + " loved your post '" + problem.title + "'",
    "https://www.ventwithstrangers.com/problem/" +
      problem._id +
      "/" +
      problem.title
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/ /g, "-")
        .toLowerCase(),
    problem._id,
    savedProblem.authorID,
    user._id,
    "Someone loved your post!",
    3
  );
};

module.exports = {
  commentPostNotification,
  likeCommentNotification,
  likeProblemNotification
};

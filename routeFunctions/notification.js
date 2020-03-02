const Notification = require("../models/Notification");
const Settings = require("../models/Settings");
const User = require("../models/User");

const saveNotification = (senderID, type, receiverID) => {
  new Notification({
    commentTypeID: type,
    hasSeen: false,
    senderID,
    receiverID
  }).save((notification, err) => {
    console.log(notification);
  });
};
module.exports = { saveNotification };

const Settings = require("../models/Settings");

const getSettings = (callback, socket) => {
  const { settingsID } = socket.request.user;

  Settings.findById(settingsID, (err, settings) => {
    if (!err && settings) callback({ settings, success: true });
    else callback({ success: false });
  });
};

const saveSettings = (dataObj, callback, socket) => {
  const { settingsID } = socket.request.user;
  const {
    adultContent,
    commentLiked,
    postCommented,
    postLiked,
    receiveEmails
  } = dataObj;

  Settings.findById(settingsID, (err, settings) => {
    if (!err && settings) {
      settings.adultContent = adultContent;
      settings.commentLiked = commentLiked;
      settings.postCommented = postCommented;
      settings.postLiked = postLiked;
      settings.receiveEmails = receiveEmails;

      settings.save((err, savedSettings) => {
        if (!err && savedSettings) callback({ settings, success: true });
        else callback({ message: "Can not save settings.", success: false });
      });
    } else callback({ message: "Can not find settings.", success: false });
  });
};

module.exports = {
  getSettings,
  saveSettings
};

const bcrypt = require("bcrypt-nodejs");
const passport = require("passport");

const Settings = require("../models/Settings");
const User = require("../models/User");

const names = require("./names");

const login = (req, res, next) => {
  passport.authenticate("local-login", (err, user, message) => {
    let success = true;

    if (err) success = false;
    if (!user) success = false;

    if (success) {
      req.logIn(user, err => {
        if (err) {
          success = false;
          message =
            "Could not log you in! :( Please refresh the page and try again :)";
        }
        res.send({ success, user, message });
      });
    } else {
      res.send({ success, message });
    }
  })(req, res, next);
};

const randomLogin = (req, res, next) => {
  passport.authenticate("local-login", (err, user, message) => {
    const randomIndex = Math.floor(Math.random() * 1999);

    const newSettings = new Settings({
      adultContent: false,
      postCommented: true,
      postLiked: true,
      receiveEmails: true
    });
    const newUser = new User({
      displayName: names[randomIndex],
      language: "english",
      settingsID: newSettings._id,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    newSettings.userID = newUser._id;
    newSettings.save((err, savedSettings) => {
      newUser.save((err2, savedUser) =>
        req.logIn(savedUser, err3 => {
          if (err || err2 || err3)
            res.send({
              success: false,
              message:
                "Could not log you in! :( Please refresh the page and try again :)"
            });
          else {
            res.send({ success: true, user: savedUser });
          }
        })
      );
    });
  })(req, res, next);
};

const register = (req, res, next) => {
  const { displayName, email, password } = req.body;

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      User.findById(req.user._id, (err, user) => {
        user.displayName = displayName;
        user.email = email;
        user.password = user.generateHash(password);
        user.save((err, result) => {
          if (!err && result) res.send({ success: true });
          else res.send({ message: err, success: false });
        });
      });
    } else {
      res.send({ success: false, message: "Email already in use" });
    }
  });
};

const updateUser = (dataObj, callback, socket) => {
  const {
    confirmPassword,
    displayName,
    email,
    oldPassword,
    newPassword
  } = dataObj;

  if (
    !email &&
    !displayName &&
    !oldPassword &&
    !newPassword &&
    !confirmPassword
  )
    callback({ message: "All fields are empty!", success: false });
  else if (
    (oldPassword || newPassword || confirmPassword) &&
    !(oldPassword && newPassword && confirmPassword)
  )
    callback({
      message:
        "If you would like to edit your password, please enter your old password, new password and confirm password.",
      success: false
    });
  else if (newPassword && confirmPassword && newPassword !== confirmPassword)
    callback({
      message: "New password and confirm password do not match!",
      success: false
    });
  else if (bcrypt.compareSync(oldPassword, socket.request.user.password))
    callback({
      message: "Your current password does not match!",
      success: false
    });
  else
    User.findById(socket.request.user._id, (err, user) => {
      if (user && !err) {
        if (email) user.email = email;
        if (displayName) user.displayName = displayName;
        if (newPassword) user.password = user.generateHash(newPassword);

        user.save((err, savedUser) =>
          callback({ success: true, user: savedUser })
        );
      } else
        callback({
          message: "Something unexpected has happened.",
          success: false
        });
    });
};
module.exports = { login, randomLogin, register, updateUser };

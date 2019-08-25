const passport = require("passport");
const mongoose = require("mongoose");
const User = require("./models/User");

module.exports = app => {
  // Middleware
  const middleware = (req, res, next) => {
    if (!req.user) return login(req, res, next);
    else next();
  };

  // Get current user
  app.get("/api/user", middleware, (req, res, next) => {
    res.send({ success: true, user: req.user, port: process.env.PORT });
  });
};

login = (req, res, next) => {
  passport.authenticate("local-login", (err, user, message) => {
    const password = Math.floor(Math.random() * 1000000000);

    const newUser = new User({
      password,
      username: password,
      language: "english",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateCreated: new Date()
    });
    user.save().then(savedUser => {
      req.logIn(savedUser, err => {
        if (err)
          res.send({
            success: false,
            message:
              "Could not log you in! :( Please refresh the page and try again :)"
          });
        else res.send({ success: true, user: savedUser });
      });
    });
  })(req, res, next);
};

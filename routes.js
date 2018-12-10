const passport = require("passport");
const User = require("./Models/User");

module.exports = app => {
  // Middleware
  let middleware = function(req, res, next) {
    if (!req.user) {
      login(req, res, next);
      return;
    }
    next();
  };

  // Get current user
  app.get("/api/user", middleware, (req, res, next) => {
    res.send({ success: true, user: req.user, port: process.env.PORT });
  });
  // Update user
  app.post("/api/user", middleware, (req, res, next) => {
    const { userChangesArray } = req.body;
    const { user } = req;

    User.findOne({ _id: user._id }, function(err, user) {
      for (let index in userChangesArray) {
        let change = userChangesArray[index];
        user[change.index] = change.value;
      }

      user.save().then(result => {
        res.send({ success: true, user: result });
      });
    });
  });
};

function login(req, res, next) {
  passport.authenticate("local-login", function(err, user, message) {
    let password = Math.floor(Math.random() * 1000000000);
    user = new User({
      password: password,
      username: password,
      language: "english",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateCreated: new Date()
    });
    user.save().then(savedUser => {
      let success = true;

      req.logIn(savedUser, function(err) {
        if (err) {
          success = false;
          message =
            "Could not log you in! :( Please refresh the page and try again :)";
        }
        res.send({ success: success, user: user, message: message });
      });
    });
  })(req, res, next);
}

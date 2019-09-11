const bcrypt = require("bcrypt-nodejs");
const LocalStrategy = require("passport-local").Strategy;

const keys = require("../config/keys");
const User = require("../models/User");

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });

  // Local email login
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses displayName and password, we will override with email
        displayNameField: "email",
        passwordField: "password"
      },
      (email, password, done) => {
        // Use lower-case e-mails to avoid case-sensitive e-mail matching
        if (email) email = email.toLowerCase();

        User.findOne({ email: email }, (err, user) => {
          if (err) {
            return done(
              false,
              false,
              "Something went wrong :(. Please refresh the page and try again!"
            );
          } else if (!user) {
            return done(
              false,
              false,
              "No account was found with this email address!"
            );
          } else if (!bcrypt.compareSync(password, user.password)) {
            if (user.tempPassword) {
              if (bcrypt.compareSync(password, user.tempPassword)) {
                user.password = user.tempPassword;
                user.tempPassword = undefined;
                user.save().then(result => {
                  return done(false, result, "Success");
                });
              } else {
                return done(false, false, "Invalid password! :(");
              }
            } else {
              return done(false, false, "Invalid password! :(");
            }
          } else {
            return done(false, user, "Success");
          }
        });
      }
    )
  );

  // Local email sign up
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        if (
          (req.user &&
            req.user.displayName &&
            !req.user.displayName.match(/[a-z]/i)) ||
          !req.user
        ) {
          User.findOne({ email }, (err, existingUser) => {
            if (err) {
              return done(false, false, "An error occured :(");
            } else if (existingUser) {
              return done(
                false,
                false,
                "A user with this email already exists!"
              );
            } else {
              let newUser = new User(req.body);
              newUser.password = newUser.generateHash(req.body.password);

              newUser.save().then(user => done(null, user, "Success!"));
            }
          });
        } else {
          return done(null, null, "User already logged in!");
        }
      }
    )
  );
};

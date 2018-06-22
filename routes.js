const passport = require("passport");
const User = require("./Models/User");
module.exports = app => {
	// Middleware
	let middleware = function(req, res, next) {
		if (!req.user) {
			res.send({ success: false, loggedIn: false });
			return;
		}
		next();
	};

	// Login user
	app.post("/api/login", (req, res, next) => {
		passport.authenticate("local-login", function(err, user, message) {
			let success = true;
			if (err) success = false;
			if (!user) success = false;
			if (success) {
				req.logIn(user, function(err) {
					if (err) {
						success = false;
						message = "Could not log you in! :( Please refresh the page and try again :)";
					}
					res.send({ success: success, user: user, message: message });
				});
			} else {
				res.send({ success: success, message: message });
			}
		})(req, res, next);
	});

	// Register user
	app.post("/api/register", (req, res, next) => {
		passport.authenticate("local-signup", function(notUsed, user, message) {
			let success = true;
			if (!user) success = false;
			if (success) {
				req.logIn(user, function(err) {
					if (err) {
						success = false;
						message = "Could not log you in! :( Please refresh the page and try again :)";
					}
					res.send({ success: success, user: user, message: message });
				});
			} else {
				res.send({ success: success, message: message });
			}
		})(req, res, next);
	});
};

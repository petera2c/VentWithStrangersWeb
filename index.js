const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./Config/keys");
const morgan = require("morgan");
const secure = require("express-force-https");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cookieParser = require("cookie-parser");

require("./BackEndFiles/passport")(passport);

mongoose.connect(keys.mongoDevelopentURI);
const db = mongoose.connection;

app.use(morgan("dev")); // Prints all routes used to console
app.use(cookieParser()); // Read cookies (needed for auth)

app.use(
	session({
		secret: keys.cookieKey,
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({ mongooseConnection: db })
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(secure); // Force https

require("./routes")(app); // Routes

// If using production then if a route is not found in express we send user to react routes
if (process.env.NODE_ENV === "production") {
	app.use(express.static("FrontEnd/build"));

	const path = require("path");
	app.get("*", (req, res) => {
		console.log("here");
		console.log(path.resolve(__dirname, "FrontEnd", "build", "index.html"));
		res.sendFile(path.resolve(__dirname, "FrontEnd", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT);

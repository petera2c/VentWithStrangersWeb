const express = require("express");
const app = express();
const mongoose = require("mongoose"); // Connect to mongo
const passport = require("passport"); // For Login and Register
const keys = require("./config/keys");
const morgan = require("morgan"); // Every request is console logged
const session = require("express-session"); // Create sessions in backend
const MongoStore = require("connect-mongo")(session); // Store sessions in mongo securely
const cookieParser = require("cookie-parser"); // Needer for auth to read client cookies
const bodyParser = require("body-parser"); // Read data in post requests from front end

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);

// Socket imports
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const SocketManager = require("./routeFunctions/SocketManager");
io.on("connection", SocketManager);

require("./routeFunctions/passport")(passport);

mongoose.connect(keys.mongoDevelopentURI);
const db = mongoose.connection;

app.use(morgan("dev")); // Prints all routes used to console
app.use(cookieParser()); // Read cookies (needed for auth)

app.use(bodyParser.json({ limit: "50mb" })); //Read data from html forms
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

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

require("./routes")(app); // Routes

// If using production then if a route is not found in express we send user to react routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT);

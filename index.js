const express = require("express");
const app = express();
const mongoose = require("mongoose"); // Connect to mongo
const keys = require("./config/keys");
const morgan = require("morgan"); // Every request is console logged
const session = require("express-session"); // Create sessions in backend
const MongoStore = require("connect-mongo")(session); // Store sessions in mongo securely
const cookieParser = require("cookie-parser"); // Needer for auth to read client cookies
const bodyParser = require("body-parser"); // Read data in post requests from front end
const passport = require("passport"); // For Login and Register
const secure = require("express-force-https"); // force https so http does not work
const fs = require("fs");
const schedule = require("node-schedule");

const { createSiteMap, getMetaInformation } = require("./util");

mongoose.set("useCreateIndex", true);

const allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};
app.use(allowCrossDomain);
app.use(secure);

require("./routeFunctions/passport")(passport);

// Socket imports
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const SocketManager = require("./routeFunctions/SocketManager");
const passportSocketIo = require("passport.socketio");

io.on("connection", SocketManager(io));

mongoose.connect(keys.mongoDevelopentURI, { useNewUrlParser: true });
const db = mongoose.connection;

app.use(morgan("dev")); // Prints all routes used to console
app.use(cookieParser()); // Read cookies (needed for auth)

app.use(bodyParser.json({ limit: "50mb" })); //Read data from html forms
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const sessionStore = new MongoStore({ mongooseConnection: db });

app.use(
  session({
    secret: keys.cookieKey,
    resave: true,
    saveUninitialized: true,
    store: sessionStore
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routeFunctions")(app); // Routes

schedule.scheduleJob("0 0 * * *", () => {
  createSiteMap();
});

// If using production then if a route is not found in express we send user to react routes
if (process.env.NODE_ENV === "production") {
  const injectMetaData = (req, res) => {
    const filePath = path.resolve(__dirname, "./client", "build", "index.html");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }

      getMetaInformation(req.originalUrl, metaObj => {
        const { metaDescription, metaImage, metaTitle } = metaObj;
        console.log(metaObj);
        data = data.replace(/\$OG_TITLE/g, metaTitle);
        data = data.replace(/\$OG_DESCRIPTION/g, metaDescription);
        data = data.replace(/\$OG_IMAGE/g, metaImage);

        res.send(data);
      });
    });
  };

  app.get("/", (req, res) => {
    injectMetaData(req, res);
  });

  app.use(express.static(path.resolve(__dirname, "./client", "build")));

  app.get("*", (req, res) => {
    injectMetaData(req, res);
  });
}
const PORT = process.env.PORT || 5000;

server.listen(PORT);

io.use(
  passportSocketIo.authorize({
    passport,
    cookieParser,
    key: "connect.sid",
    secret: keys.cookieKey,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  })
);

function onAuthorizeSuccess(data, accept) {
  accept();
}

function onAuthorizeFail(data, message, error, accept) {
  console.log("failed connection to socket.io:", data, message);
  if (error) accept(new Error(message));
}

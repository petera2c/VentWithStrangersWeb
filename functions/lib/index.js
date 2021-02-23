"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const app_1 = require("firebase/app");
require("firebase/database");

const admin = require("firebase-admin");
admin.initializeApp();

app_1.default.initializeApp({
  apiKey: "AIzaSyCk8EfNyqarIzBAQSCFgU8634o-e0iA_Os",
  appId: "1:440569980458:web:870c6bde68871e5fd78553",
  authDomain: "vent-with-strangers-2acc6.firebaseapp.com",
  databaseURL: "http://localhost:9000?ns=vent-with-strangers-2acc6",
  measurementId: "G-N5NTVEZHSN",
  messagingSenderId: "440569980458",
  projectId: "vent-with-strangers-2acc6",
  storageBucket: "vent-with-strangers-2acc6.appspot.com",
});

const createVentLink = (vent, ventID) => {
  let link =
    "https://www.ventwithstrangers.com/problem/" +
    ventID +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase();
  if (process.env.FUNCTIONS_EMULATOR)
    link = "http://localhost:3000/problem/" + ventID + "/" + vent.title;
  return link;
};
const createNotification = (link, message, userID) => {
  const db = app_1.default.database();
  const notificationsRef = db.ref("/notifications/" + userID);
  const notificationsObject = {
    hasSeen: false,
    link,
    message,
    server_timestamp: app_1.firestore.FieldValue.serverTimestamp(),
    userID,
  };
  return notificationsRef.push(notificationsObject);
};
exports.newCommentListener = functions.database
  .ref("/comments/{ventID}")
  .onCreate((snapshot, context) => {
    const comment = snapshot.val();
    const { ventID } = context.params;
    if (!vent) return "Error";
    console.log(comment);
    return "";
    return createNotification(
      createVentLink(vent, ventID),
      "Your vent has a new comment!",
      "vent.userID"
    );
  });
exports.newPostListener = functions.database
  .ref("/vents/{ventID}")
  .onCreate((snapshot, context) => {
    const vent = snapshot.val();
    const { ventID } = context.params;
    if (!vent) return "Error";
    return createNotification(
      createVentLink(vent, ventID),
      "Your new vent is live!",
      vent.userID
    );
  });
//# sourceMappingURL=index.js.map

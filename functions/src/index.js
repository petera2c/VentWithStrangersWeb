const functions = require("firebase-functions");
const firebase = require("firebase/app");
require("firebase/database");
const admin = require("firebase-admin");

//const firebaseCongif = require("./config/firebase");
admin.initializeApp();
firebase.initializeApp({
  apiKey: "AIzaSyCk8EfNyqarIzBAQSCFgU8634o-e0iA_Os",
  appId: "1:440569980458:web:870c6bde68871e5fd78553",
  authDomain: "vent-with-strangers-2acc6.firebaseapp.com",
  databaseURL: "http://localhost:9000?ns=vent-with-strangers-2acc6",
  measurementId: "G-N5NTVEZHSN",
  messagingSenderId: "440569980458",
  projectId: "vent-with-strangers-2acc6",
  storageBucket: "vent-with-strangers-2acc6.appspot.com",
});

const createVentLink = (vent) => {
  let link =
    "https://www.ventwithstrangers.com/problem/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase();
  if (process.env.FUNCTIONS_EMULATOR)
    link = "http://localhost:3000/problem/" + vent.id + "/" + vent.title;

  return link;
};

const createNotification = (link, message, userID) => {
  const db = firebase.database();
  const notificationsRef = db.ref("/notifications/" + userID);

  const notificationsObject = {
    hasSeen: false,
    link,
    message,
    server_timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    userID,
  };

  return notificationsRef.push(notificationsObject);
};

const combineInsideObjectWithID = (object) => {
  return Object.keys(object).map((objectID) => {
    return { id: objectID, ...object[objectID] };
  });
};

const combineObjectWithID = (id, object) => {
  object.id = id;
  return object;
};

exports.newCommentListener = functions.database
  .ref("/comments/{ventID}/{commentID}")
  .onCreate((snapshot, context) => {
    if (!snapshot.exists()) return "Error";
    const { ventID } = context.params;

    const db = firebase.database();
    const ventRef = db.ref("/vents/" + ventID);

    return ventRef.once("value", (snapshot) => {
      if (!snapshot.exists()) return "Cannot find post.";
      const vent = combineObjectWithID(ventID, snapshot.val());

      return createNotification(
        createVentLink(vent),
        "Your vent has a new comment!",
        vent.userID
      );
    });
  });

exports.newPostListener = functions.database
  .ref("/vents/{ventID}")
  .onCreate((snapshot, context) => {
    if (!snapshot.exists()) return "Error";
    const { ventID } = context.params;
    const vent = combineObjectWithID(ventID, snapshot.val());

    return createNotification(
      createVentLink(vent),
      "Your new vent is live!",
      vent.userID
    );
  });

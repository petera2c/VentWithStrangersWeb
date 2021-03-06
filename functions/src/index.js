const functions = require("firebase-functions");
const admin = require("firebase-admin");

//const config = require("./config/firebase");
admin.initializeApp(functions.config().firebase);
/*firebase.initializeApp({
  apiKey: "AIzaSyCk8EfNyqarIzBAQSCFgU8634o-e0iA_Os",
  appId: "1:440569980458:web:870c6bde68871e5fd78553",
  authDomain: "vent-with-strangers-2acc6.firebaseapp.com",
  databaseURL: "http://localhost:9000?ns=vent-with-strangers-2acc6",
  measurementId: "G-N5NTVEZHSN",
  messagingSenderId: "440569980458",
  projectId: "vent-with-strangers-2acc6",
  storageBucket: "vent-with-strangers-2acc6.appspot.com",
});*/

console.log("here");

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
  return admin
    .firestore()
    .collection("notifications")
    .doc(userID)
    .push({
      hasSeen: false,
      link,
      message,
      server_timestamp: firebase.firestore.Timestamp.now().seconds * 1000,
      userID,
    });
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

exports.newCommentListener = functions.firestore
  .document("/comments/{ventID}/{commentID}")
  .onCreate(async (snapshot, context) => {
    if (!snapshot.exists()) return "Error";
    const { ventID } = context.params;

    const snapshot = admin
      .firestore()
      .collection("vents")
      .doc(ventID)
      .get();

    if (!snapshot.exists()) return "Cannot find post.";

    const vent = combineObjectWithID(ventID, snapshot.val());

    return createNotification(
      createVentLink(vent),
      "Your vent has a new comment!",
      vent.userID
    );
  });

exports.newPostListener = functions.firestore
  .document("/vents/{ventID}")
  .onCreate((snapshot, context) => {
    console.log(snapshot);
    if (!snapshot.exists()) return "Error";
    const { ventID } = context.params;
    const vent = combineObjectWithID(ventID, snapshot.val());

    return createNotification(
      createVentLink(vent),
      "Your new vent is live!",
      vent.userID
    );
  });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const test = require("firebase-admin").firestore.FieldValue;

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
    .add({
      hasSeen: false,
      link,
      message,
      server_timestamp: admin.firestore.FieldValue.serverTimestamp(),
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
  .document("/comments/{commentID}")
  .onCreate(async (doc, context) => {
    const ventDoc = await admin
      .firestore()
      .collection("vents")
      .doc(doc.data().ventID)
      .get();

    if (!ventDoc.exists) return "Cannot find post.";

    const vent = combineObjectWithID(ventDoc.id, ventDoc.data());

    return createNotification(
      createVentLink(vent),
      "Your vent has a new comment!",
      vent.userID
    );
  });

exports.newPostListener = functions.firestore
  .document("/vents/{ventID}")
  .onCreate((doc, context) => {
    const vent = combineObjectWithID(doc.id, doc.data());

    return createNotification(
      createVentLink(vent),
      "Your new vent is live!",
      vent.userID
    );
  });

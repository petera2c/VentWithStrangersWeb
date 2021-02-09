import * as functions from "firebase-functions";
import firebase from "firebase/app";
import "firebase/database";
const admin = require("firebase-admin");
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

exports.newPostListener = functions.database
  .ref("/vents/")
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const vent = snapshot.val();
    console.log(vent);

    const db = firebase.database();
    let notificationsRef = db.ref("/notifications/" + vent.userID);

    const notificationsObject = {
      message: "Your new vent is live!",
      server_timestamp: { ".sv": "timestamp" },
    };
    console.log(notificationsObject);

    notificationsRef
      .set(notificationsObject)
      .then(() => {
        console.log("here");
      })
      .catch(error => console.log(error.message));

    return "hello world";
  });

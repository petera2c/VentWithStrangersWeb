import * as functions from "firebase-functions";
const admin = require("firebase-admin");
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

/*

export const test = () => {
  console.log("hfd");
};*/

exports.helloworld = functions.database
  .ref("/posts/")
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();
    console.log(original);
    //console.log("Uppercasing", context.params.pushId, original);
    //const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    //  return snapshot.ref.parent.child("uppercase").set(uppercase);
  });

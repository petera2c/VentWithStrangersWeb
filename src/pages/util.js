import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import db from "../config/firebase";

export const getIsUserSubscribed = async (setUserSubscription, userID) => {
  const userSubscriptionDoc = await db
    .collection("user_subscription")
    .doc(userID)
    .get();

  if (userSubscriptionDoc.exists && userSubscriptionDoc.data())
    setUserSubscription(userSubscriptionDoc.data());
};

export const setUserOnlineStatus = async (status, uid) => {
  await firebase
    .database()
    .ref("status/" + uid)
    .set({
      state: status,
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    });
  return;
};

export const setIsUserOnlineToDatabase = (user) => {
  if (!user) return;
  var uid = user.uid;

  var userStatusDatabaseRef = firebase.database().ref("status/" + uid);

  var isOfflineForDatabase = {
    state: "offline",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    state: "online",
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  firebase
    .database()
    .ref(".info/connected")
    .on("value", (snapshot) => {
      if (!snapshot.val()) {
        return;
      }

      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(() => {
          userStatusDatabaseRef.set(isOnlineForDatabase);
        });
    });
};

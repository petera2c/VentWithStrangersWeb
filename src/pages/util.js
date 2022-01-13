import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

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

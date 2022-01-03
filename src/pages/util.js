import firebase from "firebase/app";
import "firebase/auth";

export const setUserOnlineStatus = (status, uid) => {
  firebase
    .database()
    .ref("status/" + uid)
    .set({
      state: status,
      last_changed: firebase.database.ServerValue.TIMESTAMP
    });
};

export const setIsUserOnlineToDatabase = user => {
  if (!user) return;
  var uid = user.uid;

  var userStatusDatabaseRef = firebase.database().ref("status/" + uid);

  var isOfflineForDatabase = {
    state: "offline",
    last_changed: firebase.database.ServerValue.TIMESTAMP
  };

  var isOnlineForDatabase = {
    state: "online",
    last_changed: firebase.database.ServerValue.TIMESTAMP
  };

  firebase
    .database()
    .ref(".info/connected")
    .on("value", snapshot => {
      if (snapshot.val() == false) {
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

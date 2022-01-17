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

export const newRewardListener = (
  isMounted,
  setNewReward,
  userID,
  first = true
) => {
  const unsubscribe = db
    .collection("rewards")
    .where("userID", "==", userID)
    .orderBy("server_timestamp", "desc")
    .limit(1)
    .onSnapshot(
      (querySnapshot) => {
        if (first) {
          first = false;
        } else if (querySnapshot.docs && querySnapshot.docs[0] && isMounted()) {
          setNewReward(() => {
            return {
              id: querySnapshot.docs[0].id,
              ...querySnapshot.docs[0].data(),
            };
          });
        }
      },
      (err) => {}
    );
  return unsubscribe;
};

export const setUserOnlineStatus = async (status, uid) => {
  if (status === "online")
    await firebase
      .database()
      .ref("status/" + uid)
      .set({
        state: status,
        last_online: firebase.database.ServerValue.TIMESTAMP,
      });
  else
    await firebase
      .database()
      .ref("status/" + uid)
      .set(
        {
          state: status,
        },
        { merge: true }
      );
  return;
};

export const setIsUserOnlineToDatabase = (user) => {
  if (!user) return;
  var uid = user.uid;

  var userStatusDatabaseRef = firebase.database().ref("status/" + uid);

  var isOfflineForDatabase = {
    state: "offline",
    last_online: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    state: "online",
    last_online: firebase.database.ServerValue.TIMESTAMP,
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

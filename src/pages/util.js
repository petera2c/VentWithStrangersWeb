import firebase from "firebase/compat/app";
import { serverTimestamp } from "firebase/database";
import "firebase/compat/auth";
import "firebase/compat/database";
import db from "../config/firebase";
import moment from "moment-timezone";

export const getIsUsersBirthday = async (
  isMounted,
  setIsUsersBirthday,
  userID
) => {
  const userInfoDoc = await db.collection("users_info").doc(userID).get();

  if (
    userInfoDoc.data() &&
    userInfoDoc.data().birth_date &&
    new moment(userInfoDoc.data().birth_date).format("MMDD") ===
      new moment().format("MMDD") &&
    (!userInfoDoc.data().last_birthday ||
      new moment().diff(new moment(userInfoDoc.data().last_birthday), "days") >=
        365)
  ) {
    if (isMounted.current) setIsUsersBirthday(true);
    await db
      .collection("users_info")
      .doc(userInfoDoc.id)
      .update({ last_birthday: firebase.firestore.Timestamp.now().toMillis() });
  }
};

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
        } else if (
          querySnapshot.docs &&
          querySnapshot.docs[0] &&
          isMounted.current
        ) {
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
        last_online: serverTimestamp(),
        state: status,
      });
  else
    await firebase
      .database()
      .ref("status/" + uid)
      .update({
        last_online: serverTimestamp(),
        state: status,
      });
  return;
};

export const setIsUserOnlineToDatabase = (user) => {
  if (!user) return;
  var uid = user.uid;

  var userStatusDatabaseRef = firebase.database().ref("status/" + uid);

  var isOfflineForDatabase = {
    last_online: serverTimestamp(),
    state: "offline",
  };

  var isOnlineForDatabase = {
    last_online: serverTimestamp(),
    state: "online",
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
        .update(isOfflineForDatabase)
        .then(() => {
          userStatusDatabaseRef.update(isOnlineForDatabase);
        });
    });
};

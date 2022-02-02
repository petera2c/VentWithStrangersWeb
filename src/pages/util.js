import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { onValue, ref, serverTimestamp, set } from "firebase/database";
import { db, db2 } from "../config/db_init";
import moment from "moment-timezone";

export const getIsUsersBirthday = async (
  isMounted,
  setIsUsersBirthday,
  userID
) => {
  const userInfoDoc = await getDoc(doc(db, "users_info", userID));

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
    await updateDoc(doc(db, "users_info", userInfoDoc.id), {
      last_birthday: Timestamp.now().toMillis(),
    });
  }
};

export const getIsUserSubscribed = async (setUserSubscription, userID) => {
  const userSubscriptionDoc = await getDoc(
    doc(db, "user_subscription", userID)
  );

  if (userSubscriptionDoc.exists && userSubscriptionDoc.data())
    setUserSubscription(userSubscriptionDoc.data());
};

export const newRewardListener = (
  isMounted,
  setNewReward,
  userID,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "rewards"),
      where("userID", "==", userID),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
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
    }
  );

  return unsubscribe;
};

export const setUserOnlineStatus = async (status, uid) => {
  if (status === "online")
    await set(ref(db2, "status/" + uid), {
      last_online: serverTimestamp(),
      state: status,
    });
  else
    await set(ref(db2, "status/" + uid), {
      last_online: serverTimestamp(),
      state: status,
    });

  return;
};

export const setIsUserOnlineToDatabase = (user) => {
  if (!user) return;
  var uid = user.uid;

  var userStatusDatabaseRef = ref(db2, "status/", uid);

  var isOfflineForDatabase = {
    last_online: serverTimestamp(),
    state: "offline",
  };

  var isOnlineForDatabase = {
    last_online: serverTimestamp(),
    state: "online",
  };

  onValue(ref(db2, ".info/connected"), (snapshot) => {
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

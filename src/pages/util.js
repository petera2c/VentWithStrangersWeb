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
import {
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { db, db2 } from "../config/db_init";
import dayjs from "dayjs";

export const getIsUsersBirthday = async (
  isMounted,
  setIsUsersBirthday,
  userID
) => {
  const userInfoDoc = await getDoc(doc(db, "users_info", userID));

  if (
    userInfoDoc.data() &&
    userInfoDoc.data().birth_date &&
    new dayjs(userInfoDoc.data().birth_date).format("MMDD") ===
      new dayjs().format("MMDD") &&
    (!userInfoDoc.data().last_birthday ||
      new dayjs().diff(new dayjs(userInfoDoc.data().last_birthday), "day") >=
        365)
  ) {
    if (isMounted.current) setIsUsersBirthday(true);
    await updateDoc(doc(db, "users_info", userInfoDoc.id), {
      last_birthday: Timestamp.now().toMillis(),
    });
  }
};

export const getIsUserSubscribed = async (
  isMounted,
  setUserSubscription,
  userID
) => {
  const userSubscriptionDoc = await getDoc(
    doc(db, "user_subscription", userID)
  );

  if (userSubscriptionDoc.data() && isMounted.current)
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
      index: new dayjs().valueOf(),
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

export const setIsUserOnlineToDatabase = (uid) => {
  if (!uid) return;

  const connectedRef = ref(db2, ".info/connected");
  const userStatusDatabaseRef = ref(db2, "status/" + uid);

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      set(userStatusDatabaseRef, {
        index: new dayjs().valueOf(),
        last_online: serverTimestamp(),
        state: "online",
      });
      onDisconnect(userStatusDatabaseRef).set({
        last_online: serverTimestamp(),
        state: "offline",
      });
    }
  });
};

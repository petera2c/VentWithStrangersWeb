import firebase from "firebase/app";
import moment from "moment-timezone";
import db from "../../config/firebase";

export const calculateTimeToVentCounterReset = () => {
  const currentTime = new moment().tz("America/Los_Angeles");
  const nextVentCounterReset = new moment().tz("America/Los_Angeles");
  nextVentCounterReset.set("hour", 12);
  nextVentCounterReset.set("minutes", 0);
  nextVentCounterReset.set("seconds", 0);

  if (nextVentCounterReset.diff(currentTime) < 0) {
    nextVentCounterReset.add(1, "day");
  }
  nextVentCounterReset.tz(Intl.DateTimeFormat().resolvedOptions().timeZone);

  /* moment("2015-01-01")
  .startOf("day")
  .add(nextVentCounterReset.diff(currentTime) / 1000, "seconds")
  .format("H:mm:ss")*/

  return nextVentCounterReset.fromNow();
};

export const getHasUserPostedMoreThanTwiceToday = async (callback, userID) => {
  const userDailyVentCount = await db
    .collection("user_day_limit_vents")
    .doc(userID)
    .get();

  if (userDailyVentCount.exists && userDailyVentCount.data().vent_counter >= 2)
    callback(true);
  else callback(false);
};

export const getVent = async (setDescription, setTags, setTitle, ventID) => {
  const ventDoc = await db
    .collection("vents")
    .doc(ventID)
    .get();

  const vent = ventDoc.data();

  if (vent) {
    setDescription(vent.description);
    setTags(vent.tags);
    setTitle(vent.title);
  }
};

export const saveVent = async (callback, ventObject, ventID, user) => {
  if (!user) {
    return alert("You must be signed in to create a vent");
  }
  if (!ventID) {
    ventObject.server_timestamp =
      firebase.firestore.Timestamp.now().toMillis();
    ventObject.comment_counter = 0;
    ventObject.like_counter = 0;
  }
  ventObject.userID = user.uid;
  ventObject.last_updated = firebase.firestore.Timestamp.now().toMillis();

  let newVent = ventObject;
  if (ventID) {
    await db
      .collection("vents")
      .doc(ventID)
      .update(ventObject);
  } else newVent = await db.collection("vents").add(ventObject);
  callback({ id: newVent.id ? newVent.id : ventID, title: ventObject.title });
};

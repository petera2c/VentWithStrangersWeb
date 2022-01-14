const admin = require("firebase-admin");
const Webflow = require("webflow-api");
const moment = require("moment-timezone");
const { createNotification } = require("./notification");
const { calculateKarma, createVentLink } = require("./util");

const VENT_LIKE_TRENDING_SCORE_INCREMENT = 24;

const decreaseUserVentCounter = async () => {
  const usersSnapshot = await admin
    .firestore()
    .collection("user_day_limit_vents")
    .where("vent_counter", ">", 0)
    .get();

  for (let index in usersSnapshot.docs) {
    await admin
      .firestore()
      .collection("user_day_limit_vents")
      .doc(usersSnapshot.docs[index].id)
      .set({
        vent_counter: 0,
      });
  }
};

const decreaseTrendingScore = async () => {
  const trendingSnapshot = await admin
    .firestore()
    .collection("/vents/")
    .where("trending_score", ">", 0)
    .orderBy("trending_score", "desc")
    .get();

  for (let index in trendingSnapshot.docs) {
    const trendingVentDoc = trendingSnapshot.docs[index];
    const trendingVentDocData = trendingVentDoc.data();
    const increment = Math.round(trendingVentDocData.trending_score * 0.05) + 1;

    await admin
      .firestore()
      .collection("vents")
      .doc(trendingVentDoc.id)
      .update({
        trending_score: admin.firestore.FieldValue.increment(-increment),
      });
  }
};

const newVentListener = async (doc, context) => {
  const vent = { id: doc.id, ...doc.data() };

  if (vent.server_timestamp > admin.firestore.Timestamp.now().toMillis()) {
    vent.server_timestamp = admin.firestore.Timestamp.now().toMillis();
    await admin
      .firestore()
      .collection("vents")
      .doc(vent.id)
      .set(vent, { merge: true });
  }

  if (vent.userID) {
    await admin
      .firestore()
      .collection("vent_likes")
      .doc(vent.id + "|||" + vent.userID)
      .set({ liked: true, ventID: vent.id });

    const usersBasicInfoDoc = await admin
      .firestore()
      .collection("users_display_name")
      .doc(vent.userID)
      .get();

    let hoursTillNextVent = 5;
    const usersKarma = calculateKarma(usersBasicInfoDoc.data());

    if (usersKarma > 5000) hoursTillNextVent = 0;
    else if (usersKarma > 500) hoursTillNextVent = 1;
    else if (usersKarma > 250) hoursTillNextVent = 2;
    else if (usersKarma > 100) hoursTillNextVent = 3;
    else if (usersKarma > 50) hoursTillNextVent = 4;

    await admin
      .firestore()
      .collection("user_vent_timeout")
      .doc(vent.userID)
      .set({ value: new moment().add(hoursTillNextVent, "hours").format() });
  }

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(vent.userID)
    .get();

  if (userSettingsDoc.data() && userSettingsDoc.data().master_vent_new)
    return createNotification(
      userSettingsDoc.data().mobile_vent_new === true,
      userSettingsDoc.data().email_vent_new === true,
      createVentLink(vent),
      "Your new vent is live!",
      vent.userID
    );
};

const newVentLikeListener = async (change, context) => {
  const { ventIDuserID } = context.params;
  const ventIDuserIDArray = ventIDuserID.split("|||");

  const hasLiked = change.after.data() ? change.after.data().liked : false;
  let increment = 1;
  if (!hasLiked) increment = -1;

  await admin
    .firestore()
    .collection("vents")
    .doc(ventIDuserIDArray[0])
    .update({
      like_counter: admin.firestore.FieldValue.increment(increment),
      trending_score: admin.firestore.FieldValue.increment(
        hasLiked
          ? VENT_LIKE_TRENDING_SCORE_INCREMENT
          : -VENT_LIKE_TRENDING_SCORE_INCREMENT
      ),
    });

  if (change.before.data()) return;

  const ventDoc = await admin
    .firestore()
    .collection("vents")
    .doc(ventIDuserIDArray[0])
    .get();

  // If user liked their own vent do not notify or give karma
  if (ventDoc.data().userID == ventIDuserIDArray[1]) return;

  // Give +2 to the user that received the upvote
  if (ventDoc.data().userID)
    await admin
      .firestore()
      .collection("users_display_name")
      .doc(ventDoc.data().userID)
      .set(
        {
          good_karma: admin.firestore.FieldValue.increment(2),
        },
        { merge: true }
      );

  const vent = { id: ventDoc.id, ...ventDoc.data() };

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(comment.userID)
    .get();

  if (userSettingsDoc.data() && userSettingsDoc.data().master_vent_like)
    createNotification(
      userSettingsDoc.data().mobile_vent_like === true,
      userSettingsDoc.data().email_vent_like === true,
      createVentLink(vent),
      "Someone has supported your vent! +2 Karma Points",
      vent.userID
    );
};

const newVentReportListener = async (doc, context) => {
  const ventID = doc.id.split("|||")[0];
  const userID = doc.id.split("|||")[1];

  await admin
    .firestore()
    .collection("vents")
    .doc(ventID)
    .update({
      report_counter: admin.firestore.FieldValue.increment(1),
    });

  const ventDoc = await admin.firestore().collection("vents").doc(ventID).get();

  await admin
    .firestore()
    .collection("users_display_name")
    .doc(ventDoc.data().userID)
    .set(
      {
        bad_karma: admin.firestore.FieldValue.increment(2),
      },
      { merge: true }
    );

  await admin.firestore().collection("admin_notifications").add({
    ventID,
    user_that_reported: userID,
  });
};

const ventDeleteListener = async (doc, context) => {
  const ventID = doc.id;
  const commentsOfVentSnapshot = await admin
    .firestore()
    .collection("comments")
    .where("ventID", "==", ventID)
    .get();

  if (commentsOfVentSnapshot.docs) {
    for (let index in commentsOfVentSnapshot.docs) {
      admin
        .firestore()
        .collection("comments")
        .doc(commentsOfVentSnapshot.docs[index].id)
        .delete();
    }
  }

  const ventLikesSnapshot = await admin
    .firestore()
    .collection("vent_likes")
    .where("ventID", "==", ventID)
    .get();

  if (ventLikesSnapshot.docs)
    for (let index in ventLikesSnapshot.docs) {
      admin
        .firestore()
        .collection("vent_likes")
        .doc(ventLikesSnapshot.docs[index].id)
        .delete();
    }
};

module.exports = {
  decreaseTrendingScore,
  decreaseUserVentCounter,
  newVentLikeListener,
  newVentListener,
  newVentReportListener,
  ventDeleteListener,
};

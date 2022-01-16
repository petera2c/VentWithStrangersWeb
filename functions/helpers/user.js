const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const { createProfileLink } = require("./util");

const newUserSetup = async (user) => {
  await admin.firestore().collection("user_rewards").doc(user.uid).set({
    created_comment_support_counter: 0,
    created_comments_counter: 0,
    created_vent_supports: 0,
    created_vents_counter: 0,
    received_comment_support_counter: 0,
    received_vent_support_counter: 0,
  });
  await admin
    .firestore()
    .collection("invite_uid")
    .add({ primary_uid: user.uid });
};

const userWasInvited = async (doc, context) => {
  // Check we have all information that we need
  if (!doc.exists) return;

  let userIDThatGotInvited = doc.id;

  if (!userIDThatGotInvited) return;
  if (!doc.data() || !doc.data().referral_secondary_uid) return;

  const getPrimaryuidDoc = await admin
    .firestore()
    .collection("invite_uid")
    .doc(doc.data().referral_secondary_uid)
    .get();

  let userIDThatInvited;
  if (getPrimaryuidDoc.data() && getPrimaryuidDoc.data().primary_uid)
    userIDThatInvited = getPrimaryuidDoc.data().primary_uid;

  if (!userIDThatInvited) return;

  // We now have both primary uids

  // Give user karma
  await admin
    .firestore()
    .collection("users_display_name")
    .doc(userIDThatInvited)
    .set(
      {
        good_karma: admin.firestore.FieldValue.increment(50),
      },
      { merge: true }
    );

  // Make notification
  createNotification(
    true,
    true,
    undefined,
    "Someone signed up from your link! +50 Karma",
    userIDThatInvited
  );
  return;
};

module.exports = {
  newUserSetup,
  userWasInvited,
};

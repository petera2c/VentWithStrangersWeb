const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const { createRewardsLink } = require("./util");

const newUserSetup = async (user) => {
  await admin.firestore().collection("user_rewards").doc(user.uid).set({
    created_comment_supports_counter: 0,
    created_comments_counter: 0,
    created_vent_supports_counter: 0,
    created_vents_counter: 0,
    received_comment_supports_counter: 0,
    received_vent_supports_counter: 0,
  });

  await admin
    .firestore()
    .collection("invite_uid")
    .add({ primary_uid: user.uid });
};

const createMilestone = async (reward, title, userID) => {
  await admin
    .firestore()
    .collection("users_display_name")
    .doc(userID)
    .set(
      {
        karma: admin.firestore.FieldValue.increment(reward),
      },
      { merge: true }
    );

  const stringTitle = await admin.firestore().collection("rewards").add({
    karma_gained: reward,
    server_timestamp: admin.firestore.Timestamp.now().toMillis(),
    title,
    userID,
  });

  /*
  createNotification(
    true,
    true,
    createRewardsLink(),
    title + " +" + reward + " Karma Points",
    userID
  );*/
};

const checkIfCanCreateMilestone = async (
  counter,
  size,
  title,
  secondTitle,
  userID
) => {
  let reward;
  let first;
  if (size === "small") {
    if (counter === 500) {
      reward = 2500;
    } else if (counter === 250) {
      reward = 1250;
    } else if (counter === 100) {
      reward = 500;
    } else if (counter === 50) {
      reward = 250;
    } else if (counter === 25) {
      reward = 125;
    } else if (counter === 10) {
      reward = 50;
    } else if (counter === 1) {
      reward = 5;
      first = true;
    }
  } else if (size === "medium") {
    if (counter === 5000) {
      reward = 1000;
    } else if (counter === 2000) {
      reward = 400;
    } else if (counter === 1000) {
      reward = 200;
    } else if (counter === 500) {
      reward = 100;
    } else if (counter === 250) {
      reward = 50;
    } else if (counter === 100) {
      reward = 20;
    } else if (counter === 50) {
      reward = 10;
    } else if (counter === 10) {
      reward = 5;
    }
  }

  if (reward) {
    createMilestone(reward, first ? secondTitle : title(counter), userID);
  }
};

const userRewardsListener = async (change, context) => {
  const { userID } = context.params;
  const afterUserRewards = { id: change.after.id, ...change.after.data() };
  const beforeUserRewards = { id: change.before.id, ...change.before.data() };

  if (afterUserRewards && beforeUserRewards) {
    if (
      afterUserRewards.created_comment_supports_counter !==
      beforeUserRewards.created_comment_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_comment_supports_counter,
        "medium",
        (number) => "You have supported " + number + " comments!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_comments_counter !==
      beforeUserRewards.created_comments_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_comments_counter,
        "small",
        (number) => "You have created " + number + " comments!",
        "You have created your first comment!!!",
        userID
      );
    if (
      afterUserRewards.created_vent_supports_counter !==
      beforeUserRewards.created_vent_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_vent_supports_counter,
        "medium",
        (number) => "You have supported " + number + " vents!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_vents_counter !==
      beforeUserRewards.created_vents_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_vents_counter,
        "small",
        (number) => "You have created " + number + " vents!",
        "You have created your first vent!!!",
        userID
      );
    if (
      afterUserRewards.received_comment_supports_counter !==
      beforeUserRewards.received_comment_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.received_comment_supports_counter,
        "medium",
        (number) => "Your comments have received " + number + " supports!",
        undefined,
        userID
      );
    if (
      afterUserRewards.received_vent_supports_counter !==
      beforeUserRewards.received_vent_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.received_vent_supports_counter,
        "medium",
        (number) => "Your vents have received " + number + " supports!",
        undefined,
        userID
      );
  }
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
        karma: admin.firestore.FieldValue.increment(50),
      },
      { merge: true }
    );

  // Make notification
  createNotification(
    true,
    true,
    "",
    "Someone signed up from your link! +50 Karma",
    userIDThatInvited
  );
  return;
};

module.exports = {
  newUserSetup,
  userRewardsListener,
  userWasInvited,
};

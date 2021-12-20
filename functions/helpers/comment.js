const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const { createVentLink } = require("./util");

const COMMENT_LIKE_TRENDING_SCORE_INCREMENT = 24;

const deleteAllCommentLikesAndSubtractCommentCounter = async (doc, context) => {
  const commentID = doc.id;

  const commentLikesSnapshot = await admin
    .firestore()
    .collection("comment_likes")
    .where("commentID", "==", commentID)
    .get();

  if (commentLikesSnapshot.docs)
    for (let index in commentLikesSnapshot.docs) {
      admin
        .firestore()
        .collection("comment_likes")
        .doc(commentLikesSnapshot.docs[index].id)
        .delete();
    }

  if (doc.data() && doc.data().ventID)
    admin
      .firestore()
      .collection("vents")
      .doc(doc.data().ventID)
      .update({
        comment_counter: admin.firestore.FieldValue.increment(-1),
        trending_score: admin.firestore.FieldValue.increment(
          -COMMENT_LIKE_TRENDING_SCORE_INCREMENT
        ),
      });
};

const commentLikeListener = async (change, context) => {
  const { commentIDUserID } = context.params;
  const commentIDuserIDArray = commentIDUserID.split("|||");

  const hasLiked = change.after.data() ? change.after.data().liked : false;
  let increment = 1;
  if (!hasLiked) increment = -1;

  await admin
    .firestore()
    .collection("comments")
    .doc(commentIDuserIDArray[0])
    .update({
      like_counter: admin.firestore.FieldValue.increment(increment),
    });

  if (change.before.data()) return;

  const commentDoc = await admin
    .firestore()
    .collection("comments")
    .doc(commentIDuserIDArray[0])
    .get();

  const comment = commentDoc.data();

  // If user liked their own comment do not notify or give karma
  if (comment.userID == commentIDuserIDArray[1]) return;

  // Give +4 to the user that made the comment
  if (comment.userID)
    await admin
      .firestore()
      .collection("users_display_name")
      .doc(comment.userID)
      .set(
        {
          good_karma: admin.firestore.FieldValue.increment(4),
        },
        { merge: true }
      );

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(comment.userID)
    .get();

  if (userSettingsDoc.data() && userSettingsDoc.data().master_comment_like) {
    const ventDoc = await admin
      .firestore()
      .collection("vents")
      .doc(comment.ventID)
      .get();

    if (ventDoc.exists)
      createNotification(
        userSettingsDoc.data().mobile_comment_like === true,
        userSettingsDoc.data().email_comment_like === true,
        createVentLink({ id: ventDoc.id, ...ventDoc.data() }),
        "Someone has supported your comment! +4 Karma Points",
        comment.userID
      );
  }
};

const createNewCommentNotification = async (doc, context) => {
  const ventDoc = await admin
    .firestore()
    .collection("vents")
    .doc(doc.data().ventID)
    .get();

  if (!ventDoc.exists) return "Cannot find post.";

  const vent = { id: ventDoc.id, ...ventDoc.data() };

  if (vent.userID == doc.data().userID) return;

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(vent.userID)
    .get();

  if (userSettingsDoc.data() && userSettingsDoc.data().master_vent_commented) {
    return createNotification(
      userSettingsDoc.data().mobile_vent_commented === true,
      userSettingsDoc.data().email_vent_commented === true,
      createVentLink(vent),
      "Your vent has a new comment!",
      vent.userID
    );
  }
};

const createNotificationsToAnyTaggedUsers = async (doc, context) => {
  const commentText = doc.data().text;

  if (!commentText) return;
  const regexFull = /@\[[\x21-\x5A|\x61-\x7A|\x5f]+\]\([\x21-\x5A|\x61-\x7A]+\)/gi;
  const regexFindID = /\([\x21-\x5A|\x61-\x7A]+\)/gi;
  const tags = commentText.match(regexFull) || [];

  let listOfTaggedIDs = [];

  commentText.replace(regexFull, (possibleTag, index) => {
    const displayNameArray = possibleTag.match(regexFindID);

    if (displayNameArray && displayNameArray[0]) {
      let displayTag = displayNameArray[0];

      if (displayTag) displayTag = displayTag.slice(1, displayTag.length - 1);

      listOfTaggedIDs.push(displayTag);
      return displayNameArray[0];
    } else return possibleTag;
  });

  if (listOfTaggedIDs && listOfTaggedIDs.length > 0) {
    const ventDoc = await admin
      .firestore()
      .collection("vents")
      .doc(doc.data().ventID)
      .get();

    if (!ventDoc.exists) return "Cannot find post.";

    const vent = { id: ventDoc.id, ...ventDoc.data() };

    for (let index in listOfTaggedIDs) {
      const userSettingsDoc = await admin
        .firestore()
        .collection("users_settings")
        .doc(listOfTaggedIDs[index])
        .get();

      if (
        userSettingsDoc.data() &&
        userSettingsDoc.data().master_comment_tagged
      ) {
        createNotification(
          userSettingsDoc.data().mobile_comment_tagged === true,
          userSettingsDoc.data().email_comment_tagged === true,
          createVentLink(vent),
          "You have been tagged in a comment!",
          listOfTaggedIDs[index]
        );
      }
    }
  }
};

const commentUpdateListener = async (change, context) => {
  if (!change.after.data()) {
    deleteAllCommentLikesAndSubtractCommentCounter(change.before, context);
  } else if (!change.before.data()) {
    createNotificationsToAnyTaggedUsers(change.after, context);
    createNewCommentNotification(change.after, context);

    let comment = { ...change.after.data() };

    if (
      comment.server_timestamp >
      admin.firestore.Timestamp.now().toMillis()
    ) {
      comment.server_timestamp = admin.firestore.Timestamp.now().toMillis();
      await admin
        .firestore()
        .collection("comments")
        .doc(change.after.id)
        .set(comment, { merge: true });
    }

    await admin
      .firestore()
      .collection("vents")
      .doc(change.after.data().ventID)
      .update({
        comment_counter: admin.firestore.FieldValue.increment(1),
        trending_score: admin.firestore.FieldValue.increment(
          COMMENT_LIKE_TRENDING_SCORE_INCREMENT
        ),
      });
  } else {
  }
};

const newCommentReportListener = async (doc, context) => {
  const commentID = doc.id.split("|||")[0];
  const userID = doc.id.split("|||")[1];

  await admin
    .firestore()
    .collection("comments")
    .doc(commentID)
    .update({
      report_counter: admin.firestore.FieldValue.increment(1),
    });

  const commentDoc = await admin
    .firestore()
    .collection("comments")
    .doc(commentID)
    .get();

  await admin
    .firestore()
    .collection("users_display_name")
    .doc(commentDoc.data().userID)
    .set(
      {
        bad_karma: admin.firestore.FieldValue.increment(10),
      },
      { merge: true }
    );

  await admin
    .firestore()
    .collection("admin_notifications")
    .add({
      ventID: doc.data().ventID,
      commentID,
      user_that_reported: userID,
    });
};

module.exports = {
  commentLikeListener,
  commentUpdateListener,
  newCommentReportListener,
};

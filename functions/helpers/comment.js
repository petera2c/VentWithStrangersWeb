const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const { createVentLink } = require("./util");

const deleteAllCommentLikes = async (doc, context) => {
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
};

const createNewCommentNotification = async (doc, context) => {
  const ventDoc = await admin
    .firestore()
    .collection("vents")
    .doc(doc.data().ventID)
    .get();

  if (!ventDoc.exists) return "Cannot find post.";

  const vent = { id: ventDoc.id, ...ventDoc.data() };

  return createNotification(
    createVentLink(vent),
    "Your vent has a new comment!",
    vent.userID
  );
};

const createNotificationsToAnyTaggedUsers = async (doc, context) => {
  const commentText = doc.data().text;

  if (!commentText) return;
  const regexFull = /@\{\{\[\[\[[\x21-\x5A|\x61-\x7A]+\]\]\]\|\|\[\[\[[\x21-\x5A|\x61-\x7A|\x5f]+\]\]\]\}\}/gi;
  const regexFindID = /@\{\{\[\[\[[\x21-\x5A|\x61-\x7A]+\]\]\]\|\|\[\[\[/gi;
  const tags = commentText.match(regexFull) || [];

  let listOfTaggedIDs = [];

  commentText.replace(regexFull, (possibleTag, index) => {
    const displayNameArray = possibleTag.match(regexFindID);

    if (displayNameArray && displayNameArray[0]) {
      let displayTag = displayNameArray[0];

      if (displayTag) displayTag = displayTag.slice(6, displayTag.length - 8);

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

    for (let index in listOfTaggedIDs)
      createNotification(
        createVentLink(vent),
        "You have been tagged in a comment!",
        listOfTaggedIDs[index]
      );
  }
};

const commentUpdateListener = async (change, context) => {
  if (!change.after.data()) {
    deleteAllCommentLikes(change.before, context);
  } else if (!change.before.data()) {
    createNotificationsToAnyTaggedUsers(change.after, context);
    createNewCommentNotification(change.after, context);
  } else {
  }
};

module.exports = {
  commentLikeListener,
  commentUpdateListener,
};

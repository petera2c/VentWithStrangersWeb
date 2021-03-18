const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const { createVentLink } = require("./util");

const commentDeleteListener = async (doc, context) => {
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
  if (!change.after.data()) return "";
  const { commentIDUserID } = context.params;
  const commentIDuserIDArray = commentIDUserID.split("|||");
  const hasLiked = change.after.data() ? change.after.data().liked : false;
  let increment = 1;
  if (!hasLiked) increment = -1;

  var docRef = admin
    .firestore()
    .collection("comments")
    .doc(commentIDuserIDArray[0]);

  docRef.update({
    like_counter: admin.firestore.FieldValue.increment(increment),
  });
};

const newCommentListener = async (doc, context) => {
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
module.exports = {
  commentDeleteListener,
  commentLikeListener,
  newCommentListener,
};

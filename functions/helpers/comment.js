const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const { createVentLink } = require("./util");

const commentLikeListener = async (doc, context) => {
  const { commentIDUserID } = context.params;
  const commentIDuserIDArray = commentIDUserID.split("|||");
  const hasLiked = doc.after.data().liked;
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
module.exports = { commentLikeListener, newCommentListener };

import React from "react";
import firebase from "firebase/app";
import db from "../../config/firebase";

export const commentListener = (commentID, setComment, ventID) => {
  const unsubscribe = db
    .collection("comments")
    .doc(commentID)
    .onSnapshot("value", async doc => {
      const comment = doc.data();

      const authorDoc = await db
        .collection("users_display_name")
        .doc(comment.userID)
        .get();

      let author = "";

      if (authorDoc.exists && authorDoc.data().displayName)
        author = authorDoc.data().displayName;

      if (comment)
        setComment({ id: doc.id, ...comment, author, authorID: authorDoc.id });
    });

  return unsubscribe;
};
export const deleteComment = commentID => {};

export const editComment = (commentID, commentString) => {};

export const likeOrUnlikeComment = async (comment, hasLiked, user, ventID) => {
  if (!user)
    return alert(
      "You must sign in or register an account to support a comment!"
    );

  await db
    .collection("comment_likes")
    .doc(comment.id + user.uid)
    .set({ liked: !hasLiked });

  let valueToIncreaseBy = 1;
  if (hasLiked) valueToIncreaseBy = -1;

  await db
    .collection("comments")
    .doc(comment.id)
    .update({
      like_counter: firebase.firestore.FieldValue.increment(valueToIncreaseBy)
    });
};

export const commentHasLikedListener = (commentID, setHasLiked, userID) => {
  const unsubscribe = db
    .collection("comment_likes")
    .doc(commentID + userID)
    .onSnapshot("value", snapshot => {
      if (!snapshot) return;
      let value = snapshot.data();
      if (value) value = value.liked;

      setHasLiked(Boolean(value));
    });

  return unsubscribe;
};

export const swapTags = commentText => {
  if (!commentText) return;
  const regexFull = /@\{\{\[\[\[[\x21-\x5A|\x61-\x7A]+\]\]\]\|\|\[\[\[[\x21-\x5A|\x61-\x7A|\x5f]+\]\]\]\}\}/gi;
  //const regexID = /(?<=@\{\{\[\[\[)[\x21-\x5A|\x61-\x7A]+(?=\]\]\]\|\|)/gi;
  //const regexDisplay = /(?<=\|\|\[\[\[)[\x21-\x5A|\x61-\x7A]+(?=\]\]\]\}\})/gi;
  const regexDisplay = /\|\|\[\[\[[\x21-\x5A|\x61-\x7A|\x5f]+\]\]\]\}\}/gi;
  const tags = commentText.match(regexFull) || [];

  let something = [];

  commentText.replace(regexFull, (possibleTag, index) => {
    const displayNameArray = possibleTag.match(regexDisplay);

    if (displayNameArray && displayNameArray[0]) {
      let displayTag = displayNameArray[0];
      if (displayTag) displayTag = displayTag.slice(5, displayTag.length - 5);

      something.push({
        start: index,
        end: possibleTag.length + index,
        value: displayTag
      });
      return displayNameArray[0];
    } else return possibleTag;
  });

  if (something.length === 0) return commentText;
  else {
    return [
      ...something.map((obj, index) => {
        if (index === 0) {
          return [
            commentText.slice(0, obj.start),
            <span className="mentions__mention" key={index}>
              {obj.value}
            </span>
          ];
        } else {
          return [
            commentText.slice(something[index - 1].end, obj.start),
            <span className="mentions__mention" key={index}>
              {obj.value}
            </span>
          ];
        }
      }),
      commentText.slice(something[something.length - 1].end, commentText.length)
    ];
  }
};

import React from "react";
import firebase from "firebase/app";
import db from "../../config/firebase";

export const getComment = async (commentID, setComment, ventID) => {
  const doc = db
    .collection("comments")
    .doc(commentID)
    .get();
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
};
export const deleteComment = commentID => {};

export const editComment = (commentID, commentString) => {};

export const likeOrUnlikeComment = async (comment, hasLiked, user, ventID) => {
  await db
    .collection("comment_likes")
    .doc(comment.id + "|||" + user.uid)
    .set({ liked: !hasLiked });
};

export const getCommentHasLiked = async (commentID, setHasLiked, userID) => {
  const snapshot = await db
    .collection("comment_likes")
    .doc(commentID + "|||" + userID)
    .get();

  if (!snapshot || !snapshot.data()) return;
  let value = snapshot.data();
  value = value.liked;
  setHasLiked(Boolean(value));
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

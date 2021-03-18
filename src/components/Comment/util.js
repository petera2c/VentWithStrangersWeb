import React from "react";
import firebase from "firebase/app";
import db from "../../config/firebase";

export const getAuthor = async (setAuthor, userID) => {
  const authorDoc = await db
    .collection("users_display_name")
    .doc(userID)
    .get();

  let author = "";

  if (authorDoc.exists && authorDoc.data().displayName) {
    author = authorDoc.data().displayName;
    setAuthor(author);
  }
};

export const getComment = async (commentID, setComment, ventID) => {
  const doc = await db
    .collection("comments")
    .doc(commentID)
    .get();
  const comment = doc.data();

  if (comment) setComment({ id: doc.id, ...comment });
};
export const deleteComment = async (commentID, setComments) => {
  let res = await db
    .collection("comments")
    .doc(commentID)
    .delete();

  if (setComments)
    setComments(comments => {
      comments.splice(
        comments.findIndex(comment => comment.id === commentID),
        1
      );
      return [...comments];
    });
  alert("Comment deleted!");
};

export const editComment = (commentID, commentString) => {};

export const likeOrUnlikeComment = async (comment, hasLiked, user, ventID) => {
  await db
    .collection("comment_likes")
    .doc(comment.id + "|||" + user.uid)
    .set({ liked: !hasLiked, commentID: comment.id });
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

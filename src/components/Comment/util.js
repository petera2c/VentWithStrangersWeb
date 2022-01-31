import React from "react";
import firebase from "firebase/compat/app";
import { message } from "antd";
import db from "../../config/firebase";

export const getComment = async (commentID, setComment, ventID) => {
  const doc = await db.collection("comments").doc(commentID).get();
  const comment = doc.data();

  if (comment) setComment({ id: doc.id, ...comment });
};
export const deleteComment = async (commentID, setComments) => {
  await db.collection("comments").doc(commentID).delete();

  if (setComments)
    setComments((comments) => {
      comments.splice(
        comments.findIndex((comment) => comment.id === commentID),
        1
      );
      return [...comments];
    });
  message.success("Comment deleted!");
};

export const editComment = async (commentID, commentString, setComments) => {
  await db.collection("comments").doc(commentID).set(
    {
      text: commentString,
      last_updated: firebase.firestore.Timestamp.now().toMillis(),
    },
    { merge: true }
  );

  setComments((comments) => {
    const commentIndex = comments.findIndex(
      (comment) => comment.id === commentID
    );
    comments[commentIndex].text = commentString;
    return [...comments];
  });
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

export const likeOrUnlikeComment = async (comment, hasLiked, user) => {
  if (!user)
    return message.info(
      "You must sign in or register an account to support a comment!"
    );

  await db
    .collection("comment_likes")
    .doc(comment.id + "|||" + user.uid)
    .set({ liked: !hasLiked, commentID: comment.id, userID: user.uid });
};

export const reportComment = async (commentID, option, userID, ventID) => {
  await db
    .collection("comment_reports")
    .doc(commentID + "|||" + userID)
    .set({ commentID, option, userID, ventID });

  message.success("Report successful :)");
};

export const swapTags = (commentText) => {
  if (!commentText) return;
  const regexFull = /@\[[\x21-\x5A|\x61-\x7A|\x5f]+\]\([\x21-\x5A|\x61-\x7A]+\)/gi;
  const regexDisplay = /\[[\x21-\x5A|\x61-\x7A|\x5f]+\]/gi;

  let listOfTaggedDisplayNames = [];

  commentText.replace(regexFull, (possibleTag, index) => {
    const displayNameArray = possibleTag.match(regexDisplay);

    if (displayNameArray && displayNameArray[0]) {
      let displayTag = displayNameArray[0];
      if (displayTag)
        displayTag = "@" + displayTag.slice(1, displayTag.length - 1);

      listOfTaggedDisplayNames.push({
        start: index,
        end: possibleTag.length + index,
        value: displayTag,
      });
      return displayNameArray[0];
    } else return possibleTag;
  });

  if (listOfTaggedDisplayNames.length === 0) return commentText;
  else {
    return [
      ...listOfTaggedDisplayNames.map((obj, index) => {
        if (index === 0) {
          return [
            commentText.slice(0, obj.start),
            <span className="mentions__mention" key={index}>
              {obj.value}
            </span>,
          ];
        } else {
          return [
            commentText.slice(
              listOfTaggedDisplayNames[index - 1].end,
              obj.start
            ),
            <span className="mentions__mention" key={index}>
              {obj.value}
            </span>,
          ];
        }
      }),
      commentText.slice(
        listOfTaggedDisplayNames[listOfTaggedDisplayNames.length - 1].end,
        commentText.length
      ),
    ];
  }
};

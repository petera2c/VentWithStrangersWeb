import React from "react";

import firebase from "firebase/app";
import "firebase/database";

export const commentListener = (commentID, setComment, ventID) => {
  const db = firebase.database();

  const commentRef = db.ref("/comments/" + ventID + "/" + commentID);

  const listener = commentRef.on("value", snapshot => {
    if (!snapshot) return;
    const value = snapshot.val();
    const exists = snapshot.exists();

    if (exists) setComment({ id: snapshot.key, ...value });
    else setComment(false);
  });

  return () => commentRef.off("value", listener);
};
export const deleteComment = commentID => {};

export const editComment = (commentID, commentString) => {};

export const likeComment = (commentID, user) => {};

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

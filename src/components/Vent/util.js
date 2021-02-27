import db from "../../config/firebase";
import firebase from "firebase/app";

import { getEndAtValueTimestamp } from "../../util";

export const commentVent = async (commentString, user, ventID) => {
  if (!user) return alert("Only users can comment! Please login or register.");
  let commentObj = {
    likeCounter: 0,
    server_timestamp: firebase.firestore.Timestamp.now().seconds * 1000,
    text: commentString,
    userID: user.uid,
    ventID
  };
  const res = await db
    .collection("vent_data")
    .doc(ventID)
    .collection("comments")
    .add(commentObj);

  if (res.id)
    db.collection("vents")
      .doc(ventID)
      .update({ commentCounter: firebase.firestore.FieldValue.increment(1) });
};

export const deleteVent = (
  history,
  isOnSingleVentPage,
  removeVent,
  socket,
  ventID,
  ventIndex
) => {};

export const findPossibleUsersToTag = (
  callback,
  currentTypingWord,
  socket,
  ventID,
  callback2
) => {
  let isTag;

  if (currentTypingWord) {
    socket.emit(
      "find_relevant_users_to_tag",
      { currentTypingTag: currentTypingWord, ventID },
      resultObj => {
        const { users } = resultObj;

        if (users)
          callback2(
            users.map((user, index) => {
              return { id: user._id, display: user.displayName };
            })
          );

        callback({ possibleUsersToTag: users });
      }
    );
  } else {
    callback({ possibleUsersToTag: undefined });
  }
};

export const getCurrentTypingIndex = element => {
  // Taken from stack overflow
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
};

const getCurrentTypingWord = (currentTypingIndex, fullString) => {
  let currentTypingWord = "";
  let distanceToLeft = 0;
  let distanceToRight = 0;

  // Get all chars in word to left of where user is typing
  for (let i = currentTypingIndex - 1; i >= 0; i--) {
    if (fullString[i] === " ") break;
    distanceToLeft++;

    if (currentTypingWord)
      currentTypingWord = fullString[i] + currentTypingWord;
    else currentTypingWord = fullString[i];
  }

  // Get all chars in word to right of where user is typing
  for (let i = currentTypingIndex; i < fullString.length; i++) {
    if (fullString[i] === " ") break;
    distanceToRight++;

    if (currentTypingWord)
      currentTypingWord = currentTypingWord + fullString[i];
    else currentTypingWord = fullString[i];
  }

  return { currentTypingWord, distanceToLeft, distanceToRight };
};

export const getVentDescription = (previewMode, vent) => {
  let description = vent.description;
  if (previewMode && description.length > 240)
    description = description.slice(0, 240) + "... Read More";
  return description;
};

export const getVentFullLink = vent => {
  const partialLink =
    "/problem/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase();
  return "https://www.ventwithstrangers.com" + partialLink;
};

export const getVentPartialLink = vent => {
  return (
    "/problem/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase()
  );
};

export const newVentCommentListener = (setComments, ventID, first = true) => {
  const query = db
    .collection("vent_data")
    .doc(ventID)
    .collection("comments")
    .orderBy("server_timestamp", "desc")
    .startAt(10000000000000000)
    .limit(1)
    .onSnapshot(
      querySnapshot => {
        if (first) {
          first = false;
        } else if (querySnapshot.docs && querySnapshot.docs[0]) {
          setComments(oldComments => [
            {
              ...querySnapshot.docs[0].data(),
              id: querySnapshot.docs[0].id,
              doc: querySnapshot.docs[0]
            },
            ...oldComments
          ]);
        }
      },
      err => {}
    );
  return () => {
    query();
  };
};

export const getVentComments = async (comments, setComments, ventID) => {
  const startAt = getEndAtValueTimestamp(comments);

  const snapshot = await db
    .collection("vent_data")
    .doc(ventID)
    .collection("comments")
    .orderBy("server_timestamp", "desc")
    .startAfter(startAt)
    .limit(10)
    .get();

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newComments = [];
    snapshot.docs.forEach((doc, index) => {
      newComments.push({ ...doc.data(), id: doc.id, doc });
    });

    setComments(oldComments => {
      if (oldComments) return [...oldComments, ...newComments];
      else return newComments;
    });
  }
};

export const ventHasLikedListener = (setHasLiked, userID, ventID) => {
  return;
  const postLikedRef = db.ref("post_likes/" + ventID + "/" + userID);
  const listener = postLikedRef.on("value", snapshot => {
    if (!snapshot) return;
    const value = snapshot.val();

    setHasLiked(value);
  });

  return () => postLikedRef.off("value", listener);
};

export const ventListener = (setVent, ventID) => {
  const ventRef = db.collection("vents").doc(ventID);

  const listener = ventRef.onSnapshot("value", snapshot => {
    if (!snapshot) return;
    const vent = snapshot.data();

    if (vent) setVent({ id: ventID, ...vent });
    else setVent(false);
  });

  return () => listener();
};

export const likeOrUnlikeVent = async (user, vent) => {
  if (!user)
    return alert("You must sign in or register an account to support a vent!");

  const postLikedRef = db
    .collection("post_likes")
    .doc(vent.id)
    .doc(user.uid);
  const postCounterRef = db
    .collection("vents")
    .doc(vent.id)
    .doc("likeCounter");

  const value = postLikedRef.get();

  if (!value) return;
  const value2 = postCounterRef.get();

  postLikedRef.once("value", snapshot => {
    const value = snapshot.val();
    const exists = snapshot.exists();

    postCounterRef.once("value", snapshot => {
      if (!snapshot) return;

      const value2 = snapshot.val();
      const exists = snapshot.exists();

      let valueToUpdateBy = 1;

      if (value) valueToUpdateBy = -1;

      if (!value2) postCounterRef.set(1);
      else postCounterRef.set(value + valueToUpdateBy);
    });

    if (!value) {
      postLikedRef.set(true);
    } else {
      postLikedRef.set(null);
    }
  });
};

export const reportVent = () => {};

export const tagUser = (
  callback,
  commentString,
  currentTypingIndex,
  taggedUsers,
  user
) => {
  if (!callback || !commentString || !currentTypingIndex || !user) return;

  const { distanceToLeft, distanceToRight } = getCurrentTypingWord(
    currentTypingIndex,
    commentString
  );

  let firstBitOfComment = commentString.substring(
    0,
    currentTypingIndex - distanceToLeft
  );
  let secondBitOfComment = commentString.substring(
    currentTypingIndex + distanceToRight,
    commentString.length
  );

  const taggedUser = {
    display: user._id,
    id: user._id
  };

  taggedUsers.push(taggedUser);

  return callback({
    commentString,
    possibleUsersToTag: undefined,
    taggedUsers
  });
};

export const startMessage = async (history, userID, ventUserID) => {
  const sortedMemberIDs = [userID, ventUserID].sort();
  const conversationQuerySnapshot = await db
    .collection("conversations")
    .where("members", "==", sortedMemberIDs)
    .get();

  const goToPage = conversationID => {
    history.push("/conversations?" + conversationID);
  };

  if (!conversationQuerySnapshot.empty) {
    conversationQuerySnapshot.forEach((conversationDoc, i) => {
      goToPage(conversationDoc.id);
    });
  } else {
    const conversationDocNew = await db.collection("conversations").add({
      lastUpdated: firebase.firestore.Timestamp.now().seconds * 1000,
      members: sortedMemberIDs,
      server_timestamp: firebase.firestore.Timestamp.now().seconds * 1000
    });
    goToPage(conversationDocNew.id);
  }
};

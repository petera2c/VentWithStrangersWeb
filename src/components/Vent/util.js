import firebase from "firebase/app";
import db from "../../config/firebase";

import { getEndAtValueTimestamp } from "../../util";

export const commentVent = async (commentString, user, ventID) => {
  if (!user) return alert("Only users can comment! Please login or register.");
  let commentObj = {
    like_counter: 0,
    server_timestamp: firebase.firestore.Timestamp.now().seconds * 1000,
    text: commentString,
    userID: user.uid,
    ventID
  };
  const res = await db.collection("comments").add(commentObj);
};

export const deleteVent = async (history, ventID) => {
  await db
    .collection("vents")
    .doc(ventID)
    .delete();
  alert("Vent deleted!");
  history.push("/");
};

export const findPossibleUsersToTag = async (
  currentTypingWord,
  setPossibleUsersToTag,
  ventID,
  callback
) => {
  let isTag;

  if (currentTypingWord) {
    const snapshot = await db
      .collection("users_display_name")
      .where("displayName", ">=", currentTypingWord)
      .where("displayName", "<=", currentTypingWord + "\uf8ff")
      .limit(10)
      .get();
    let users;

    if (snapshot && snapshot.docs && snapshot.docs.length > 0)
      users = snapshot.docs.map((doc, index) => ({
        ...doc.data(),
        id: doc.id,
        doc
      }));

    if (users)
      callback(
        users.map((user, index) => {
          return { id: user.id, display: user.displayName };
        })
      );

    setPossibleUsersToTag({ possibleUsersToTag: users });
  } else {
    setPossibleUsersToTag({ possibleUsersToTag: undefined });
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
  const unsubscribe = db
    .collection("comments")
    .where("ventID", "==", ventID)
    .where(
      "server_timestamp",
      ">=",
      firebase.firestore.Timestamp.now().seconds * 1000
    )
    .orderBy("server_timestamp", "desc")
    .limit(1)
    .onSnapshot(
      querySnapshot => {
        if (first) {
          first = false;
        } else if (querySnapshot.docs && querySnapshot.docs[0]) {
          if (
            querySnapshot.docChanges()[0].type === "added" ||
            querySnapshot.docChanges()[0].type === "removed"
          ) {
            setComments(oldComments => [
              {
                ...querySnapshot.docs[0].data(),
                id: querySnapshot.docs[0].id,
                doc: querySnapshot.docs[0]
              },
              ...oldComments
            ]);
          }
        }
      },
      err => {}
    );
  return unsubscribe;
};

export const getVentComments = async (comments, setComments, ventID) => {
  const startAt = getEndAtValueTimestamp(comments);

  const snapshot = await db
    .collection("comments")
    .where("ventID", "==", ventID)
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
  } else setComments([]);
};

export const ventHasLikedListener = (setHasLiked, userID, ventID) => {
  const unsubscribe = db
    .collection("vent_likes")
    .doc(ventID + "|||" + userID)
    .onSnapshot("value", snapshot => {
      if (!snapshot) return;
      let value = snapshot.data();
      if (value) value = value.liked;

      setHasLiked(Boolean(value));
    });

  return unsubscribe;
};

export const ventListener = (setVent, ventID) => {
  const unsubscribe = db
    .collection("vents")
    .doc(ventID)
    .onSnapshot("value", async doc => {
      if (!doc.exists) return;
      const vent = doc.data();

      const authorDoc = await db
        .collection("users_display_name")
        .doc(vent.userID)
        .get();

      let author = "";
      let authorID;
      if (authorDoc.exists && authorDoc.data().displayName) {
        author = authorDoc.data().displayName;
        authorID = authorDoc.id;
      }

      if (!author) author = "Anonymous";

      if (vent) {
        setVent({ id: ventID, ...vent, author, authorID });
      } else setVent(false);
    });

  return unsubscribe;
};

export const likeOrUnlikeVent = async (hasLiked, user, vent) => {
  if (!user)
    return alert("You must sign in or register an account to support a vent!");

  await db
    .collection("vent_likes")
    .doc(vent.id + "|||" + user.uid)
    .set({ liked: !hasLiked, ventID: vent.id });
};

export const reportVent = async (option, userID, ventID) => {
  await db
    .collection("vent_reports")
    .doc(ventID + "|||" + userID)
    .set({ option, ventID });

  alert(
    "You have successfully reported this vent. We will review this quickly and will take action against this user if their post goes against our rules."
  );
};

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

export const startConversation = async (history, userID, ventUserID) => {
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
    let tempHasSeenObject = {};
    for (let index in sortedMemberIDs) {
      tempHasSeenObject[sortedMemberIDs[index]] = false;
    }

    const conversationDocNew = await db.collection("conversations").add({
      last_updated: firebase.firestore.Timestamp.now().seconds * 1000,
      members: sortedMemberIDs,
      server_timestamp: firebase.firestore.Timestamp.now().seconds * 1000,
      ...tempHasSeenObject
    });
    goToPage(conversationDocNew.id);
  }
};

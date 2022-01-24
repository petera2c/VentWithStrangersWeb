import firebase from "firebase/compat/app";
import { message } from "antd";
import db from "../../config/firebase";

import {
  userSignUpProgress,
  getEndAtValueTimestamp,
  getEndAtValueTimestampAsc,
} from "../../util";

const incrementVentCounter = (attributeToIncrement, shouldIncrease, vent) => {
  const newVent = { ...vent };
  if (shouldIncrease)
    newVent[attributeToIncrement] = newVent[attributeToIncrement] + 1;
  else newVent[attributeToIncrement] = newVent[attributeToIncrement] - 1;
  return newVent;
};

export const commentVent = async (
  commentString,
  setVent,
  user,
  vent,
  ventID
) => {
  let commentObj = {
    like_counter: 0,
    server_timestamp: firebase.firestore.Timestamp.now().toMillis(),
    text: commentString,
    userID: user.uid,
    ventID,
  };

  setVent(incrementVentCounter("comment_counter", true, vent));

  await db.collection("comments").add(commentObj);

  return true;
};

export const deleteVent = async (navigate, ventID) => {
  await db.collection("vents").doc(ventID).delete();
  alert("Vent deleted!");
  navigate("/");
};

export const findPossibleUsersToTag = async (
  currentTypingWord,
  ventID,
  callback
) => {
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
        doc,
      }));

    if (users)
      callback(
        users.map((user, index) => {
          return { id: user.id, display: user.displayName, ...user };
        })
      );
  }
};

export const getVent = async (setVent, ventID) => {
  const ventDoc = await db.collection("vents").doc(ventID).get();

  if (!ventDoc.exists) return;
  const newVent = ventDoc.data();

  setVent({
    id: ventDoc.id,
    ...newVent,
  });
};

export const getVentDescription = (previewMode, vent) => {
  let description = vent.description;
  if (previewMode && description.length > 240)
    description = description.slice(0, 240) + "... Read More";
  return description;
};

export const getVentFullLink = (vent) => {
  const partialLink =
    "/vent/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase();
  return "https://www.ventwithstrangers.com" + partialLink;
};

export const getVentPartialLink = (vent) => {
  return (
    "/vent/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase()
  );
};

export const newVentCommentListener = (
  isMounted,
  setCanLoadMoreComments,
  setComments,
  userID,
  ventID,
  first = true
) => {
  const unsubscribe = db
    .collection("comments")
    .where("ventID", "==", ventID)
    .where(
      "server_timestamp",
      ">=",
      firebase.firestore.Timestamp.now().toMillis()
    )
    .orderBy("server_timestamp", "desc")
    .limit(1)
    .onSnapshot(
      (querySnapshot) => {
        if (first) {
          first = false;
        } else if (querySnapshot.docs && querySnapshot.docs[0]) {
          if (
            querySnapshot.docChanges()[0].type === "added" ||
            querySnapshot.docChanges()[0].type === "removed"
          ) {
            if (isMounted()) {
              if (querySnapshot.docs[0].data().userID === userID)
                setComments((oldComments) => [
                  {
                    ...querySnapshot.docs[0].data(),
                    id: querySnapshot.docs[0].id,
                    doc: querySnapshot.docs[0],
                    useToPaginate: false,
                  },
                  ...oldComments,
                ]);
              else setCanLoadMoreComments(true);
            }
          }
        }
      },
      (err) => {}
    );
  return unsubscribe;
};

export const getVentComments = async (
  activeSort,
  comments,
  isMounted,
  setCanLoadMoreComments,
  setComments,
  useOldComments,
  ventID
) => {
  let snapshot;
  if (activeSort === "first") {
    snapshot = await db
      .collection("comments")
      .where("ventID", "==", ventID)
      .orderBy("server_timestamp")
      .startAfter(getEndAtValueTimestampAsc(comments))
      .limit(10)
      .get();
  } else if (activeSort === "best") {
    snapshot = await db
      .collection("comments")
      .where("ventID", "==", ventID)
      .orderBy("like_counter", "desc")
      .startAfter(getEndAtValueTimestamp(comments))
      .limit(10)
      .get();
  } else if (activeSort === "last") {
    snapshot = await db
      .collection("comments")
      .where("ventID", "==", ventID)
      .orderBy("server_timestamp", "desc")
      .startAfter(getEndAtValueTimestamp(comments))
      .limit(10)
      .get();
  }

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newComments = [];
    snapshot.docs.forEach((doc, index) => {
      if (comments.find((comment) => comment.id === doc.id)) return;
      else
        newComments.push({
          ...doc.data(),
          id: doc.id,
          doc,
          useToPaginate: true,
        });
    });

    if (newComments.length < 10) setCanLoadMoreComments(false);
    else setCanLoadMoreComments(true);

    if (isMounted)
      setComments((oldComments) => {
        if (oldComments && useOldComments) {
          let returnComments = [...oldComments, ...newComments];

          if (activeSort === "first") {
            returnComments.sort((a, b) => {
              if (a.server_timestamp < b.server_timestamp) return -1;
              if (a.server_timestamp > b.server_timestamp) return 1;
              return 0;
            });
          } else if (activeSort === "best") {
            returnComments.sort((a, b) => {
              if (a.like_counter < b.like_counter) return 1;
              if (a.like_counter > b.like_counter) return -1;

              if (a.server_timestamp < b.server_timestamp) return -1;
              if (a.server_timestamp > b.server_timestamp) return 1;
              return 0;
            });
          } else if (activeSort === "last") {
            returnComments.sort((a, b) => {
              if (a.server_timestamp < b.server_timestamp) return 1;
              if (a.server_timestamp > b.server_timestamp) return -1;
              return 0;
            });
          }

          return returnComments;
        } else return newComments;
      });
  } else {
    if (isMounted) setComments([]);
  }
};

export const ventHasLiked = async (setHasLiked, userID, ventID) => {
  const ventHasLikedDoc = await db
    .collection("vent_likes")
    .doc(ventID + "|||" + userID)
    .get();

  if (!ventHasLikedDoc.exists) return;
  let value = ventHasLikedDoc.data();
  if (value) value = value.liked;

  setHasLiked(Boolean(value));
};

export const likeOrUnlikeVent = async (
  hasLiked,
  setHasLiked,
  setVent,
  user,
  vent
) => {
  setHasLiked(!hasLiked);

  setVent(incrementVentCounter("like_counter", !hasLiked, vent));

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

  message.success("Report successful :)");
};

export const tagUser = (
  callback,
  commentString,
  currentTypingIndex,
  taggedUsers,
  user
) => {
  if (!callback || !commentString || !currentTypingIndex || !user) return;

  const taggedUser = {
    display: user._id,
    id: user._id,
  };

  taggedUsers.push(taggedUser);

  return callback({
    commentString,
    possibleUsersToTag: undefined,
    taggedUsers,
  });
};

export const startConversation = async (navigate, user, ventUserID) => {
  const userInteractionIssues = userSignUpProgress(user);
  if (userInteractionIssues) return false;

  const sortedMemberIDs = [user.uid, ventUserID].sort();
  const conversationQuerySnapshot = await db
    .collection("conversations")
    .where("members", "==", sortedMemberIDs)
    .limit(1)
    .get();

  const goToPage = (conversationID) => {
    navigate("/chat?" + conversationID);
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
      last_updated: firebase.firestore.Timestamp.now().toMillis(),
      members: sortedMemberIDs,
      server_timestamp: firebase.firestore.Timestamp.now().toMillis(),
      ...tempHasSeenObject,
    });
    goToPage(conversationDocNew.id);
  }
};

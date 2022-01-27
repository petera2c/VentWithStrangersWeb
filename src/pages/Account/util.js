import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import {
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { writeBatch, doc } from "firebase/firestore";

import db from "../../config/firebase";

import { message } from "antd";

import { displayNameErrors, getEndAtValueTimestamp } from "../../util";

export const deleteAccountAndAllData = async (userID) => {
  let counter = 0;
  const batch = writeBatch(db);

  const commentLikesSnapshot = await db
    .collection("comment_likes")
    .where("userID", "==", userID)
    .get();

  for (let index in commentLikesSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "comment_likes", commentLikesSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const ventLikesSnapshot = await db
    .collection("vent_likes")
    .where("userID", "==", userID)
    .get();
  for (let index in ventLikesSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "vent_likes", ventLikesSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const ventsSnapshot = await db
    .collection("vents")
    .where("userID", "==", userID)
    .get();
  for (let index in ventsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "vents", ventsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const commentReportsSnapshot = await db
    .collection("comment_reports")
    .where("userID", "==", userID)
    .get();
  for (let index in commentReportsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(
      db,
      "comment_reports",
      commentReportsSnapshot.docs[index].id
    );
    batch.delete(ref);
  }

  const ventReportsSnapshot = await db
    .collection("vent_reports")
    .where("userID", "==", userID)
    .get();
  for (let index in ventReportsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "vent_reports", ventReportsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const commentsSnapshot = await db
    .collection("comments")
    .where("userID", "==", userID)
    .get();
  for (let index in commentsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "comments", commentsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const blockedUserSnapshot = await db
    .collection("block_check")
    .where(userID, "==", true)
    .get();
  for (let index in blockedUserSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "block_check", blockedUserSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const conversationsQuerySnapshot = await db
    .collection("conversations")
    .where("members", "array-contains", userID)
    .get();
  for (let index in conversationsQuerySnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(
      db,
      "conversations",
      conversationsQuerySnapshot.docs[index].id
    );
    batch.update(ref, {
      members: firebase.firestore.FieldValue.arrayRemove(userID),
    });
  }

  const inviteUIDSnapshot = await db
    .collection("invite_uid")
    .where("primary_uid", "==", userID)
    .get();
  if (inviteUIDSnapshot.doc && inviteUIDSnapshot.docs[0]) {
    const invitedUsersSnapshot = await db
      .collection("invited_users")
      .where("referral_secondary_uid", "==", inviteUIDSnapshot.docs[0].id)
      .get();
    for (let index in invitedUsersSnapshot.docs) {
      counter++;
      if (counter === 500) await batch.commit();
      const ref = doc(db, "invited_users", invitedUsersSnapshot.docs[index].id);
      batch.update(ref, { referral_secondary_uid: "deleted" });
    }
  }
  for (let index in inviteUIDSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "invite_uid", inviteUIDSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const notificationsSnapshot = await db
    .collection("notifications")
    .where("userID", "==", userID)
    .get();
  for (let index in notificationsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "notifications", notificationsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const rewardsSnapshot = await db
    .collection("rewards")
    .where("userID", "==", userID)
    .get();
  for (let index in rewardsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "rewards", rewardsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const chatQueueSnapshot = await db
    .collection("chat_queue")
    .where("userID", "==", userID)
    .get();
  for (let index in chatQueueSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = doc(db, "chat_queue", chatQueueSnapshot.docs[index].id);
    batch.delete(ref);
  }

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "unread_conversations_count", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "user_day_limit_vents", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "user_day_limit_vents", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "user_expo_tokens", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "user_matches", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "user_rewards", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "user_vent_timeout", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "users", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "users_display_name", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "users_info", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "users_settings", userID));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(doc(db, "unread_conversations_count", userID));

  batch.commit();

  await firebase
    .database()
    .ref("status/" + userID)
    .remove();

  await firebase.auth().currentUser.delete();

  window.location.reload();

  console.log("here");
  console.log(userID);
  return;
};

export const getUsersVents = async (
  isMounted,
  search,
  setCanLoadMoreVents,
  setVents,
  vents
) => {
  let startAt = getEndAtValueTimestamp(vents);

  const snapshot = await db
    .collection("/vents/")
    .where("userID", "==", search)
    .orderBy("server_timestamp", "desc")
    .startAfter(startAt)
    .limit(10)
    .get();
  if (!isMounted()) return;

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newVents = snapshot.docs.map((doc, index) => ({
      ...doc.data(),
      id: doc.id,
      doc,
    }));

    if (newVents.length < 10) setCanLoadMoreVents(false);
    if (vents) {
      return setVents((oldVents) => {
        if (oldVents) return [...oldVents, ...newVents];
        else return newVents;
      });
    } else {
      return setVents(newVents);
    }
  } else return setCanLoadMoreVents(false);
};

export const getUsersComments = async (
  isMounted,
  search,
  setCanLoadMoreComments,
  setComments,
  comments
) => {
  let startAt = getEndAtValueTimestamp(comments);

  const snapshot = await db
    .collection("/comments/")
    .where("userID", "==", search)
    .orderBy("server_timestamp", "desc")
    .startAfter(startAt)
    .limit(10)
    .get();

  if (!isMounted()) return;

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newComments = snapshot.docs.map((doc, index) => ({
      ...doc.data(),
      id: doc.id,
      doc,
    }));

    if (newComments.length < 10) setCanLoadMoreComments(false);
    if (comments) {
      return setComments((oldComments) => {
        if (oldComments) return [...oldComments, ...newComments];
        else return newComments;
      });
    } else {
      return setComments(newComments);
    }
  } else return setCanLoadMoreComments(false);
};

export const getUser = async (callback, userID) => {
  if (!userID) {
    message.error("Reload the page please. An unexpected error has occurred.");
    return {};
  }

  const authorDoc = await db.collection("users_info").doc(userID).get();

  callback(authorDoc.exists ? { ...authorDoc.data(), id: authorDoc.id } : {});
};

export const updateUser = async (
  bio,
  birthDate,
  confirmPassword,
  displayName,
  education,
  email,
  gender,
  kids,
  newPassword,
  partying,
  politics,
  pronouns,
  religion,
  setUserBasicInfo,
  user,
  userInfo
) => {
  let changesFound = false;
  let birthdayChanged = false;

  if (userInfo.birth_date && !birthDate) birthdayChanged = true;
  if (birthDate)
    if (userInfo.birth_date !== birthDate.valueOf()) birthdayChanged = true;

  if (
    birthdayChanged ||
    userInfo.bio !== bio ||
    userInfo.education !== education ||
    userInfo.gender !== gender ||
    userInfo.kids !== kids ||
    userInfo.partying !== partying ||
    userInfo.politics !== politics ||
    userInfo.pronouns !== pronouns ||
    userInfo.religion !== religion
  ) {
    if (gender && gender.length > 15)
      return message.error("Gender can only be a maximum of 15 characters.");
    if (pronouns && pronouns.length > 15)
      return message.error("Pronouns can only be a maximum of 15 characters.");
    if (bio && bio.length > 500)
      return message.error("Bio has a maximum of 500 characters");

    changesFound = true;

    if (education === undefined) deleteField("education", user.uid);
    if (kids === undefined) deleteField("kids", user.uid);
    if (partying === undefined) deleteField("partying", user.uid);
    if (politics === undefined) deleteField("politics", user.uid);
    if (religion === undefined) deleteField("religion", user.uid);

    await db
      .collection("users_info")
      .doc(user.uid)
      .set(
        {
          bio,
          birth_date: birthDate ? birthDate.valueOf() : null,
          gender,
          pronouns,
          ...whatInformationHasChanged(
            education,
            kids,
            partying,
            politics,
            religion,
            userInfo
          ),
        },
        { merge: true }
      );
    message.success("Your account information has been changed");
  }

  if (displayName && displayName !== user.displayName) {
    if (displayNameErrors(displayName)) return;

    changesFound = true;

    updateProfile(user, {
      displayName,
    })
      .then(async () => {
        await db
          .collection("users_display_name")
          .doc(user.uid)
          .update({ displayName });

        setUserBasicInfo((oldInfo) => {
          let temp = { ...oldInfo };
          temp.displayName = displayName;
          return temp;
        });

        message.success("Display name updated!");
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  if (email && email !== user.email) {
    changesFound = true;
    updateEmail(user, email)
      .then(() => {
        sendEmailVerification(user)
          .then(() => {
            message.success("Verification email sent! :)");
          })
          .catch((error) => {
            message.error(error);
          });
      })
      .catch((error) => {
        message.error(error.message);
      });
  }
  if (newPassword && confirmPassword)
    if (newPassword === confirmPassword) {
      changesFound = true;

      user
        .updatePassword(newPassword)
        .then(() => {
          message.success("Changed password successfully!");
        })
        .catch((error) => {
          message.error(error.message);
        });
    } else message.error("Passwords are not the same!");

  if (!changesFound) message.info("No changes!");
};

const deleteField = async (field, userID) => {
  await db
    .collection("users_info")
    .doc(userID)
    .set(
      {
        [field]: firebase.firestore.FieldValue.delete(),
      },
      { merge: true }
    );
};

const whatInformationHasChanged = (
  education,
  kids,
  partying,
  politics,
  religion,
  userInfo
) => {
  let temp = {};

  if (userInfo.education !== education && education !== undefined)
    temp.education = education;
  if (userInfo.kids !== kids && kids !== undefined) temp.kids = kids;
  if (userInfo.partying !== partying && partying !== undefined)
    temp.partying = partying;
  if (userInfo.politics !== politics && politics !== undefined)
    temp.politics = politics;
  if (userInfo.religion !== religion && religion !== undefined)
    temp.religion = religion;
  return temp;
};

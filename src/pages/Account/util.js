import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import db from "../../config/firebase";

import { message } from "antd";

import { getInvalidCharacters } from "../../components/modals/SignUp/util";
import { getEndAtValueTimestamp } from "../../util";

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
  birthDate,
  confirmPassword,
  displayName,
  email,
  gender,
  newPassword,
  pronouns,
  user,
  userInfo,
  education,
  kids,
  partying,
  politics,
  religion
) => {
  let changesFound = false;

  if (
    userInfo.birth_date !== birthDate.valueOf() ||
    userInfo.gender !== gender ||
    userInfo.pronouns !== pronouns ||
    userInfo.education !== education ||
    userInfo.kids !== kids ||
    userInfo.partying !== partying ||
    userInfo.politics !== politics ||
    userInfo.religion !== religion
  ) {
    if (userInfo.gender && userInfo.gender.length > 20)
      return message.error("Gender can only be a maximum of 20 characters.");
    if (userInfo.pronouns && userInfo.pronouns.length > 20)
      return message.error("Pronouns can only be a maximum of 20 characters.");

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
          birth_date: birthDate.valueOf(),
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
    if (getInvalidCharacters(displayName))
      return message.error(
        "These characters are not allowed in your display name. " +
          getInvalidCharacters(displayName)
      );
    changesFound = true;

    updateProfile(user, {
      displayName,
    })
      .then(async () => {
        await db
          .collection("users_display_name")
          .doc(user.uid)
          .update({ displayName });
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
        console.log(user);
        sendEmailVerification(user)
          .then(() => {
            message.success("We have sent you an email verification link");
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

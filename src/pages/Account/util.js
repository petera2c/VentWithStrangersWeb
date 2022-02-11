import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  get,
  limitToFirst,
  orderByKey,
  ref,
  query as query2,
  set,
  startAfter as startAfter2,
} from "firebase/database";
import {
  getAuth,
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "firebase/auth";

import { db, db2 } from "../../config/db_init";

import { message } from "antd";

import { displayNameErrors, getEndAtValueTimestamp } from "../../util";

const deleteAccountField = async (field, userID) => {
  await updateDoc(doc(db, "users_info", userID), {
    [field]: deleteField(),
  });
};

export const deleteAccountAndAllData = async (userID) => {
  await getAuth().currentUser.delete();

  window.location.reload();
};

export const followOrUnfollowUser = async (
  isMounted,
  option,
  setIsFollowing,
  userID,
  userIDToFollow
) => {
  await set(
    ref(db2, "following/" + userID + "/" + userIDToFollow),
    option ? option : null
  );

  if (isMounted()) setIsFollowing(option);
  message.success(
    option ? "Followed Successfully :)" : "Unfollowed Successfully :)"
  );
};

export const getBlockedUsers = async (
  blockedUsers,
  isMounted,
  setBlockedUsers,
  setCanLoadMore,
  userID
) => {
  const snapshot = await get(
    query2(
      ref(db2, "block_check_new/" + userID),
      orderByKey(),
      startAfter2(
        blockedUsers && blockedUsers.length > 0
          ? blockedUsers[blockedUsers.length - 1]
          : ""
      ),
      limitToFirst(10)
    )
  );

  if (!isMounted()) return;

  let newBlockedUsers = [];

  for (let index in snapshot.val()) {
    if (index === 0 && blockedUsers && blockedUsers.length > 0) continue;
    newBlockedUsers.push(index);
  }

  if (newBlockedUsers.length > 0) {
    if (newBlockedUsers.length < 10) setCanLoadMore(false);
    else setCanLoadMore(true);

    if (blockedUsers && blockedUsers.length > 0) {
      return setBlockedUsers((oldBlockedUsers) => {
        if (oldBlockedUsers) return [...oldBlockedUsers, ...newBlockedUsers];
        else return newBlockedUsers;
      });
    } else {
      return setBlockedUsers(newBlockedUsers);
    }
  } else setCanLoadMore(false);
};

export const getIsFollowing = async (
  isMounted,
  setIsFollowing,
  userID,
  userIDToFollow
) => {
  const isFollowingDoc = await get(
    ref(db2, "following/" + userID + "/" + userIDToFollow),
    true
  );

  if (isMounted()) setIsFollowing(isFollowingDoc.val());
};

export const getUser = async (callback, userID) => {
  if (!userID) {
    message.error("Reload the page please. An unexpected error has occurred.");
    return {};
  }

  const authorDoc = await getDoc(doc(db, "users_info", userID));

  callback(authorDoc.exists() ? { ...authorDoc.data(), id: authorDoc.id } : {});
};

export const getUsersComments = async (
  isMounted,
  search,
  setCanLoadMoreComments,
  setComments,
  comments
) => {
  let startAt = getEndAtValueTimestamp(comments);

  const snapshot = await getDocs(
    query(
      collection(db, "comments"),
      where("userID", "==", search),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

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

export const getUsersVents = async (
  isMounted,
  search,
  setCanLoadMoreVents,
  setVents,
  vents
) => {
  let startAt = getEndAtValueTimestamp(vents);

  const snapshot = await getDocs(
    query(
      collection(db, "vents"),
      where("userID", "==", search),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

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

export const unblockUser = async (blockedUserID, setBlockedUsers, userID) => {
  await set(ref(db2, "block_check_new/" + userID + "/" + blockedUserID), null);

  setBlockedUsers((blockedUsers) => {
    blockedUsers.splice(
      blockedUsers.findIndex(
        (blockedUserID2) => blockedUserID2 === blockedUserID
      ),
      1
    );
    return [...blockedUsers];
  });
  message.success("User has been unblocked :)");
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

    if (education === undefined) deleteAccountField("education", user.uid);
    if (kids === undefined) deleteAccountField("kids", user.uid);
    if (partying === undefined) deleteAccountField("partying", user.uid);
    if (politics === undefined) deleteAccountField("politics", user.uid);
    if (religion === undefined) deleteAccountField("religion", user.uid);

    updateDoc(doc(db, "users_info", user.uid), {
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
    });

    message.success("Your account information has been changed");
  }

  if (displayName && displayName !== user.displayName) {
    if (displayNameErrors(displayName)) return;

    changesFound = true;

    updateProfile(user, {
      displayName,
    })
      .then(async () => {
        await updateDoc(doc(db, "users_display_name", user.uid), {
          displayName,
        });

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

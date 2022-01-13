import React, { useCallback, useEffect, useRef } from "react";
import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import db from "./config/firebase";
import { Modal, Button, Space } from "antd";

import { setUserOnlineStatus } from "./pages/util";

export const addTagsToPage = (props, selectedTags) => {
  const { browser, navigate, location } = props;
  let searchPathname = location.pathname;
  if (
    searchPathname !== "/popular" &&
    searchPathname !== "/recent" &&
    searchPathname !== "/trending"
  )
    searchPathname = "/trending";

  for (let index in selectedTags) {
    if (index == 0) searchPathname += "?tags=" + selectedTags[index].name;
    else searchPathname += "+" + selectedTags[index].name;
  }
  navigate(searchPathname);
};

export const blockUser = async (userID, userIDToBlock) => {
  const sortedUserArray = [userID, userIDToBlock].sort();
  await db
    .collection("block_check")
    .doc(sortedUserArray[0] + "|||" + sortedUserArray[1])
    .set({
      [userID]: true
    });
  alert("User has been blocked");
  window.location.reload();
};

export const calculateKarma = usereBasicInfo => {
  const goodKarma = usereBasicInfo.good_karma ? usereBasicInfo.good_karma : 0;
  const badKarma = usereBasicInfo.bad_karma ? usereBasicInfo.bad_karma : 0;

  return goodKarma - badKarma;
};

export const userSignUpProgress = (user, noAlert) => {
  if (!user) {
    return "NSI";
  } else if (!user.emailVerified) {
    if (!noAlert) {
      user.sendEmailVerification();
      Modal.info({
        title: "Verify Email",
        content: "We have re-sent you a verification email :)"
      });
    }
    return "NVE";
  } else return false;
};

// Taken from stack overflow
export const capitolizeWordsInString = str => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};
export const capitolizeFirstChar = string => {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
};

export const combineObjectWithID = (id, object) => {
  object.id = id;
  return object;
};

export const getEndAtValueTimestamp = array => {
  let startAt = 10000000000000;

  if (array && array[array.length - 1] && array[array.length - 1].doc)
    startAt = array[array.length - 1].doc;
  return startAt;
};

export const getIsUserOnline = (setIsUserOnline, userID) => {
  const ref = firebase.database().ref("status/" + userID);

  ref.on("value", snapshot => {
    if (snapshot.val() && snapshot.val().state === "online")
      setIsUserOnline(true);
    else setIsUserOnline(false);
  });
};

export const getTotalOnlineUsers = callback => {
  const ref = firebase.database().ref("total_online_users");

  ref.on("value", doc => {
    callback(doc.val());
  });

  return ref;
};

export const getUserBasicInfo = async (callback, userID) => {
  if (!userID) return {};

  const authorDoc = await db
    .collection("users_display_name")
    .doc(userID)
    .get();

  callback(authorDoc.exists ? { ...authorDoc.data(), id: authorDoc.id } : {});
};

export const hasUserBlockedUser = async (userID, userID2, callback) => {
  const sortedUserArray = [userID, userID2].sort();
  const blockCheck = await db
    .collection("block_check")
    .doc(sortedUserArray[0] + "|||" + sortedUserArray[1])
    .get();

  if (blockCheck.exists) return callback(true);
  else return callback(false);
};

export const isMobileOrTablet = () => window.screen.width < 940;

export const isPageActive = (page, pathname) => {
  if (page === pathname) return " active ";
  else return "";
};

export const signOut = async userID => {
  await setUserOnlineStatus("offline", userID);

  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.reload();
    });
};

export const soundNotify = (sound = "bing") => {
  let audio;
  if (process.env.NODE_ENV == "development")
    audio = new Audio("/static/" + sound + ".mp3");
  else audio = new Audio(sound + ".mp3");

  audio.play();
};

export function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
}

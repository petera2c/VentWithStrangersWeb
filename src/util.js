import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMedal } from "@fortawesome/pro-solid-svg-icons/faMedal";

import firebase from "firebase/app";
import "firebase/auth";
import db from "./config/firebase";

export const addTagsToPage = (props, selectedTags) => {
  const { browser, history, location } = props;
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
  history.push(searchPathname);
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

export const karmaBadge = karma => {
  const title =
    "Karma Badges are awarded based on Karma Points. Get Karma Points when your Vent or comment gets upvoted or when you upvote a Vent or comment. Lose Karma points if you get reported for a valid reason.";
  let karmaColor = "";
  if (karma >= 5000)
    return (
      <h5 className="bg-light-blue fw-400 px8 py4 br8" title={title}>
        Site Admin
      </h5>
    );
  else if (karma >= 500) karmaColor = "#E11218";
  else if (karma >= 250) karmaColor = "#FFD700";
  else if (karma >= 100) karmaColor = "#C0C0C0";
  else if (karma >= 50) karmaColor = "#b87333";

  if (karmaColor)
    return (
      <FontAwesomeIcon
        icon={faMedal}
        color={karmaColor}
        size="2x"
        title={title}
      />
    );
  else return;
};

export const calculateKarma = usereBasicInfo => {
  const goodKarma = usereBasicInfo.good_karma ? usereBasicInfo.good_karma : 0;
  const badKarma = usereBasicInfo.bad_karma ? usereBasicInfo.bad_karma : 0;

  return goodKarma - badKarma;
};

// Taken from stack overflow
export const capitolizeWordsInString = str => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};
export const capitolizeFirstChar = string => {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
};

export const combineInsideObjectWithID = object => {
  return Object.keys(object).map(objectID => {
    return { id: objectID, ...object[objectID] };
  });
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

export const getTextFromHtmlTag = tagString => {
  let div = document.createElement("div");
  div.innerHTML = "<div   dangerouslySetInnerHTML={{__html: " + tagString;

  return div.textContent || div.innerText || "";
};

export const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.reload();
    });
};

export const soundNotify = (sound = "bing") => {
  var audio = new Audio("/static/" + sound + ".mp3");
  audio.play();
};

import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";

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

// Taken from stack overflow
export const capitolizeWordsInString = str => {
  return str.replace(/\b\w/g, l => l.toUpperCase());
};
export const capitolizeFirstChar = string => {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
};

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
  let folderPath = "";
  if (process.env.NODE_ENV === "development") folderPath = "static/";

  var mp3Source =
    '<source src="' + folderPath + sound + '.mp3" type="audio/mpeg">';
  var oggSource =
    '<source src="' + folderPath + sound + '.ogg" type="audio/ogg">';
  var embedSource =
    '<embed hidden="true" autostart="true" loop="false" src="' +
    folderPath +
    sound +
    '.mp3">';

  var audio = new Audio("static/bing.mp3");
  audio.play();
  document.getElementById("sound").innerHTML =
    '<audio autoplay="autoplay">' +
    mp3Source +
    oggSource +
    embedSource +
    "</audio>";
};

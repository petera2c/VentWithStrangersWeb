import axios from "axios";
import firebase from "firebase/app";
import "firebase/auth";

// Taken from stack overflow
export const capitolizeWordsInString = (str) => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};
export const capitolizeFirstChar = (string) => {
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

export const getTextFromHtmlTag = (tagString) => {
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
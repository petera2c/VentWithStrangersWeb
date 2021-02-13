import firebase from "firebase/app";
import "firebase/database";
import { combineInsideObjectWithID, getEndAtValue } from "../../util";

export const getVents = (pathname, setCanLoadMorePosts, setVents, vents) => {
  const db = firebase.database();
  let endAt = getEndAtValue(vents);

  let getVentsQuery = db
    .ref("/vents/")
    .orderByChild("server_timestamp")
    .endAt(endAt)
    .limitToLast(10);
  if (pathname === "/trending")
    getVentsQuery = db
      .ref("/vents/")
      .orderByChild("likeCounter")
      .endAt(endAt)
      .limitToLast(10);

  getVentsQuery.once("value", snapshot => {
    if (!snapshot.exists()) return setCanLoadMorePosts(false);
    else {
      const newVents = combineInsideObjectWithID(snapshot.val());

      newVents.sort((a, b) => {
        if (a.server_timestamp < b.server_timestamp) return 1;
        else return -1;
      });

      if (vents) return setVents([...vents, ...newVents]);
      else return setVents(newVents);
    }
  });
};

export const getMetaInformation = pathname => {
  let metaTitle = "";
  let metaDescription =
    "People care. Vent and chat anonymously to be apart of a community committed to making the world a better place.";

  if (pathname === "/popular") {
    metaTitle = "Popular";
    metaDescription =
      "Vents and issues that have the most upvotes and comments of all time. Post, comment, and/or like anonymously.";
  } else if (pathname === "/recent") {
    metaTitle = "Recent";
    metaDescription =
      "The latest vents and issues people have posted. Post, comment, and/or like anonymously.";
  } else if (pathname === "/trending") {
    metaTitle = "Trending";
    metaDescription =
      "People’s vents and issues with the most upvotes in the past 24 hours. Post, comment, and/or like anonymously.";
  } else {
    metaTitle = "Recent";
    metaDescription =
      "The latest vents and issues people have posted. Post, comment, and/or like anonymously.";
  }
  return { metaDescription, metaTitle };
};

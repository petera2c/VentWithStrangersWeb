import moment from "moment-timezone";
import firebase from "firebase/app";
import db from "../../config/firebase";
import { getEndAtValueTimestamp } from "../../util";

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
      "View trending vents. Post, comment, and/or like anonymously.";
  } else {
    metaTitle = "Trending";
    metaDescription =
      "View trending vents. Post, comment, and/or like anonymously.";
  }
  return { metaDescription, metaTitle };
};

export const getVents = async (pathname, setCanLoadMore, setVents, vents) => {
  let startAt = getEndAtValueTimestamp(vents);

  let snapshot;
  if (pathname === "/recent") {
    snapshot = await db
      .collection("/vents/")
      .orderBy("server_timestamp", "desc")
      .startAfter(startAt)
      .limit(10)
      .get();
  } else {
    let startDate = moment();
    startDate.subtract(3, "days");
    snapshot = await db
      .collection("/vents/")
      .orderBy("trending_score", "desc")
      .startAfter(startAt)
      .limit(10)
      .get();
  }

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newVents = snapshot.docs.map((doc, index) => ({
      ...doc.data(),
      id: doc.id,
      doc
    }));

    if (newVents.length < 10) setCanLoadMore(false);
    if (vents) {
      return setVents(oldVents => {
        if (oldVents) return [...oldVents, ...newVents];
        else return newVents;
      });
    } else {
      return setVents(newVents);
    }
  } else return setCanLoadMore(false);
};

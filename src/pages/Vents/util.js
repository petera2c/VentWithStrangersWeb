import moment from "moment-timezone";
import db from "../../config/firebase";
import { getEndAtValueTimestamp } from "../../util";

export const getMetaInformation = (pathname) => {
  let metaTitle = "";
  let metaDescription =
    "People care. Vent and chat anonymously to be apart of a community committed to making the world a better place.";

  if (pathname === "/recent") {
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

export const getVents = async (
  isMounted,
  pathname,
  setCanLoadMore,
  setVents,
  vents
) => {
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
  if (!isMounted.current) return;

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newVents = snapshot.docs.map((doc, index) => ({
      doc,
      id: doc.id,
      ...doc.data(),
    }));

    if (newVents.length < 10) setCanLoadMore(false);
    if (vents) {
      return setVents((oldVents) => {
        if (oldVents) return [...oldVents, ...newVents];
        else return newVents;
      });
    } else {
      return setVents(newVents);
    }
  } else return setCanLoadMore(false);
};

export const newVentListener = (
  isMounted,
  pathname,
  setWaitingVents,
  first = true
) => {
  if (pathname !== "/recent") return;

  const unsubscribe = db
    .collection("vents")
    .orderBy("server_timestamp", "desc")
    .limit(1)
    .onSnapshot((querySnapshot) => {
      if (first) {
        first = false;
      } else if (querySnapshot.docs && querySnapshot.docs[0]) {
        if (
          querySnapshot.docChanges()[0].type === "added" ||
          querySnapshot.docChanges()[0].type === "removed"
        ) {
          if (isMounted.current)
            setWaitingVents((vents) => [
              {
                doc: querySnapshot.docs[0],
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data(),
              },
              ...vents,
            ]);
        }
      }
    });

  return unsubscribe;
};

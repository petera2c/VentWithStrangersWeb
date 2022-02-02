import { db }from "../../config/localhost_init";

export const createShareLink = (secondUID) => {
  let link = "https://www.ventwithstrangers.com?referral=" + secondUID;
  if (process.env.NODE_ENV === "development")
    link = "http://localhost:3000?referral=" + secondUID;

  return link;
};

export const getSecondUID = async (setSecondUID, uid) => {
  const snapshot = await db
    .collection("invite_uid")
    .where("primary_uid", "==", uid)
    .get();

  if (snapshot && snapshot.docs.length > 0) {
    const doc = snapshot.docs[0];
    setSecondUID(doc.id);
  }
};

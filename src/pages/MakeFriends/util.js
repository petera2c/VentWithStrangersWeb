import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/db_init";

export const getUserInfo = async (callback, userID) => {
  const authorDoc = await getDoc(doc(db, "users_info", userID));

  callback(authorDoc.exists() ? { ...authorDoc.data(), id: authorDoc.id } : {});
};

export const getUserMatches = async (callback, userID) => {
  const authorDoc = await getDoc(doc(db, "user_matches", userID));

  if (!authorDoc.exists()) return;

  let counter = 0;
  let userMatchesWithInfo = [];

  for (let index in authorDoc.data().matches) {
    counter++;

    getDoc(doc(db, "users_info", authorDoc.data().matches[index])).then(
      (infoDoc) => {
        getDoc(
          doc(db, "users_display_name", authorDoc.data().matches[index])
        ).then((displayDoc) => {
          counter--;

          let userWithAllInfo = {};

          if (infoDoc.exists())
            userWithAllInfo = { ...infoDoc.data(), userID: displayDoc.id };
          if (displayDoc.exists())
            userWithAllInfo = { ...userWithAllInfo, ...displayDoc.data() };

          userMatchesWithInfo.push(userWithAllInfo);

          if (counter === 0) callback(userMatchesWithInfo);
        });
      }
    );
  }
};

export const hasUserCompletedProfile = (userInfo) => {
  return Boolean(
    userInfo &&
      userInfo.education !== undefined &&
      userInfo.kids !== undefined &&
      userInfo.partying !== undefined &&
      userInfo.politics !== undefined &&
      userInfo.religion !== undefined &&
      userInfo.birth_date !== undefined
  );
};

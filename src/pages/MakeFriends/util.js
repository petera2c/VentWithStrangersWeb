import { db }from "../../config/localhost_init";

export const getUserInfo = async (callback, userID) => {
  if (!userID) {
    alert("Reload the page please. An unexpected error has occurred.");
    return {};
  }

  const authorDoc = await db
    .collection("users_info")
    .doc(userID)
    .get();

  callback(authorDoc.exists ? { ...authorDoc.data(), id: authorDoc.id } : {});
};

export const getUserMatches = async (callback, userID) => {
  const authorDoc = await db
    .collection("user_matches")
    .doc(userID)
    .get();

  if (!authorDoc.exists) return;

  let counter = 0;
  let userMatchesWithInfo = [];

  for (let index in authorDoc.data().matches) {
    counter++;
    db.collection("users_info")
      .doc(authorDoc.data().matches[index])
      .get()
      .then(infoDoc => {
        db.collection("users_display_name")
          .doc(authorDoc.data().matches[index])
          .get()
          .then(displayDoc => {
            counter--;

            let userWithAllInfo = {};

            if (infoDoc.exists)
              userWithAllInfo = { ...infoDoc.data(), userID: displayDoc.id };
            if (displayDoc.exists)
              userWithAllInfo = { ...userWithAllInfo, ...displayDoc.data() };

            userMatchesWithInfo.push(userWithAllInfo);

            if (counter === 0) callback(userMatchesWithInfo);
          });
      });
  }
};

export const hasUserCompletedProfile = userInfo => {
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

const updateFeedAndFollowers = async (change: any, context: any) => {
  const { followingUserID, userID } = context.params;
  const changeAfter = change.after.val();

  if (changeAfter === "total") return;

  const addVentsToFeed = async (followingUserID: any, userID: any) => {
    const snapshot = await admin
      .firestore()
      .collection("vents")
      .where("userID", "==", followingUserID)
      .orderBy("server_timestamp", "desc")
      .limit(5)
      .get();

    for (let index in snapshot.docs) {
      await admin
        .database()
        .ref("feed/" + userID + "/" + snapshot.docs[index].id)
        .set({
          server_timestamp: snapshot.docs[index].data().server_timestamp,
          userID: snapshot.docs[index].data().userID,
        });
    }
  };

  const incrementTotalCounter = (increment: any) => {
    admin
      .database()
      .ref("following_total/" + userID)
      .set(admin.database.ServerValue.increment(increment));
  };

  const removeVentsFromFeed = async (unfollowingUserID: any, userID: any) => {
    const snapshot = await admin
      .database()
      .ref("feed/" + userID)
      .orderByChild("userID")
      .startAt(unfollowingUserID)
      .endAt(unfollowingUserID)
      .once("value");

    for (let index in snapshot.val()) {
      await admin
        .database()
        .ref("feed/" + userID + "/" + index)
        .set(null);
    }
  };

  if (changeAfter) {
    admin
      .database()
      .ref("followers/" + followingUserID + "/" + userID)
      .set(true);
    incrementTotalCounter(1);
    addVentsToFeed(followingUserID, userID);
  } else {
    admin
      .database()
      .ref("followers/" + followingUserID + "/" + userID)
      .set(null);
    incrementTotalCounter(-1);
    removeVentsFromFeed(followingUserID, userID);
  }
};

module.exports = { updateFeedAndFollowers };

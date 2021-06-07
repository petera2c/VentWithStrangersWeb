const admin = require("firebase-admin");

const blockUserListener = async (change, context) => {
  let blockedUserListAfter = change.after.data();
  let blockedUserListBefore = change.before.data();
  const { userID } = context.params;

  const getBlockedUserID = async (doc) => {
    return doc.blocked_users[doc.blocked_users.length - 1];
  };
  const function2 = async (blockedUserID) => {
    const sortedMemberIDs = [userID, blockedUserID].sort();

    await admin
      .firestore()
      .collection("block_check")
      .doc(userID + "|||" + blockedUserID)
      .set({ blocked: true });

    const conversationsSnapshot = await admin
      .firestore()
      .collection("conversations")
      .where("members", "==", sortedMemberIDs)
      .get();

    if (conversationsSnapshot.docs) {
      for (let index in conversationsSnapshot.docs) {
        await admin
          .firestore()
          .collection("conversations")
          .doc(conversationsSnapshot.docs[index].id)
          .update({
            members: admin.firestore.FieldValue.arrayRemove(userID),
          });
      }
    }
  };

  if (!blockedUserListBefore) {
    function2(await getBlockedUserID(blockedUserListAfter));
  } else if (!blockedUserListAfter) {
    // user has been unblocked
  } else if (
    blockedUserListAfter.blocked_users.length >
    blockedUserListBefore.blocked_users.length
  ) {
    function2(await getBlockedUserID(blockedUserListAfter));
  } else if (
    blockedUserListAfter.blocked_users.length <
    blockedUserListBefore.blocked_users.length
  ) {
    // user has been unblocked
  } else
    console.log(
      "It is hopefully impossible to be here. Or this was a double request so do nothing"
    );
};

module.exports = {
  blockUserListener,
};

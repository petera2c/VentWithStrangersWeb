const admin = require("firebase-admin");

const newUserSetup = async (user) => {
  const test = await admin
    .firestore()
    .collection("invite_uid")
    .add({ [user.uid]: true });
};

module.exports = {
  newUserSetup,
};

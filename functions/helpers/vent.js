const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const { createVentLink } = require("./util");

const newVentListener = (doc, context) => {
  const vent = { id: doc.id, ...doc.data() };

  return createNotification(
    createVentLink(vent),
    "Your new vent is live!",
    vent.userID
  );
};

const newVentLikeListener = async (doc, context) => {
  const ventIDuserID = doc.id;

  const ventIDuserIDArray = ventIDuserID.split("|||");

  const ventDoc = await admin
    .firestore()
    .collection("vents")
    .doc(ventIDuserIDArray[0])
    .get();
  const vent = { id: ventDoc.id, ...ventDoc.data() };

  return createNotification(
    createVentLink(vent),
    "Someone has supported your vent!",
    vent.userID
  );
};

module.exports = { newVentLikeListener, newVentListener };

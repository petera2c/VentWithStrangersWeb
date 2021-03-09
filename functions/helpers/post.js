const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const { createVentLink } = require("./util");

const newPostListener = (doc, context) => {
  const vent = { id: doc.id, ...doc.data() };

  return createNotification(
    createVentLink(vent),
    "Your new vent is live!",
    vent.userID
  );
};

const newPostLikeListener = (doc, context) => {
  return;
  const vent = { id: doc.id, ...doc.data() };

  return createNotification(
    createVentLink(vent),
    "Your new vent is live!",
    vent.userID
  );
};

module.exports = { newPostLikeListener, newPostListener };

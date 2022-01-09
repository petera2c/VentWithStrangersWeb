const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const { blockUserListener } = require("./helpers/block");
const {
  commentLikeListener,
  commentUpdateListener,
  newCommentReportListener,
} = require("./helpers/comment");
const { conversationUpdateListener } = require("./helpers/conversation");
const { messagesListener } = require("./helpers/messages");

const { createProxy, createSitemap } = require("./helpers/sitemap");
const { newUserSetup, userWasInvited } = require("./helpers/user");
const {
  getMetaInformation,
  updateTotalUsersOnline,
} = require("./helpers/util");
const {
  decreaseTrendingScore,
  decreaseUserVentCounter,
  newVentLikeListener,
  newVentListener,
  newVentReportListener,
  ventDeleteListener,
} = require("./helpers/vent");

process.setMaxListeners(0);

exports.newUserSetup = functions.auth.user().onCreate(newUserSetup);
exports.userWasInvited = functions.firestore
  .document("/invited_users/{secondUID}")
  .onCreate(userWasInvited);

exports.blockUserListener = functions.firestore
  .document("/block_check/{userID1userID2}")
  .onWrite(blockUserListener);

exports.commentUpdateListener = functions.firestore
  .document("/comments/{commentID}")
  .onWrite(commentUpdateListener);
exports.commentLikeListener = functions.firestore
  .document("/comment_likes/{commentIDUserID}")
  .onWrite(commentLikeListener);
exports.newCommentReportListener = functions.firestore
  .document("/comment_reports/{commentIDUserID}")
  .onCreate(newCommentReportListener);

exports.newVentListener = functions.firestore
  .document("/vents/{ventID}")
  .onCreate(newVentListener);
exports.ventDeleteListener = functions.firestore
  .document("/vents/{ventID}")
  .onDelete(ventDeleteListener);
exports.newVentLikeListener = functions.firestore
  .document("/vent_likes/{ventIDuserID}")
  .onWrite(newVentLikeListener);
exports.newVentReportListener = functions.firestore
  .document("/vent_reports/{ventIDuserID}")
  .onCreate(newVentReportListener);

exports.messagesListener = functions.firestore
  .document("/conversation_extra_data/{conversationID}/messages/{messageID}")
  .onCreate(messagesListener);
exports.conversationUpdateListener = functions.firestore
  .document("/conversations/{conversationID}")
  .onWrite(conversationUpdateListener);

exports.onlineStatusListener = functions.database
  .ref("/status/{userID}")
  .onWrite(updateTotalUsersOnline);

exports.cronUpdateSitemap = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => createSitemap());

exports.cronDecreaseTrendingScore = functions.pubsub
  .schedule("0 * * * *")
  .onRun(async () => decreaseTrendingScore());

exports.cronDecreaseUserVentCounter = functions.pubsub
  .schedule("0 12 * * *")
  .onRun(async () => decreaseUserVentCounter());

const injectMetaData = (req, res) => {
  const filePath = path.resolve(__dirname, "./build/index.html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    getMetaInformation(req.originalUrl, (metaObj, foundPage, vent) => {
      const { metaDescription, metaImage, metaTitle } = metaObj;

      data = data.replace(/We Care \| Vent With Strangers/g, metaTitle);
      data = data.replace(
        /Vent, and chat anonymously to be apart of a community committed to making the world a happier place./g,
        metaDescription
      );

      data = data.replace(
        /https:\/\/res.cloudinary.com\/dnc1t9z9o\/image\/upload\/v1580431332\/VENT.jpg/g,
        metaImage
      );
      // res.set("Cache-Control", "public", "max-age=600", "s-maxage=1200");
      if (vent)
        data = data.replace(
          /vent-data-example/g,
          JSON.stringify(vent).replace(/"/g, "&quot;")
        );
      if (foundPage) res.send(data);
      else res.send(404, data);
    });
  });
};
app.get("/sitemap.xml", createProxy());

app.get("*", async (req, res) => {
  return injectMetaData(req, res);
});

exports.app = functions.https.onRequest(app);

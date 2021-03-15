const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const { createProxy, createSitemap } = require("./helpers/sitemap");
const {
  commentLikeListener,
  newCommentListener,
} = require("./helpers/comment");
const { newVentLikeListener, newVentListener } = require("./helpers/vent");
const { updatedConversationListener } = require("./helpers/conversation");
const { getMetaInformation } = require("./helpers/util");
const { messagesListener } = require("./helpers/messages");

exports.newCommentListener = functions.firestore
  .document("/comments/{commentID}")
  .onCreate(newCommentListener);

exports.newVentListener = functions.firestore
  .document("/vents/{ventID}")
  .onCreate(newVentListener);

exports.newVentLikeListener = functions.firestore
  .document("/vent_likes/{ventIDuserID}")
  .onCreate(newVentLikeListener);

exports.commentLikeListener = functions.firestore
  .document("/comment_likes/{commentIDUserID}")
  .onWrite(commentLikeListener);

exports.messagesListener = functions.firestore
  .document("/conversation_extra_data/{conversationID}/messages/{messageID}")
  .onCreate(messagesListener);

exports.cronUpdateSitemap = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => createSitemap());

const injectMetaData = (req, res) => {
  const filePath = path.resolve(__dirname, "./build/index.html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    getMetaInformation(req.originalUrl, (metaObj) => {
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

      res.set("Cache-Control", "public", "max-age=600", "s-maxage=1200");
      res.send(data);
    });
  });
};
app.get("/sitemap.xml", createProxy());

app.get("*", async (req, res) => {
  return injectMetaData(req, res);
});

exports.app = functions.https.onRequest(app);

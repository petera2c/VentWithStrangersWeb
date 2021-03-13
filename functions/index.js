const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const { createProxy, createSitemap } = require("./helpers/sitemap");
const { newCommentListener } = require("./helpers/comment");
const { newVentLikeListener, newVentListener } = require("./helpers/vent");
const { updatedConversationListener } = require("./helpers/conversation");
const { getMetaInformation } = require("./helpers/util");

exports.newCommentListener = functions.firestore
  .document("/comments/{commentID}")
  .onCreate(newCommentListener);

exports.newVentListener = functions.firestore
  .document("/vents/{ventID}")
  .onCreate(newVentListener);

exports.newVentLikeListener = functions.firestore
  .document("/vent_likes/{ventIDuserID}")
  .onCreate(newVentLikeListener);

exports.updatedConversationListener = functions.firestore
  .document("/conversations/{conversationID}")
  .onCreate(updatedConversationListener);

exports.cronUpdateSitemap = functions.pubsub
  .schedule("every 2 minutes")
  .onRun(async () => createSitemap());

const injectMetaData = (req, res) => {
  createSitemap();
  const filePath = path.resolve(__dirname, "./build/index.html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    getMetaInformation(req.originalUrl, (metaObj) => {
      const { metaDescription, metaImage, metaTitle } = metaObj;

      data = data.replace(/\$OG_TITLE/g, metaTitle);
      data = data.replace(/\$OG_DESCRIPTION/g, metaDescription);
      data = data.replace(/\$OG_IMAGE/g, metaImage);
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

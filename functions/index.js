const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const express = require("express");
const app = express();

const { createProxy, createSitemap } = require("./helpers/sitemap");
const { newCommentListener } = require("./helpers/comment");
const { newVentLikeListener, newVentListener } = require("./helpers/vent");
const { updatedConversationListener } = require("./helpers/conversation");

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
  .schedule("0 0 * * *")
  .onRun(async () => createSitemap());

app.get("/sitemap.xml", createProxy());

exports.app = functions.https.onRequest(app);

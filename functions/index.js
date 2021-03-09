const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const express = require("express");
const app = express();

const { createProxy, createSitemap } = require("./helpers/sitemap");
const { newCommentListener } = require("./helpers/comment");
const { newPostLikeListener, newPostListener } = require("./helpers/post");

exports.newCommentListener = functions.firestore
  .document("/comments/{commentID}")
  .onCreate(newCommentListener);

exports.newPostListener = functions.firestore
  .document("/vents/{ventID}")
  .onCreate(newPostListener);

exports.newPostLikeListener = functions.firestore
  .document("/vent_likes/{ventIDuserID}")
  .onCreate(newPostLikeListener);

exports.cronUpdateSitemap = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => createSitemap());

app.get("/sitemap.xml", createProxy());

exports.app = functions.https.onRequest(app);

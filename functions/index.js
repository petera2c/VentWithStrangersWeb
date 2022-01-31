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
  newCommentListener,
  commentDeleteListener,
  newCommentReportListener,
} = require("./helpers/comment");
const {
  chatQueueListener,
  conversationUpdateListener,
} = require("./helpers/conversation");
const { messagesListener } = require("./helpers/messages");
const {
  newQuoteListener,
  newQuoteReportListener,
  notifyQuoteContestWinner,
  quoteDeleteListener,
  quoteLikeListener,
} = require("./helpers/quote");
const { createProxy, createSitemap } = require("./helpers/sitemap");
const { subscribeToPlan } = require("./helpers/subscribe");
const {
  checkForBirthdays,
  newUserSetup,
  signPeopleOut,
  userDelete,
  userRewardsListener,
  userWasInvited,
} = require("./helpers/user");
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
exports.userDelete = functions.auth.user().onDelete(userDelete);
exports.userWasInvited = functions.firestore
  .document("/invited_users/{secondUID}")
  .onCreate(userWasInvited);

exports.blockUserListener = functions.firestore
  .document("/block_check/{userID1userID2}")
  .onWrite(blockUserListener);

exports.chatQueueListener = functions.firestore
  .document("/chat_queue/{userID}")
  .onWrite(chatQueueListener);

exports.commentLikeListener = functions.firestore
  .document("/comment_likes/{commentIDUserID}")
  .onWrite(commentLikeListener);
exports.newCommentListener = functions.firestore
  .document("/comments/{commentID}")
  .onCreate(newCommentListener);
exports.commentDeleteListener = functions.firestore
  .document("/comments/{commentID}")
  .onDelete(commentDeleteListener);
exports.newCommentReportListener = functions.firestore
  .document("/comment_reports/{commentIDUserID}")
  .onCreate(newCommentReportListener);

exports.messagesListener = functions.firestore
  .document("/conversation_extra_data/{conversationID}/messages/{messageID}")
  .onCreate(messagesListener);
exports.conversationUpdateListener = functions.firestore
  .document("/conversations/{conversationID}")
  .onWrite(conversationUpdateListener);

exports.newQuoteListener = functions.firestore
  .document("/quotes/{quoteID}")
  .onCreate(newQuoteListener);
exports.newQuoteReportListener = functions.firestore
  .document("/quote_reports/{quoteIDuserID}")
  .onCreate(newQuoteReportListener);
exports.quoteDeleteListener = functions.firestore
  .document("/quotes/{quoteID}")
  .onDelete(quoteDeleteListener);
exports.quoteLikeListener = functions.firestore
  .document("/quote_likes/{quoteIDuserID}")
  .onWrite(quoteLikeListener);

exports.userRewardsListener = functions.firestore
  .document("/user_rewards/{userID}")
  .onWrite(userRewardsListener);

exports.newVentLikeListener = functions.firestore
  .document("/vent_likes/{ventIDuserID}")
  .onWrite(newVentLikeListener);
exports.newVentReportListener = functions.firestore
  .document("/vent_reports/{ventIDuserID}")
  .onCreate(newVentReportListener);
exports.newVentListener = functions.firestore
  .document("/vents/{ventID}")
  .onCreate(newVentListener);
exports.ventDeleteListener = functions.firestore
  .document("/vents/{ventID}")
  .onDelete(ventDeleteListener);

exports.onlineStatusListener = functions.database
  .ref("/status/{userID}")
  .onWrite(updateTotalUsersOnline);

exports.cronBirthdayNotification = functions.pubsub
  .schedule("0 4 * * *")
  .onRun(async () => checkForBirthdays());
exports.cronDecreaseTrendingScore = functions.pubsub
  .schedule("0 * * * *")
  .onRun(async () => decreaseTrendingScore());
exports.cronDecreaseUserVentCounter = functions.pubsub
  .schedule("0 12 * * *")
  .onRun(async () => decreaseUserVentCounter());
exports.cronNotifyQuoteContestWinner = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => notifyQuoteContestWinner());
exports.cronSignPeopleOut = functions.pubsub
  .schedule("0 * * * *")
  .onRun(async () => signPeopleOut());
exports.cronUpdateSitemap = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => createSitemap());

const injectMetaData = (req, res) => {
  const filePath = path.resolve(__dirname, "./build/index.html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    getMetaInformation(req.originalUrl, (metaObj, foundPage, vent) => {
      const { description, keywords, title } = metaObj;

      data = data.replace(
        /Vent online with strangers. VWS is a site where you can make friends and get help on your specific situation all for free. Our site is 100% anonymous./g,
        description
      );
      data = data.replace(
        /vent to someone,vent app,I need to vent,anonymous chat,talk to strangers, chat rooms, chat with strangers/g,
        keywords
      );
      data = data.replace(/Vent and Chat Anonymously With Strangers/g, title);

      res.set("Cache-Control", "public", "max-age=600", "s-maxage=1200");
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
app.post("/subscribe", subscribeToPlan);
app.get("/sitemap.xml", createProxy);
app.get("/sitemapurls.xml", createProxy);

app.get("/", async (req, res) => {
  return injectMetaData(req, res);
});
app.get("*", async (req, res) => {
  return injectMetaData(req, res);
});

exports.app = functions.https.onRequest(app);

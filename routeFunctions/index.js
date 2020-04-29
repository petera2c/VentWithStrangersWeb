const mongoose = require("mongoose");
const s3Proxy = require("s3-proxy");

const tag = require("./tag");
const problem = require("./problem");
const { getBlog, getBlogs, saveBlog } = require("./blog");

const User = require("../models/User");
const Tag = require("../models/Tag");

const { login, randomLogin, register } = require("./user");
const {
  amazonAccessKeyID,
  amazonSecretAccessKey,
  amazonBucket
} = require("../config/keys");

module.exports = app => {
  // Middleware
  const middleware = (req, res, next) => {
    if (!req.user) return randomLogin(req, res, next);
    else next();
  };

  app.get(
    "/sitemap.xml",
    s3Proxy({
      bucket: amazonBucket,
      accessKeyId: amazonAccessKeyID,
      secretAccessKey: amazonSecretAccessKey,
      overrideCacheControl: "max-age=100000",
      defaultKey: "sitemap.xml"
    })
  );

  // Get current user
  app.get("/api/user", middleware, (req, res) => {
    res.send({ success: true, user: req.user, port: process.env.PORT });
  });
  app.post("/api/new-problem", middleware, (req, res) =>
    problem.saveProblem(req, res)
  );

  app.get("/api/tags/trending", middleware, (req, res) =>
    tag.getTrendingTags(req, res)
  );
  app.post("/api/tags/recent/update", middleware, (req, res) =>
    tag.updateRecentTags(req, res)
  );

  app.get("/api/blogs", (req, res) => getBlogs(req, res));
  app.get("/api/blog/:blogID", (req, res) => getBlog(req, res));
  app.post("/api/blog", (req, res) => saveBlog(req, res));

  // Login user
  app.post("/api/login", login);
  // Register user
  app.post("/api/register", register);

  app.get("/api/sign-out", (req, res) => {
    req.session.destroy(err => {
      res.redirect("/");
    });
  });
};

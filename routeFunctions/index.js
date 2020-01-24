const mongoose = require("mongoose");
const problem = require("./problem");
const tag = require("./tag");

const User = require("../models/User");
const Tag = require("../models/Tag");

const { login, randomLogin, register } = require("./user");

module.exports = app => {
  // Middleware
  const middleware = (req, res, next) => {
    if (!req.user) return randomLogin(req, res, next);
    else next();
  };

  // Get current user
  app.get("/api/user", middleware, (req, res, next) => {
    res.send({ success: true, user: req.user, port: process.env.PORT });
  });
  app.post("/api/new-problem", middleware, (req, res) =>
    problem.saveProblem(req, res)
  );

  app.post("/api/problems", middleware, (req, res) =>
    problem.getProblems(req, res)
  );

  app.get("/api/tags/trending", middleware, (req, res) =>
    tag.getTrendingTags(req, res)
  );
  app.post("/api/tags/recent/update", middleware, (req, res) =>
    tag.updateRecentTags(req, res)
  );

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

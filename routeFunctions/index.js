const mongoose = require("mongoose");
const problem = require("./problem");
const tag = require("./tag");
const names = require("./names");

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

  app.post("/api/problems/popular", middleware, (req, res) =>
    problem.getPopularProblems(req, res)
  );
  app.post("/api/problems/recent", middleware, (req, res) =>
    problem.getRecentProblems(req, res)
  );
  app.post("/api/problems/trending", middleware, (req, res) =>
    problem.getTrendingProblems(req, res)
  );

  app.get("/api/tags/trending", middleware, (req, res) =>
    tag.getTrendingTags(req, res)
  );
  app.post("/api/tags/recent/update", middleware, (req, res) =>
    tag.updateRecentTags(req, res)
  );

  app.post("/api/new-comment", middleware, (req, res) =>
    problem.newComment(req, res)
  );
  // Login user
  app.post("/api/login", login);
  // Register user
  app.post("/api/register", register);
};

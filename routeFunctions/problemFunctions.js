const Problem = require("../models/Problem");

const getProblems = (req, res) => {
  Problem.find({}, (err, problems) => {
    if (!err && problems) res.send({ success: true, problems });
    else res.send({ success: false });
  }).sort({ createdAt: -1 });
};
const saveProblem = (req, res) => {
  const newProblem = new Problem(req.body);
  newProblem.author = { id: req.user._id, name: req.user.displayName };
  newProblem.save((err, newProblem) => {
    if (!err && newProblem) res.send({ success: true });
    else res.send({ success: false });
  });
};
module.exports = { getProblems, saveProblem };

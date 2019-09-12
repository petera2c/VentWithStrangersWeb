const Problem = require("../models/Problem");

const getProblems = (req, res) => {
  Problem.find({}, (err, problems) => {
    if (!err && problems) res.send({ success: true, problems });
    else res.send({ success: false });
  }).sort({ createdAt: -1 });
};
const newComment = (req, res) => {
  const { comment, problemID } = req.body;

  Problem.findOne({ _id: problemID }, (err, problem) => {
    problem.comments.push({
      author: { id: req.user._id, name: req.user.displayName },
      text: comment
    });
    problem.save((err, savedProblem) => {
      if (!err && savedProblem)
        res.send({ comments: savedProblem.comments, success: true });
      else res.send({ success: false });
    });
  });
};
const saveProblem = (req, res) => {
  const newProblem = new Problem(req.body);
  newProblem.author = { id: req.user._id, name: req.user.displayName };
  newProblem.save((err, newProblem) => {
    if (!err && newProblem) res.send({ success: true });
    else res.send({ success: false });
  });
};
module.exports = { getProblems, newComment, saveProblem };

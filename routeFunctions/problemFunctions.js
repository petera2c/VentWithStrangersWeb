const Problem = require("../models/Problem");
const User = require("../models/User");

const getComments = (req, res) => {
  const { problemID } = req.body;

  Problem.findOne({ _id: problemID }, { comments: 1 }, (err, problem) => {
    if (problem) res.send({ comments: problem.comments });
    else res.send({ comments: [], success: false });
  });
};

const getProblems = (req, res) => {
  Problem.find({}, (err, problems) => {
    const problemsConvertedToJSON = JSON.parse(JSON.stringify(problems));
    const returnFunction = () => {
      if (!err && problems)
        res.send({ success: true, problems: problemsConvertedToJSON });
      else res.send({ success: false });
    };

    if (problems && problems.length === 0) {
      returnFunction();
    }

    let counter = 0;
    for (let index in problemsConvertedToJSON) {
      counter++;
      User.findOne(
        { _id: problemsConvertedToJSON[index].author.id },
        (err, user) => {
          counter--;
          problemsConvertedToJSON[index].author.name = user.displayName;
          if (counter === 0) returnFunction();
        }
      );
    }
  }).sort({ createdAt: -1 });
};
const newComment = (req, res) => {
  const { comment, problemID } = req.body;

  Problem.findOne({ _id: problemID }, (err, problem) => {
    problem.comments.push({
      author: { id: req.user._id },
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
  newProblem.author = { id: req.user._id };
  newProblem.save((err, newProblem) => {
    if (!err && newProblem) res.send({ success: true });
    else res.send({ success: false });
  });
};
module.exports = { getComments, getProblems, newComment, saveProblem };

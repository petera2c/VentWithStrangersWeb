const Problem = require("../models/Problem");
const User = require("../models/User");
const Tag = require("../models/Tag");

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
  const { description, gender, tags, title } = req.body;

  let counter = 0;
  const tagIDArray = [];
  for (let index in tags) {
    const tag = tags[index].toLowerCase();
    counter++;
    Tag.findOne({ name: tags[index] }, (err, tagFromDB) => {
      counter--;
      if (tagFromDB) {
        tagIDArray.push(tagFromDB._id);

        tagFromDB.uses += 1;
        tagFromDB.save();
      } else {
        const newTag = new Tag({ name: tag, uses: 1 });
        tagIDArray.push(newTag._id);
        newTag.save();
      }
      if (counter === 0) {
        const newProblem = new Problem({
          description,
          gender,
          tags: tagIDArray,
          title
        });
        newProblem.author = { id: req.user._id };
        newProblem.save((err, newProblem) => {
          if (!err && newProblem) res.send({ success: true });
          else res.send({ success: false });
        });
      }
    });
  }
};
module.exports = { getComments, getProblems, newComment, saveProblem };

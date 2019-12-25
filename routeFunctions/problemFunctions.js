const Problem = require("../models/Problem");
const User = require("../models/User");
const Tag = require("../models/Tag");

const addUsersAndTagsToProblems = (callback, problems) => {
  let counter = 0;

  for (let index in problems) {
    counter++;
    User.findOne(
      { _id: problems[index].author.id },
      { displayName: 1 },
      (err, user) => {
        counter--;
        if (!user) return;
        problems[index].author.name = user.displayName;
        if (counter === 0) callback(problems);
      }
    );
  }

  for (let index in problems) {
    const problem = problems[index];

    for (let index2 in problem.tags) {
      const tag = problem.tags[index2];
      counter++;
      Tag.findOne({ name: tag.name }, { name: 1 }, (err, tag) => {
        counter--;
        if (!tag) return;

        problems[index].tags[index2].name = tag.name;
        if (counter === 0) callback(problems);
      });
    }
  }
};
const returnProblemsFunction = (err, problems, res) => {
  if (!err && problems) res.send({ success: true, problems });
  else res.send({ success: false });
};

const getComments = (req, res) => {
  const { problemID } = req.body;

  Problem.findOne({ _id: problemID }, { comments: 1 }, (err, problem) => {
    if (problem) res.send({ comments: problem.comments });
    else res.send({ comments: [], success: false });
  });
};

const getPopularProblems = (req, res) => {
  const { tags = [] } = req.body;

  Problem.find(
    tags.length > 0 ? { "tags.name": tags } : {},
    { comments: 0 },
    (err, problems) => {
      if (problems && problems.length === 0) {
        return returnProblemsFunction(undefined, [], res);
      } else
        return addUsersAndTagsToProblems(
          problems => returnProblemsFunction(err, problems, res),
          problems
        );
    }
  )
    .sort({ upVotes: -1 })
    .limit(10)
    .lean();
};
const getRecentProblems = (req, res) => {
  const { tags = [] } = req.body;

  Problem.find(
    tags.length > 0 ? { "tags.name": tags } : {},
    { comments: 0 },
    (err, problems) => {
      if (problems && problems.length === 0) {
        return returnProblemsFunction(undefined, [], res);
      } else
        return addUsersAndTagsToProblems(
          problems => returnProblemsFunction(err, problems, res),
          problems
        );
    }
  )
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
};
const getTrendingProblems = (req, res) => {
  const { tags = [] } = req.body;

  Problem.find(
    tags.length > 0 ? { "tags.name": tags } : {},
    { comments: 0 },
    (err, problems) => {
      if (problems) {
        if (problems && problems.length === 0) {
          return returnProblemsFunction(undefined, [], res);
        } else
          return addUsersAndTagsToProblems(
            problems => returnProblemsFunction(err, problems, res),
            problems
          );
      } else res.send({ success: false });
    }
  )
    .sort({ dailyUpvotes: -1 })
    .limit(10)
    .lean();
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
  const tagNameArray = [];
  for (let index in tags) {
    const tag = tags[index].toLowerCase();
    counter++;
    Tag.findOne({ name: tags[index] }, (err, tagFromDB) => {
      counter--;
      if (tagFromDB) {
        tagNameArray.push({ name: tagFromDB.name });

        tagFromDB.uses += 1;
        tagFromDB.save();
      } else {
        const newTag = new Tag({ name: tag, uses: 1 });
        tagNameArray.push({ name: newTag.name });
        newTag.save();
      }
      if (counter === 0) {
        const newProblem = new Problem({
          description,
          gender,
          dailyUpvotes: 0,
          tags: tagNameArray,
          title,
          upVotes: 0
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
module.exports = {
  addUsersAndTagsToProblems,
  getComments,
  getPopularProblems,
  getRecentProblems,
  getTrendingProblems,
  newComment,
  saveProblem
};

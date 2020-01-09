const Problem = require("../models/Problem");
const User = require("../models/User");
const Tag = require("../models/Tag");

const getAggregate = (sort, tags, userID) => [
  {
    $match:
      tags.length !== 0
        ? { tags: { $elemMatch: { name: { $all: tags } } } }
        : {}
  },
  {
    $project: {
      authorID: "$authorID",
      commentsSize: { $size: "$comments" },
      createdAt: "$createdAt",
      dailyUpvotes: "$dailyUpvotes",
      description: "$description",
      hasLiked: { $in: [userID, "$upVotes.userID"] },
      tags: "$tags",
      title: "$title",
      upVotes: { $size: "$upVotes" }
    }
  },
  { $sort: sort },
  { $limit: 10 }
];

const addUserToObject = (callback, objects) => {
  let counter = 0;

  for (let index in objects) {
    counter++;
    User.findOne(
      { _id: objects[index].authorID },
      { displayName: 1 },
      (err, user) => {
        counter--;
        if (user) objects[index].author = user.displayName;

        if (counter === 0) callback(objects);
      }
    );
  }
};
const getPopularProblems = (req, res) => {
  const { tags = [] } = req.body;

  Problem.aggregate(
    getAggregate({ upVotes: -1 }, tags, req.user._id),
    (err, problems) => {
      if (problems && problems.length === 0) {
        return returnProblemsFunction(undefined, [], res);
      } else
        return addUserToObject(
          problems => returnProblemsFunction(err, problems, res),
          problems
        );
    }
  );
};
const getRecentProblems = (req, res) => {
  const { tags = [] } = req.body;

  Problem.aggregate(
    getAggregate({ createdAt: -1 }, tags, req.user._id),
    (err, problems) => {
      if (problems && problems.length === 0) {
        return returnProblemsFunction(undefined, [], res);
      } else
        return addUserToObject(
          problems => returnProblemsFunction(err, problems, res),
          problems
        );
    }
  );
};
const getTrendingProblems = (req, res) => {
  const { tags = [] } = req.body;

  Problem.aggregate(
    getAggregate({ dailyUpvotes: -1 }, tags, req.user._id),
    (err, problems) => {
      if (problems) {
        if (problems && problems.length === 0) {
          return returnProblemsFunction(undefined, [], res);
        } else
          return addUserToObject(
            problems => returnProblemsFunction(err, problems, res),
            problems
          );
      } else res.send({ success: false });
    }
  );
};
const likeProblem = (problemID, callback, socket) => {
  const userID = socket.request.user._id;

  Problem.findById(problemID, (err, problem) => {
    if (problem) {
      if (
        problem.upVotes.find(upVote => String(upVote.userID) === String(userID))
      )
        callback({ message: "Already liked post.", success: false });
      else {
        problem.dailyUpvotes += 1;
        problem.upVotes.unshift({ userID });
        problem.save((err, result) => {
          callback({ success: true });
        });
      }
    } else callback({ message: "Problem not found.", success: false });
  });
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

const returnProblemsFunction = (err, problems, res) => {
  if (!err && problems) res.send({ success: true, problems });
  else res.send({ success: false });
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
          title
        });
        newProblem.authorID = req.user._id;
        newProblem.save((err, newProblem) => {
          console.log(err);

          if (!err && newProblem) res.send({ success: true });
          else res.send({ success: false });
        });
      }
    });
  }
};
const searchProblem = (searchPostString, callback) => {
  const doesStringHaveSpaceChar = searchPostString.search(" ");

  if (doesStringHaveSpaceChar === -1) {
    Problem.find(
      { title: { $regex: searchPostString + ".*" } },
      (err, problems) => {
        if (problems && problems.length === 0) {
          return callback([]);
        } else return addUserToObject(problems => callback(problems), problems);
      }
    )
      .limit(10)
      .lean();
  } else {
    Problem.find(
      { $text: { $search: searchPostString } },
      { score: { $meta: "textScore" } },
      (err, problems) => {
        if (problems && problems.length === 0) {
          return callback([]);
        } else return addUserToObject(problems => callback(problems), problems);
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .lean();
  }
};
module.exports = {
  addUserToObject,
  getPopularProblems,
  getRecentProblems,
  getTrendingProblems,
  likeProblem,
  newComment,
  saveProblem,
  searchProblem
};

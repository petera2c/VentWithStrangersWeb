const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const User = require("../models/User");
const Tag = require("../models/Tag");

const project = userID => {
  return {
    $project: {
      authorID: "$authorID",
      commentsSize: { $size: "$comments" },
      createdAt: "$createdAt",
      dailyUpvotes: "$dailyUpvotes",
      description: "$description",
      hasLiked: { $in: [userID, "$upVotes"] },
      tags: "$tags",
      title: "$title",
      upVotes: { $size: "$upVotes" }
    }
  };
};

const getAggregate = (sort, match, userID) => [
  {
    $match: match
  },
  project(userID),
  { $sort: sort },
  { $limit: 10 }
];

const getAggregateSingle = (userID, problemID) => [
  {
    $match: { _id: mongoose.Types.ObjectId(problemID) }
  },
  project(userID)
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
const getProblem = (id, callback, socket) => {
  Problem.aggregate(
    getAggregateSingle(socket.request.user._id, id),
    (err, problems) => {
      if (problems && problems.length !== 0)
        addUserToObject(
          problems => callback({ problems, success: true }),
          problems
        );
      else
        callback({
          message: "Incorrect ID, unable to find a post.",
          success: false
        });
    }
  );
};

const getProblems = (req, res) => {
  const { page, tags = [] } = req.body;
  const match = {};
  const sort = {};

  if (page === "popular") sort.upVotes = -1;
  else if (page === "recent") sort.createdAt = -1;
  else if (page === "trending") sort.dailyUpvotes = -1;

  if (tags.length !== 0) match.tags = { $elemMatch: { name: { $all: tags } } };

  Problem.aggregate(
    getAggregate(sort, match, req.user._id),
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
const getUsersPosts = (dataObj, callback, socket) => {
  const { searchID } = dataObj;

  Problem.aggregate(
    getAggregate(
      { createdAt: -1 },
      { authorID: mongoose.Types.ObjectId(searchID) },
      socket.request.user._id
    ),
    (err, problems) => {
      if (problems) {
        if (problems.length === 0) callback({ problems, success: true });
        else
          addUserToObject(
            problems => callback({ problems, success: true }),
            problems
          );
      } else callback({ message: "Unable to get posts.", success: false });
    }
  );
};

const likeProblem = (problemID, callback, socket) => {
  const userID = socket.request.user._id;

  Problem.findById(problemID, (err, problem) => {
    if (problem) {
      if (
        problem.upVotes.find(
          upVoteUserID => String(upVoteUserID) === String(userID)
        )
      )
        callback({ message: "Already liked post.", success: false });
      else {
        problem.dailyUpvotes += 1;
        problem.upVotes.unshift(userID);
        problem.save((err, result) => {
          callback({ success: true });
        });
      }
    } else callback({ message: "Problem not found.", success: false });
  });
};

const returnProblemsFunction = (err, problems, res) => {
  if (!err && problems) res.send({ problems, success: true });
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
          dailyUpvotes: 0,
          gender,
          tags: tagNameArray,
          title
        });
        newProblem.authorID = req.user._id;
        newProblem.save((err, newProblem) => {
          if (!err && newProblem)
            res.send({ problemID: newProblem._id, success: true });
          else if (err && err.code === 11000)
            res.send({
              message:
                "This title has already been used, please try something different!",
              success: false
            });
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
      { title: { $regex: searchPostString + ".*", $options: "i" } },
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

const unlikeProblem = (problemID, callback, socket) => {
  const userID = socket.request.user._id;

  Problem.findById(problemID, (err, problem) => {
    if (problem) {
      const index = problem.upVotes.findIndex(
        upVoteUserID => String(upVoteUserID) === String(userID)
      );
      if (index >= 0) {
        problem.dailyUpvotes -= 1;
        problem.upVotes.splice(index, 1);
        problem.save((err, result) => {
          callback({ success: true });
        });
      } else callback({ message: "You haven't liked post.", success: false });
    } else callback({ message: "Problem not found.", success: false });
  });
};

module.exports = {
  addUserToObject,
  getProblem,
  getProblems,
  getUsersPosts,
  likeProblem,
  saveProblem,
  searchProblem,
  unlikeProblem
};

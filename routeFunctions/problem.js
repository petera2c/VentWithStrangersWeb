const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const User = require("../models/User");
const Tag = require("../models/Tag");

const { likeVentNotification } = require("./notification");

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
      upVotes: { $size: "$upVotes" },
      wasCreatedByUser: { $eq: ["$authorID", userID] }
    }
  };
};

const getAggregate = (skip, sort, match, userID) => [
  {
    $match: match
  },
  project(userID),
  { $sort: sort },
  { $skip: skip },
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
  if (id && id !== "undefined") {
    Problem.aggregate(
      getAggregateSingle(socket.request.user._id, id),
      (err, problems) => {
        for (let index in problems) {
          socket.join(problems[index]._id);
        }

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
  } else
    callback({
      message: "No id given.",
      success: false
    });
};

const getVents = (callback, dataObj, socket) => {
  const { page, skip = 0, tags = [] } = dataObj;
  const userID = socket.request.user._id;
  const match = {
    $expr: { $not: { $in: [userID, "$reports.userID"] } }
  };
  const sort = {};

  if (page === "popular") sort.upVotes = -1;
  else if (page === "recent") sort.createdAt = -1;
  else {
    sort.dailyUpvotes = -1;
    sort.createdAt = -1;
  }

  if (tags.length !== 0) match.tags = { $elemMatch: { name: { $all: tags } } };

  Problem.aggregate(
    getAggregate(skip, sort, match, userID),
    (err, problems) => {
      if (problems) {
        if (problems && problems.length === 0) {
          return returnProblemsFunction(callback, undefined, []);
        } else {
          for (let index in problems) {
            socket.join(problems[index]._id);
          }

          return addUserToObject(
            problems => returnProblemsFunction(callback, err, problems),
            problems
          );
        }
      } else callback({ success: false });
    }
  );
};

const getUsersPosts = (dataObj, callback, socket) => {
  const { searchID, skip = 0 } = dataObj;

  if (searchID.match(/^[0-9a-fA-F]{24}$/)) {
    const match = { authorID: mongoose.Types.ObjectId(searchID) };

    Problem.aggregate(
      getAggregate(skip, { createdAt: -1 }, match, socket.request.user._id),
      (err, problems) => {
        if (problems) {
          for (let index in problems) {
            socket.join(problems[index]._id);
          }

          if (problems.length === 0) callback({ problems, success: true });
          else
            addUserToObject(
              problems => callback({ problems, success: true }),
              problems
            );
        } else callback({ message: "Unable to get posts.", success: false });
      }
    );
  } else
    return callback({ message: "Invalid ID.", problems: [], success: false });
};

const likeVent = (problemID, callback, socket) => {
  const userID = socket.request.user._id;
  Problem.findById(
    problemID,
    { authorID: 1, dailyUpvotes: 1, title: 1, upVotes: 1 },
    (err, problem) => {
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
          problem.save((err, problem) => {
            socket.to(problem._id).emit(problem._id + "_like", {
              dailyUpvotes: problem.dailyUpvotes,
              hasLiked: undefined,
              upVotes: problem.upVotes.length
            });

            socket.emit(problem._id + "_like", {
              dailyUpvotes: problem.dailyUpvotes,
              hasLiked: true,
              success: true,
              upVotes: problem.upVotes.length
            });

            likeVentNotification(problem, socket);
          });
        }
      } else callback({ message: "Problem not found.", success: false });
    }
  );
};

const reportVent = (dataObj, callback, socket) => {
  const userID = socket.request.user._id;
  const { option, problemID } = dataObj;

  Problem.findById(problemID, { reports: 1 }, (err, problem) => {
    if (problem) {
      if (
        problem.reports.find(report => String(report.userID) === String(userID))
      )
        callback({ message: "Already reported post.", success: false });
      else {
        problem.reports.unshift({ complaint: option, userID });
        problem.save((err, result) => {
          callback({ success: true });
        });
      }
    } else callback({ message: "Problem not found.", success: false });
  });
};

const resetDailyUpvotes = () => {
  Problem.find({}, { dailyUpvotes: 1 }, (err, problems) => {
    for (let index in problems) {
      problems[index].dailyUpvotes = 0;
      problems[index].save();
    }
  });
};

const returnProblemsFunction = (callback, err, problems) => {
  if (!err && problems) callback({ problems, success: true });
  else callback({ success: false });
};

const saveVent = (req, res) => {
  const { description, gender, tags, title } = req.body;

  let counter = 0;
  const tagNameArray = [];

  if (!title) {
    return res.send({
      message: "You forgot to give it a title!",
      success: false
    });
  }
  if (!description) {
    return res.send({
      message: "You forgot to give it a description!",
      success: false
    });
  }
  if (title && title.length > 140) {
    return res.send({
      message: "Title is too long! The title must be less than 140 characters.",
      success: false
    });
  }

  if (
    !title.replace(/\s/g, "").length ||
    !description.replace(/\s/g, "").length
  ) {
    return res.send({
      message: "Your title or description has no content!",
      success: false
    });
  }
  let hasFoundRealTag = false;
  for (let index in tags) {
    const tag = tags[index];
    if (!tag.replace(/\s/g, "").length) continue;
    else {
      hasFoundRealTag = true;
      break;
    }
  }
  if (!hasFoundRealTag) {
    return res.send({
      message: "Your tags have no content!",
      success: false
    });
  }

  const saveNewProblem = (description, gender, tagNameArray, title) => {
    const newProblem = new Problem({
      description,
      dailyUpvotes: 0,
      gender,
      tags: tagNameArray,
      title
    });

    newProblem.authorID = req.user._id;
    newProblem.save((err, newProblem) => {
      if (!err && newProblem) res.send({ problem: newProblem, success: true });
      else if (err && err.code === 11000)
        res.send({
          message:
            "This title has already been used, please try something different!",
          success: false
        });
      else res.send({ success: false });
    });
  };

  if (tags && tags.length > 0)
    for (let index in tags) {
      const tag = tags[index].toLowerCase();
      if (!tag.replace(/\s/g, "").length) continue;

      counter++;
      Tag.findOne({ name: tag }, (err, tagFromDB) => {
        if (tagFromDB) {
          tagNameArray.push({ name: tagFromDB.name });

          tagFromDB.uses += 1;
          tagFromDB.save(() => {
            counter--;
            if (counter === 0)
              saveNewProblem(description, gender, tagNameArray, title);
          });
        } else {
          const newTag = new Tag({ name: tag, uses: 1 });
          tagNameArray.push({ name: newTag.name });
          newTag.save(() => {
            counter--;
            if (counter === 0)
              saveNewProblem(description, gender, tagNameArray, title);
          });
        }
      });
    }
  else saveNewProblem(description, gender, undefined, title);
};
const searchVents = (dataObj, callback) => {
  let { searchPostString = "" } = dataObj;
  const { skip = 0 } = dataObj;

  searchPostString = searchPostString.replace(/%20/g, " ");

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
      .skip(skip)
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

const unlikeVent = (problemID, callback, socket) => {
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
          socket.to(result._id).emit(result._id + "_unlike", {
            dailyUpvotes: result.dailyUpvotes,
            hasLiked: undefined,
            upVotes: result.upVotes.length
          });
          socket.emit(problem._id + "_unlike", {
            dailyUpvotes: result.dailyUpvotes,
            hasLiked: false,
            success: true,
            upVotes: result.upVotes.length
          });
        });
      } else callback({ message: "You haven't liked post.", success: false });
    } else callback({ message: "Problem not found.", success: false });
  });
};

module.exports = {
  addUserToObject,
  getProblem,
  getVents,
  getUsersPosts,
  likeVent,
  reportVent,
  resetDailyUpvotes,
  saveVent,
  searchVents,
  unlikeVent
};

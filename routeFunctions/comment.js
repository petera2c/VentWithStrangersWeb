const Comment = require("../models/Comment");
const Problem = require("../models/Problem");

const { addUserToObject } = require("./problem");

const commentProblem = (commentString, problemID, callback, socket) => {
  const userID = socket.request.user._id;

  const comment = new Comment({
    authorID: userID,
    problemID,
    text: commentString,
    upVotes: 0,
    upVotes: []
  });

  Problem.update(
    { _id: problemID },
    {
      $push: {
        comments: {
          id: comment._id
        }
      }
    },
    (err, saveData) => {
      if (saveData && !err)
        comment.save((err, comment) => {
          callback({ comment, success: true });
        });
      else callback({ success: false });
    }
  );
};

const getProblemComments = (problemID, callback, socket) => {
  const userID = socket.request.user._id;

  Problem.findById(problemID, { comments: 1 }, (err, problem) => {
    let counter = 0;
    let commentList = [];

    Comment.aggregate(
      [
        {
          $match: { problemID: problem._id }
        },
        {
          $project: {
            authorID: "$authorID",
            createdAt: "$createdAt",
            hasLiked: { $in: [userID, "$upVotes.userID"] },
            text: "$text",
            upVotes: { $size: "$upVotes" }
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: 10 }
      ],
      (err, comments) => {
        if (comments && comments.length === 0)
          callback({ success: true, comments });
        else
          addUserToObject(
            comments => callback({ success: true, comments }),
            comments
          );
      }
    );
  });
};
module.exports = { commentProblem, getProblemComments };

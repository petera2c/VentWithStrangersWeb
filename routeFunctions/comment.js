const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Problem = require("../models/Problem");

const { addUserToObject } = require("./problem");

const getAggregate = (match, userID) => [
  {
    $match: match
  },
  {
    $project: {
      authorID: "$authorID",
      createdAt: "$createdAt",
      hasLiked: { $in: [userID, "$upVotes"] },
      text: "$text",
      upVotes: { $size: "$upVotes" }
    }
  },
  { $sort: { createdAt: -1 } },
  { $limit: 10 }
];

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
      getAggregate({ problemID: problem._id }, userID),
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

const getUsersComments = (dataObj, callback, socket) => {
  const { searchID } = dataObj;

  if (searchID.match(/^[0-9a-fA-F]{24}$/))
    Comment.aggregate(
      getAggregate(
        { authorID: mongoose.Types.ObjectId(searchID) },
        socket.request.user._id
      ),
      (err, comments) => {
        if (comments) {
          if (comments.length === 0) callback({ comments, success: true });
          else
            addUserToObject(
              comments => callback({ comments, success: true }),
              comments
            );
        } else callback({ message: "Unable to get posts.", success: false });
      }
    );
  else callback({ comments: [], message: "Invalid ID.", success: false });
};

const likeComment = (dataObj, callback, socket) => {
  const userID = socket.request.user._id;
  const { commentID } = dataObj;

  Comment.findById(commentID, (err, comment) => {
    if (comment) {
      if (
        comment.upVotes.find(
          upVoteUserID => String(upVoteUserID) === String(userID)
        )
      )
        callback({ message: "Already liked comment.", success: false });
      else {
        comment.dailyUpvotes += 1;
        comment.upVotes.unshift(userID);
        comment.save((err, result) => {
          callback({ success: true });
        });
      }
    } else callback({ message: "Comment not found.", success: false });
  });
};

const unlikeComment = (dataObj, callback, socket) => {
  const userID = socket.request.user._id;
  const { commentID } = dataObj;

  Comment.findById(commentID, (err, comment) => {
    if (comment) {
      const index = comment.upVotes.findIndex(
        upVoteUserID => String(upVoteUserID) === String(userID)
      );
      if (index >= 0) {
        comment.dailyUpvotes -= 1;
        comment.upVotes.splice(index, 1);
        comment.save((err, result) => {
          callback({ success: true });
        });
      } else
        callback({
          message: "You haven't liked this comment.",
          success: false
        });
    } else callback({ message: "Comment not found.", success: false });
  });
};

module.exports = {
  commentProblem,
  getProblemComments,
  getUsersComments,
  likeComment,
  unlikeComment
};

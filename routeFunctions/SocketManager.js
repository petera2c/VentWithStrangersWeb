const Conversation = require("../models/Conversation");
const Comment = require("../models/Comment");
const Message = require("../models/Message");
const User = require("../models/User");
const Tag = require("../models/Tag");
const Problem = require("../models/Problem");

const { otherType } = require("./util");

const { addUserToObject } = require("./problemFunctions");

const createConversation = (socket, type, io) => {
  Conversation.findOne({ [type]: undefined }, (err, foundConversation) => {
    if (foundConversation) {
      foundConversation[type] = socket.request.user._id;
      foundConversation.save((err, savedConversation) => {
        if (err) console.log(err);
        else joinConversation(savedConversation, socket, type, io);
      });
    } else {
      new Conversation({ [type]: socket.request.user._id }).save(
        (err, savedConversation) => {
          if (err) console.log(err);
          else joinConversation(savedConversation, socket, type, io);
        }
      );
    }
  });
};
const joinConversation = (conversation, socket, type, io) => {
  emitWaitingConversations(socket);

  socket.leaveAll();
  socket.join(conversation._id);

  User.findOne({ _id: conversation[type] }, (err, user) => {
    User.findOne({ _id: conversation[otherType(type)] }, (err, user2) => {
      if (user) {
        user.conversationID = conversation._id;
        user.save((err, savedUser) => {
          socket.emit("user_joined_chat", {
            chatPartner: user2,
            conversation,
            user: savedUser
          });
          socket
            .to(conversation._id)
            .emit("user_joined_chat", { chatPartner: savedUser, conversation });
        });
      }
    });
  });
};
const emitWaitingConversations = socket => {
  Conversation.find({ venter: undefined }, (err, conversationsWithListener) => {
    Conversation.find(
      { listener: undefined },
      (err, conversationsWithVenter) => {
        socket.emit("users_waiting", {
          conversationsWithListener,
          conversationsWithVenter
        });
        socket.broadcast.emit("users_waiting", {
          conversationsWithListener,
          conversationsWithVenter
        });
      }
    );
  });
};
const leaveChat = socket => {
  Conversation.findOne(
    {
      $or: [
        { venter: socket.request.user._id },
        { listener: socket.request.user._id }
      ]
    },
    (err, conversation) => {
      socket.leaveAll();
      if (conversation)
        conversation.remove((err, result) => emitWaitingConversations(socket));
    }
  );
};

module.exports = io => {
  return socket => {
    socket.on("get_users_waiting", () => emitWaitingConversations(socket));
    socket.on("find_conversation", object => {
      Conversation.findOne(
        {
          $or: [
            { venter: socket.request.user._id },
            { listener: socket.request.user._id }
          ]
        },
        (err, conversation) => {
          if (conversation)
            conversation.remove(() => {
              if (object.type) createConversation(socket, object.type, io);
              else console.log("Something gone wrong!");
            });
          // Make sure to remove any last conversations this user had
          else {
            if (object.type) createConversation(socket, object.type, io);
            else console.log("Something gone wrong!2");
          }
        }
      );
    });

    socket.on("send_message", object => {
      let message = new Message({
        conversationID: object.conversationID,
        body: object.message,
        author: socket.request.user._id
      });
      message.save((err, result) => {
        if (result) {
          socket.to(object.conversationID).emit("receive_message", result);
        }
      });
    });
    socket.on("user_left_chat", () => leaveChat(socket));

    socket.on("disconnect", () => leaveChat(socket));

    socket.on("user_reported", () => {
      // Laugh at snowflakes
    });

    socket.on("something", (tags, fn) => {
      fn(tags);
    });
    socket.on("search_tags", (tag, callback) => {
      Tag.find({ name: { $regex: tag + ".*" } }, (err, tags) =>
        callback(tags)
      ).limit(10);
    });
    socket.on("search_problems", (searchPostString, callback) => {
      const doesStringHaveSpaceChar = searchPostString.search(" ");

      if (doesStringHaveSpaceChar === -1) {
        Problem.find(
          { title: { $regex: searchPostString + ".*" } },
          (err, problems) => {
            if (problems && problems.length === 0) {
              return callback([]);
            } else
              return addUserToObject(problems => callback(problems), problems);
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
            } else
              return addUserToObject(problems => callback(problems), problems);
          }
        )
          .sort({ score: { $meta: "textScore" } })
          .limit(10)
          .lean();
      }
    });
    socket.on("like_problem", (problemID, callback) => {
      const userID = socket.request.user._id;

      Problem.findById(problemID, (err, problem) => {
        if (problem) {
          if (
            problem.upVotes.find(
              upVote => String(upVote.userID) === String(userID)
            )
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
    });

    socket.on("comment_problem", (commentString, problemID, callback) => {
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
    });

    socket.on("get_problem_comments", (problemID, callback) => {
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
            if (comments && comments.length === 0) {
              return callback({ success: false });
            } else
              return addUserToObject(
                comments => callback({ success: true, comments }),
                comments
              );
          }
        );
        /*
        for (let index = 0; index < problem.comments.length; index++) {
          counter++;
          Comment.findById(problem.comments[index].id, (err, comment) => {
            if (comment)
              User.findById(
                comment.authorID,
                { displayName: 1 },
                (err, author) => {
                  comment.author = author;
                  commentList.push(comment);
                  counter--;

                  if (counter === 0) {
                    return callback({ comments: commentList, success: true });
                  }
                }
              );
          }).lean();
        }*/
      });
    });
  };
};

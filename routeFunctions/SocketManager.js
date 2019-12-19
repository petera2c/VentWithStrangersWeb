const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const Tag = require("../models/Tag");
const Problem = require("../models/Problem");

const { otherType } = require("./util");

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
            callback(problems);
          }
        ).limit(10);
      } else {
        Problem.find(
          { $text: { $search: searchPostString } },
          { score: { $meta: "textScore" } },
          (err, problems) => {
            callback(problems);
          }
        )
          .sort({ score: { $meta: "textScore" } })
          .limit(10);
      }
    });
  };
};

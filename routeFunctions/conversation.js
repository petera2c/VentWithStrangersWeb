const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

const { otherType } = require("./util");

const createConversation = (socket, type) => {
  Conversation.findOne({ [type]: undefined }, (err, foundConversation) => {
    if (foundConversation) {
      foundConversation[type] = socket.request.user._id;
      foundConversation.save((err, savedConversation) => {
        if (err) console.log(err);
        else joinConversation(savedConversation, socket, type);
      });
    } else {
      new Conversation({ [type]: socket.request.user._id }).save(
        (err, savedConversation) => {
          if (err) console.log(err);
          else joinConversation(savedConversation, socket, type);
        }
      );
    }
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
const findConversation = (object, socket) => {
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
          if (object.type) createConversation(socket, object.type);
          else console.log("Something gone wrong!");
        });
      // Make sure to remove any last conversations this user had
      else {
        if (object.type) createConversation(socket, object.type);
        else console.log("Something gone wrong!2");
      }
    }
  );
};
const joinConversation = (conversation, socket, type) => {
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
const sendMessage = (object, socket) => {
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
};
module.exports = {
  createConversation,
  emitWaitingConversations,
  findConversation,
  leaveChat,
  sendMessage
};

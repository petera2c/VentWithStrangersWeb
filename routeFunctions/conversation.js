const ChatQueue = require("../models/ChatQueue");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

const { otherType } = require("./util");

const emitWaitingConversations = socket => {
  ChatQueue.countDocuments({ type: "venter" }, (err, venterCount) => {
    ChatQueue.countDocuments({ type: "listener" }, (err, listenerCount) => {
      socket.emit("users_waiting", {
        listenersWaiting: listenerCount,
        ventersWaiting: venterCount
      });
      socket.broadcast.emit("users_waiting", {
        listenersWaiting: listenerCount,
        ventersWaiting: venterCount
      });
    });
  });
};
const findConversation = (object, callback, socket) => {
  const { type } = object;
  const userID = socket.request.user._id;
  let oppositeType = "listener";
  if (type === "listener") oppositeType = "venter";

  ChatQueue.findOne({ type: oppositeType }, (err, chatQueuePerson) => {
    if (chatQueuePerson) {
      chatQueuePerson.remove();
      Conversation.findById(
        chatQueuePerson.conversationID,
        (err, conversation) => {
          conversation[type] = userID;
          conversation.save((err, conversation) => {
            emitWaitingConversations(socket);
            joinRoom(conversation, socket);
          });
        }
      );
    } else {
      new Conversation({ [type]: userID }).save((err, savedConversation) => {
        new ChatQueue({
          conversationID: savedConversation._id,
          type,
          userID
        }).save((err, savedChatQueue) => {
          emitWaitingConversations(socket);
          joinRoom(savedConversation, socket);
        });
      });
    }
  })
    .sort({ createdAt: 1 })
    .limit(1);
};

const joinRoom = (conversation, socket) => {
  socket.leaveAll();
  socket.join(conversation._id);

  socket.emit("user_joined_chat", {
    chatPartner: "chat1DisplayName",
    conversation
  });
  socket.to(conversation._id).emit("user_joined_chat", {
    chatPartner: "chat2DisplayName",
    conversation
  });
};
const leaveChat = socket => {
  socket.leaveAll();
  ChatQueue.find({ userID: socket.request.user._id }, (err, chatQueues) => {
    for (let index in chatQueues) {
      chatQueues[index].remove();
    }
  });
};
const sendMessage = (dataObject, socket) => {
  const { conversationID } = dataObject;
  const userID = socket.request.user._id;
  Conversation.findById(conversationID, (err, conversation) => {
    if (
      conversation &&
      (String(conversation.listener) === String(userID) ||
        String(conversation.venter) === String(userID))
    ) {
      const message = new Message({
        conversationID: conversationID,
        body: dataObject.message,
        authorID: userID
      });
      conversation.messages.push(message._id);
      conversation.save((err, savedConvo) => {});
      message.save((err, result) => {
        if (result) {
          socket.to(conversationID).emit("receive_message", result);
        }
      });
    }
  });
};
module.exports = {
  emitWaitingConversations,
  findConversation,
  leaveChat,
  sendMessage
};

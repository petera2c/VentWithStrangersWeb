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

const findConversation = (dataObj, callback, socket) => {
  const { type } = dataObj;
  const userID = socket.request.user._id;
  let oppositeType = "listener";
  if (type === "listener") oppositeType = "venter";

  ChatQueue.findOne({ type: oppositeType }, (err, chatQueuePerson) => {
    if (chatQueuePerson) {
      chatQueuePerson.remove();
      Conversation.findById(
        chatQueuePerson.conversationID,
        (err, conversation) => {
          User.findById(
            chatQueuePerson.userID,
            { displayName: 1 },
            (err, chatPartner) => {
              if (chatPartner) {
                conversation[type] = userID;
                conversation.save((err, conversation) => {
                  joinRoom(
                    conversation,
                    socket,
                    socket.request.user.displayName,
                    chatPartner.displayName
                  );
                });
              }
            }
          );
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

const getUsersWaiting = callback => {
  ChatQueue.countDocuments({ type: "venter" }, (err, venterCount) => {
    ChatQueue.countDocuments({ type: "listener" }, (err, listenerCount) => {
      callback({
        listenersWaiting: listenerCount,
        ventersWaiting: venterCount
      });
    });
  });
};

const joinRoom = (
  conversation,
  socket,
  myDisplayName,
  chatPartnerDisplayName
) => {
  socket.join(conversation._id);
  emitWaitingConversations(socket);

  socket.emit("user_joined_chat", {
    chatPartner: chatPartnerDisplayName,
    conversation
  });
  socket.to(conversation._id).emit("user_joined_chat", {
    chatPartner: myDisplayName,
    conversation
  });
};

const leaveChat = socket => {
  for (let index in socket.rooms) {
    socket.to(index).emit("user_left");
  }

  ChatQueue.find({ userID: socket.request.user._id }, (err, chatQueues) => {
    for (let index in chatQueues) {
      chatQueues[index].remove(() => {
        emitWaitingConversations(socket);
      });
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
  getUsersWaiting,
  leaveChat,
  sendMessage
};

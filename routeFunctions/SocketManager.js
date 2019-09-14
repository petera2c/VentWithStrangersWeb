const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

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
  socket.leaveAll();
  socket.join(String(conversation._id));
  console.log(conversation._id);

  User.findOne({ _id: conversation[type] }, (err, user) => {
    if (user) {
      user.conversationID = conversation._id;
      user.save((err, savedUser) => {
        console.log(savedUser.conversationID);
        socket.emit("user_joined_chat", { conversation, user: savedUser });
        socket
          .to(String(conversation._id))
          .emit("user_joined_chat", { conversation });
      });
    }
  });
};

module.exports = io => {
  return socket => {
    setInterval(() => {
      Conversation.find(
        { venter: undefined },
        (err, conversationsWithListener) => {
          Conversation.find(
            { listener: undefined },
            (err, conversationsWithVenter) => {
              socket.emit("users_waiting", {
                conversationsWithListener,
                conversationsWithVenter
              });
            }
          );
        }
      );
    }, 5000);

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

    socket.on("disconnect", () => {
      Conversation.findOne(
        {
          $or: [
            { venter: socket.request.user._id },
            { listener: socket.request.user._id }
          ]
        },
        (err, conversation) => {
          socket.leaveAll();
          if (conversation) conversation.remove();
        }
      );
    });

    socket.on("user_reported", () => {
      // Laugh at snowflakes
    });
  };
};

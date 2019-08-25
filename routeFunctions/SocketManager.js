const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

module.exports = socket => {
  let currentConversation;
  socket.on("find_conversation", object => {
    Conversation.findOne({ [object.type]: undefined }, (err, conversation) => {
      if (conversation) {
        conversation.save((err, result) => {
          if (result) {
            currentConversation = result;
            socket.join(result._id);

            socket.broadcast.emit("found_conversation", result);
            socket.emit("found_conversation", result);
          }
        });
      } else {
        let conversation = new Conversation({ [object.type]: "" });
        conversation.save((err, result) => {
          if (result) {
            currentConversation = result;
            socket.join(result._id);
          }
        });
      }
    });
  });

  socket.on("send_message", object => {
    let message = new Message({
      conversationID: object.conversation._id,
      body: object.message,
      author: "object.user._id"
    });
    message.save((err, result) => {
      if (result) {
        socket.broadcast.emit("receive_message", result);
      }
    });
  });

  socket.on("disconnect", () => {
    if (currentConversation) currentConversation.remove();
  });

  socket.on("user_reported", () => {
    // Laugh at snowflakes
  });
};

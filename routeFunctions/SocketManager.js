const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Listener = require("../models/Listener");
const User = require("../models/User");
const Venter = require("../models/Venter");

const deleteVenterAndListener = id => {
  Venter.findOne({ userID: id }, (err, venter) => {
    if (venter) venter.remove();
  });
  Listener.findOne({ userID: id }, (err, listener) => {
    if (listener) listener.remove();
  });
};

const createConversation = (id1, id2) => {
  new Conversation({
    listener: id1,
    venter: id2
  }).save((err, newConversation) => {
    deleteVenterAndListener(id1);
    deleteVenterAndListener(id2);
    User.findOne({ _id: id2 }, (err, foundUser1) => {
      User.findOne({ _id: id1 }, (err, foundUser2) => {
        if (err) {
          console.log(err);
        } else {
          foundUser2.conversationID = newConversation._id;
          foundUser2.save((err, savedUser2) => {
            if (err) {
              console.log(err);
            } else {
              foundUser1.conversationID = newConversation._id;
              foundUser1.save((err, savedUser1) => {
                socket.join(newConversation._id + "conversation");
                socket.emit("found_conversation");
              });
            }
          });
        }
      });
    });
  });
};
const test1 = () => {};

const test2 = () => {};

module.exports = socket => {
  socket.on("find_conversation", object => {
    console.log(object);
    if (object.type === "venter") {
      Listener.findOne({}, (err, listener) => {
        if (listener)
          createConversation(listener.userID, socket.request.user._id, test1);
        else {
          new Venter({ userID: socket.request.user._id }).save(
            (err, listener) => {
              socket.join("venter-waiting");
            }
          );
        }
      });
    } else if (object.type === "listener") {
      Venter.findOne({}, (err, venter) => {
        if (venter)
          createConversation(venter.userID, socket.request.user._id, test2);
        else {
          new Listener({ userID: socket.request.user._id }).save(
            (err, listener) => {
              socket.join("listener-waiting");
            }
          );
        }
      });
    } else {
      console.log("Unknown object type!");
    }
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
    deleteVenterAndListener(socket.request.user._id);
  });

  socket.on("user_reported", () => {
    // Laugh at snowflakes
  });
};

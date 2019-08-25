const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

module.exports = socket => {
	let currentConversation;
	socket.on("find_conversation", function(object) {
		Conversation.findOne({ [object.type]: undefined }, function(err, conversation) {
			if (conversation) {
				conversation[object.type] = object.user._id;
				conversation.save(function(err, result) {
					if (result) {
						currentConversation = result;
						socket.join(result._id);

						socket.broadcast.emit("found_conversation", result);
						socket.emit("found_conversation", result);
					}
				});
			} else {
				let conversation = new Conversation({ [object.type]: object.user._id });
				conversation.save(function(err, result) {
					if (result) {
						currentConversation = result;
						socket.join(result._id);
					}
				});
			}
		});
	});

	socket.on("send_message", function(object) {
		let message = new Message({
			conversationID: object.conversation._id,
			body: object.message,
			author: object.user._id
		});
		message.save(function(err, result) {
			if (result) {
				socket.broadcast.emit("receive_message", result);
			}
		});
	});

	socket.on("disconnect", function() {
		if (currentConversation) currentConversation.remove();
	});

	socket.on("user_reported", function() {
		// Laugh at snowflakes
	});
};

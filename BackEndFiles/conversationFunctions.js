const QueueItem = require("../Models/QueueItem");
const Conversation = require("../Models/Conversation");
const Message = require("../Models/Message");

module.exports = {
	makeConversation: function(req, res) {
		QueueItem.findOne({ type: "listener" }, function(err, queueItem) {
			QueueItem.findOne({ type: "venter" }, function(err, queueItem2) {
				if (queueItem && queueItem2) {
					let conversation = new Conversation({ venter: queueItem2._id, listener: queueItem._id });
					queueItem.remove();
					queueItem2.remove();
					conversation.save();
				}
			});
		});
	},
	getConversation: function(req, res) {
		const { user } = req;
		Conversation.findOne({ [user.type]: user._id }, function(err, conversation) {
			if (conversation) res.send({ success: true, conversation: conversation });
			else res.send({ success: false });
		});
	},
	getConversationMessages: function(req, res) {
		Message.find({ conversationId: req.params.conversationID })
			.select("createdAt body author")
			.sort("createdAt")
			.exec(function(err, messages) {
				if (err) {
					res.send({ error: err });
					return next(err);
				}

				res.status(200).json({ success: true, messages: messages });
			});
	},
	sendMessage: function(req, res) {
		const { message, conversation } = req.body;
		const { user } = req;

		let newMessage = new Message({ conversationId: conversation._id, body: message, author: user._id });
		newMessage.save(function(err, message) {
			if (err) res.send({ success: false, message: err });
			else res.send({ success: true, message: message });
		});
	}
};

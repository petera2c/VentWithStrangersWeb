const QueueItem = require("../Models/QueueItem");
const Conversation = require("../Models/Conversation");

module.exports = {
	addVenterToQueue: function(req, res) {
		let { user } = req;
		let venter = new QueueItem({ _id: user._id, dateCreated: new Date(), type: "venter" });

		Conversation.findOne({ $or: [{ venter: user._id }, { listener: user._id }] }, function(err, conversation) {
			if (conversation) conversation.remove();
		});

		QueueItem.findOne({ _id: user._id }, function(err, queueItem) {
			if (queueItem) {
				queueItem.type = "venter";
				queueItem.save(function(err) {
					if (err) res.send({ success: false });
					else res.send({ success: true });
				});
			} else {
				venter.save(function(err) {
					if (err) res.send({ success: false });
					else res.send({ success: true });
				});
			}
		});
	},
	addListenerToQueue: function(req, res) {
		let { user } = req;
		let listener = new QueueItem({ _id: user._id, dateCreated: new Date(), type: "listener" });

		Conversation.findOne({ $or: [{ venter: user._id }, { listener: user._id }] }, function(err, conversation) {
			if (conversation) conversation.remove();
		});

		QueueItem.findOne({ _id: user._id }, function(err, queueItem) {
			if (queueItem) {
				queueItem.type = "listener";
				queueItem.save(function(err) {
					if (err) res.send({ success: false });
					else res.send({ success: true });
				});
			} else {
				listener.save(function(err) {
					if (err) res.send({ success: false });
					else res.send({ success: true });
				});
			}
		});
	}
};

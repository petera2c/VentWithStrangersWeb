const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
	{
		conversationId: {
			type: Schema.Types.ObjectId,
			required: true
		},
		body: { type: String, require: true },
		author: { type: Schema.Types.ObjectId, require: true }
	},
	{
		timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
	}
);

module.exports = mongoose.model("messages", messageSchema);

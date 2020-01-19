const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    conversationID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    body: { type: String, require: true },
    authorID: { type: Schema.Types.ObjectId, require: true }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("messages", messageSchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    listener: { type: Schema.Types.ObjectId },
    messages: [{ type: Schema.Types.ObjectId }],
    venter: { type: Schema.Types.ObjectId }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("conversations", conversationSchema);

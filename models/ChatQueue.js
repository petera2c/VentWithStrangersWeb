const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatQueue = new Schema(
  {
    conversationID: {
      require: true,
      type: Schema.Types.ObjectId,
      unique: true
    },
    type: {
      require: true,
      type: String
    },
    userID: { require: true, type: Schema.Types.ObjectId, unique: true }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);
chatQueue.index({ createdAt: 1 });

module.exports = mongoose.model("chatQueue", chatQueue);

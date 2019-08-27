const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    venter: { type: Schema.Types.ObjectId, unique: true },
    listener: { type: Schema.Types.ObjectId, unique: true }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("conversations", conversationSchema);

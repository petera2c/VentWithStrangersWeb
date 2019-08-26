const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    venter: { required: true, type: Schema.Types.ObjectId },
    listener: { required: true, type: Schema.Types.ObjectId }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("conversations", conversationSchema);

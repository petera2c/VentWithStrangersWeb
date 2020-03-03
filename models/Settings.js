const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingsSchema = new Schema(
  {
    adultContent: { required: true, type: Boolean },
    commentLiked: { required: true, type: Boolean },
    postCommented: { required: true, type: Boolean },
    postLiked: { required: true, type: Boolean },
    receiveEmails: { required: true, type: Boolean },
    userID: { type: Schema.Types.ObjectId, unique: true }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("settings", settingsSchema);

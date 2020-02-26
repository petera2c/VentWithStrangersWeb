const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    hasSeen: { required: true, type: Boolean },
    senderID: { required: true, type: Schema.Types.ObjectId },
    type: { required: true, type: String },
    userID: { required: true, type: Schema.Types.ObjectId }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("notifications", notificationSchema);

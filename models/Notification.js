const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    commentTypeID: { required: true, type: Number },
    hasSeen: { required: true, type: Boolean },
    senderID: { required: true, type: Schema.Types.ObjectId },
    receiverID: { required: true, type: Schema.Types.ObjectId }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);
notificationSchema.index({ receiverID: -1 });

module.exports = mongoose.model("notifications", notificationSchema);

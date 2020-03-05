const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    body: { required: true, type: String },
    hasSeen: { required: true, type: Boolean },
    link: { required: true, type: String },
    objectID: { required: true, type: Schema.Types.ObjectId },
    receiverID: { required: true, type: Schema.Types.ObjectId },
    senderID: { required: true, type: Schema.Types.ObjectId },
    title: { required: true, type: String },
    type: { required: true, type: Number }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);
notificationSchema.index({ receiverID: -1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("notifications", notificationSchema);

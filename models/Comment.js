const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    authorID: { require: true, type: Schema.Types.ObjectId },
    problemID: {
      required: true,
      type: Schema.Types.ObjectId
    },
    reports: [
      {
        complaint: { required: true, type: Number },
        userID: { required: true, type: Schema.Types.ObjectId }
      }
    ],
    text: { require: true, type: String },
    upVotes: [{ type: Schema.Types.ObjectId }]
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);
commentSchema.index({ authorID: -1, problemID: -1 });

module.exports = mongoose.model("comments", commentSchema);

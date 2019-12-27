const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    authorID: { require: true, type: Schema.Types.ObjectId },
    problemID: {
      required: true,
      type: Schema.Types.ObjectId
    },
    text: { require: true, type: String },
    upVotes: { require: true, type: Number },
    upVotes: [{ userID: { type: Schema.Types.ObjectId } }]
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("comments", commentSchema);

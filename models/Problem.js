const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const problemSchema = new Schema(
  {
    authorID: {
      require: true,
      type: Schema.Types.ObjectId
    },
    comments: [
      {
        id: {
          require: true,
          type: Schema.Types.ObjectId
        }
      },
      {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
      }
    ],
    dailyUpvotes: { require: true, type: Number },
    description: { require: true, type: String },
    tags: [{ name: { type: String } }],
    title: { require: true, type: String },
    upVotes: [{ userID: { type: Schema.Types.ObjectId } }]
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);
problemSchema.index({ title: "text" });

module.exports = mongoose.model("problems", problemSchema);

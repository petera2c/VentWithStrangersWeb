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
    gender: Number,
    reports: [
      {
        complaint: { required: true, type: Number },
        userID: { required: true, type: Schema.Types.ObjectId }
      }
    ],
    tags: [{ name: { type: String } }],
    title: { require: true, type: String, unique: true },
    upVotes: [{ type: Schema.Types.ObjectId }]
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);
problemSchema.index({ title: "text" });
problemSchema.index({ authorID: -1 });

module.exports = mongoose.model("problems", problemSchema);

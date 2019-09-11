const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const problemSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, require: true },
    comments: [
      {
        author: {
          require: true,
          text: { require: true, type: String },
          type: Schema.Types.ObjectId
        }
      }
    ],
    description: { require: true, type: String },
    title: { require: true, type: String }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("problems", problemSchema);

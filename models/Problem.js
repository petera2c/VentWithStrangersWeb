const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const problemSchema = new Schema(
  {
    author: {
      id: { require: true, type: Schema.Types.ObjectId }
    },
    comments: [
      {
        author: {
          id: { require: true, type: Schema.Types.ObjectId }
        },
        text: { require: true, type: String }
      },
      {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
      }
    ],
    description: { require: true, type: String },
    gender: { require: true, type: Number },
    tags: [{ id: { type: Schema.Types.ObjectId } }],
    title: { require: true, type: String }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("problems", problemSchema);

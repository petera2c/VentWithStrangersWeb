const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    name: { require: true, type: String },
    uses: { require: true, type: Number }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("tags", tagSchema);

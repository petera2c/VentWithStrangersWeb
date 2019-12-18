const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    name: { index: true, require: true, type: String, unique: true },
    uses: { require: true, type: Number }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

tagSchema.index({ name: "text" });

module.exports = mongoose.model("tags", tagSchema);

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listenerSchema = new Schema(
  {
    userID: { require: true, type: Schema.Types.ObjectId }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("listeners", listenerSchema);

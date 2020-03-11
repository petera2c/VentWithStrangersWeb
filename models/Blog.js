const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var contentSchema = new Schema({
  html: {
    type: String,
    required: true
  },
  location: {
    type: Number,
    required: true
  },
  link: String
});
var imageSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  publicID: {
    type: String,
    required: true
  },
  size: String,
  location: Number,
  alt: String
});

const blogSchema = new Schema(
  {
    authorID: {
      type: Number
    },
    category: Number,
    contentArray: [contentSchema],
    images: [imageSchema],
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("blogs", blogSchema);

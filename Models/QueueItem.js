const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const queueSchema = new Schema({
	dateCreated: Date,
	type: String
});

module.exports = mongoose.model("queueitems", queueSchema);

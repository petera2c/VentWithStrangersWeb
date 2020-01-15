const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    displayName: { required: true, type: String },
    email: { sparse: true, type: String, unique: true },
    language: String,
    password: { type: String },
    recentTags: [{ name: String }],
    settingsID: { require: true, type: Schema.Types.ObjectId, unique: true },
    timezone: String
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

userSchema.methods.generateHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

userSchema.methods.validPassword = password =>
  bcrypt.compareSync(password, this.password);

module.exports = mongoose.model("users", userSchema);

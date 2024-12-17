/* coded by Danielle Wahrhaftig */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isFaculty: { type: Boolean, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);

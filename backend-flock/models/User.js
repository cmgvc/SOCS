const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  faculty: { type: Boolean, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[\w-\.]+@mail\.mcgill\.ca$/, "Invalid McGill email"], // Regex for McGill email, only emails with @mail.mcgill.ca are accepted
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);

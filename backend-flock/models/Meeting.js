const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
  faculty: { type: String, required: true },
  participants: { type: Array, required: true },
  status: { type: String, required: true },
  meetingType : { type: String, required: true },
  time: { type: String, required: true }
});

module.exports = mongoose.model("Meeting", meetingSchema);

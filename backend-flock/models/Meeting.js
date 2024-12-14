const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  date: { type: Date, required: true },
  faculty: { type: String, required: true },
  participants: { type: Array, required: true },
});

module.exports = mongoose.model("Meeting", meetingSchema);

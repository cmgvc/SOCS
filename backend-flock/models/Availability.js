const mongoose = require("mongoose");

const TimeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true }, // e.g., "9:00 AM"
  end: { type: String, required: true }, // e.g., "10:00 AM"
});

const availabilitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  email: { type: String, required: true },
  meetingType: { type: String, required: true },
  meetingDuration: { type: String, required: true },
  doesRepeatWeekly: { type: Boolean, required: true },
  availabilityData: {
    Sun: [TimeSlotSchema],
    Mon: [TimeSlotSchema],
    Tue: [TimeSlotSchema],
    Wed: [TimeSlotSchema],
    Thu: [TimeSlotSchema],
    Fri: [TimeSlotSchema],
    Sat: [TimeSlotSchema],
  },
  windowDaysAdvance: { type: Number, required: true },
  windowTimeBefore: { type: Number, required: true },
  bookingUrl: { type: String, required: true }, // Unique URL for booking
});

module.exports = mongoose.model("Availability", availabilitySchema);

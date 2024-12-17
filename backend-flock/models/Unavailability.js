// Emily Roest, 260960015
const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // "HH:mm"
  endTime: { type: String, required: true }, 
});

const UnavailabilitySchema = new mongoose.Schema({
  facultyEmail: { type: String, required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  timeSlots: {
    type: [TimeSlotSchema],
    required: true,
  },
});

const Unavailability = mongoose.model('Unavailability', UnavailabilitySchema);

module.exports = Unavailability;

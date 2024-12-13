const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    date: { type: Date, required: true },
    faculty: { type: String, required: true },
    participants: { type: Array, required: true },
});

const Meeting = mongoose.model("Meeting", meetingSchema, "meetings");

module.exports = Meeting;
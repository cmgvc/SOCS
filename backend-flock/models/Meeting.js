const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    BookingId: { type: String, required: true },
    Title: { type: String, required: true },
    Duration: { type: String, required: true },
    Date: { type: Date, required: true },
    Faculty: { type: String, required: true },
    Participants: { type: Array, required: true },
});

module.exports = mongoose.model('Meeting', meetingSchema);
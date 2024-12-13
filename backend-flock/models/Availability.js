const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    facultyEmail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    generalAvailability: [
    {
        dayOfWeek: {
            type: String, 
            required: true,
        },
        startTime: {
            type: String, 
            required: true,
        },
        endTime: {
            type: String, 
            required: true,
        },
    },],
    schedulingWindow: {
        start: {
            type: Number,
            required: true,
        },
        end: {
            type: Number,
            required: true,
        },
    },
    url: {
        type: String,
        required: true,
    },
});

const Availability = mongoose.model("Availability", availabilitySchema, "availabilities");
module.exports = Availability;
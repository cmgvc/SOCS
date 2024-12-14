// Chloe Gavrilovic 260955835
const express = require("express");
const Availability = require("../models/Availability");

const router = express.Router();

// get all meetings for a faculty member
router.post("/", async (req, res) => {
    try {
        const facultyEmail = req.body.email;
        const meetings = await Availability.find({ email: facultyEmail });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get meeting by url
router.get('/url', async (req, res) => {
    const { url } = req.query;
    try {
        const meeting = await Availability.find({ bookingUrl: url });
        if (meeting) {
            res.json(meeting);
        } else {
            res.status(404).json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
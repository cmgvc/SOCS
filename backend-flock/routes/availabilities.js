// Chloe Gavrilovic 260955835
const express = require("express");
const Availability = require("../models/Availability");

const router = express.Router();

// get all meetings for a faculty member
router.post("/", async (req, res) => {
    try {
        const facultyEmail = req.body.email;
        const meetings = await Availability.find({ facultyEmail: facultyEmail });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
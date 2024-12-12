const express = require("express");
const Meeting = require("../models/Meeting");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const userEmail = req.body.email;
        const meetings = await Meeting.find({ Participants: { $in: [userEmail] } });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
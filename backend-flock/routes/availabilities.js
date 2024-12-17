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
router.post('/url', async (req, res) => {
    const { url } = req.body;
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

router.delete('/cancel', async (req, res) => {
    const { _id } = req.body; 
  
    try {
      const availability = await Availability.findById(_id);
  
      if (!availability) {
        return res.status(404).json({ message: "Availability not found" });
      }
      await Availability.findByIdAndDelete(_id);
  
      res.json({ success: true, message: "Availability canceled" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
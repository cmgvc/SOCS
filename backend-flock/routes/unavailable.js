const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Mongoose schema and model
const UnavailabilitySchema = new mongoose.Schema({
  date: { type: String, required: true }, // "YYYY-MM-DD"
  startHour: { type: Number, required: true },
  endHour: { type: Number, required: true }
});

const Unavailability = mongoose.model('Unavailability', UnavailabilitySchema);

// POST /api/save-unavailabilities
router.post("/save-unavailabilities", async (req, res) => {
  const { unavailableBlocks } = req.body;
  
  if (!unavailableBlocks || !Array.isArray(unavailableBlocks)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    // For simplicity, clear old data and insert new unavailabilities
    await Unavailability.deleteMany({});
    await Unavailability.insertMany(unavailableBlocks);
    return res.status(200).json({ message: 'Unavailabilities saved successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save unavailabilities' });
  }
});

module.exports = router;

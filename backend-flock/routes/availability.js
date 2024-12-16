/* coded by Danielle Wahrhaftig */
const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");

const generateBookingUrl = (email) => {
  const uniqueToken = crypto.randomBytes(6).toString("hex");
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return `${baseUrl}/booking/${encodeURIComponent(email)}/${uniqueToken}`;
};

router.post("/save", async (req, res) => {
  try {
    const {
      title,
      email,
      meetingType,
      meetingDuration,
      doesRepeatWeekly,
      availabilityData,
      windowDaysAdvance,
      windowTimeBefore,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !email ||
      !meetingType ||
      !meetingDuration ||
      doesRepeatWeekly === undefined ||
      !availabilityData
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for duplicates
    const existingAvailability = await Availability.findOne({
      email,
      title,
      meetingType,
    });

    if (existingAvailability) {
      return res.status(409).json({
        message: "A similar availability already exists.",
        existingAvailability,
      });
    }

    // Generate booking URL
    const bookingUrl = generateBookingUrl(email);

    // Create new availability document
    const newAvailability = new Availability({
      title,
      email,
      meetingType,
      meetingDuration,
      doesRepeatWeekly,
      availabilityData, // Save transformed data here
      windowDaysAdvance,
      windowTimeBefore,
      bookingUrl,
    });

    // Save to the database
    const savedAvailability = await newAvailability.save();

    res.status(201).json({
      message: "Availability saved successfully!",
      bookingUrl,
      savedAvailability,
    });
  } catch (error) {
    console.error("Error saving availability:", error);
    res.status(500).json({ message: "Error saving availability", error });
  }
});

module.exports = router;

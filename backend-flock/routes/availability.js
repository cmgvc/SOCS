const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");

const generateBookingUrl = (email) => {
  const uniqueToken = crypto.randomBytes(6).toString("hex");
  const domainUrl = process.env.domainUrl || "http://localhost:3000";
  return `${domainUrl}/booking/${encodeURIComponent(email)}/${uniqueToken}`;
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

    // Validate availabilityData format
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const isValidAvailabilityData = daysOfWeek.every((day) =>
      Array.isArray(availabilityData[day])
    );

    if (!isValidAvailabilityData) {
      return res
        .status(400)
        .json({ message: "Invalid format for availabilityData" });
    }

    // Generate the booking URL
    const bookingUrl = generateBookingUrl(email);

    // Create the new availability document
    const newAvailability = new Availability({
      title,
      email,
      meetingType,
      meetingDuration,
      doesRepeatWeekly,
      availabilityData,
      windowDaysAdvance,
      windowTimeBefore,
      bookingUrl,
    });

    // Save to the database
    const savedAvailability = await newAvailability.save();

    // Respond with success
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

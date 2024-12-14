const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");

const generateBookingUrl = (email) => {
  const uniqueToken = crypto.randomBytes(6).toString("hex");
  domainUrl = process.env.domainUrl || "http://localhost:3000";
  return `${domainUrl}/booking/${encodeURIComponent(email)}/${uniqueToken}`;
};

router.post("/save", async (req, res) => {
  console.log("Request received:", req.body);
  const {
    email,
    title,
    meetingType,
    meetingDuration,
    doesRepeatWeekly,
    availabilityData,
    windowDaysAdvance,
    windowTimeBefore,
  } = req.body;

  try {
    const bookingUrl = generateBookingUrl(email);
    const newAvailability = new Availability({
      email,
      title,
      meetingType,
      meetingDuration,
      doesRepeatWeekly,
      availabilityData,
      windowDaysAdvance,
      windowTimeBefore,
      bookingUrl,
    });

    const savedAvailability = await newAvailability.save();

    res.status(201).json({ message: "Availability saved!", bookingUrl });
  } catch (error) {
    res.status(500).json({ message: "Error saving availability", error });
  }
});

module.exports = router;

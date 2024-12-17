// Emily Roest, 260960015
const express = require("express");
const router = express.Router();
const Unavailability = require("../models/Unavailability");

// define helper functions

// converts a string in hh:mm format to total minutes
function timeToMinutes(t) {
  const [h,m] = t.split(':').map(Number);
  return h*60+m;
}

// reverse - converts total minutes back to hh:mm string format
function minutesToTime(m) {
  const hh = String(Math.floor(m/60)).padStart(2, '0');
  const mm = String(m%60).padStart(2, '0');
  return `${hh}:${mm}`;
}

// function to merge overlapping time intervals in a list of time slots
function mergeTimeSlots(timeSlots) {
  if (!timeSlots.length) return [];

  // convert to minutes and sort by start time
  let intervals = timeSlots.map(ts => ({
    start: timeToMinutes(ts.startTime),
    end: timeToMinutes(ts.endTime)
  }));
  intervals.sort((a,b) => a.start - b.start);

  const merged = [];
  let current = intervals[0];

  // merge logic
  for (let i=1; i<intervals.length; i++) {
    const next = intervals[i];
    if (next.start <= current.end) {
      current.end = Math.max(current.end, next.end);
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  // convert back to hh:mm for display
  return merged.map(interval => ({
    startTime: minutesToTime(interval.start),
    endTime: minutesToTime(interval.end)
  }));
}

// groups and merges time slots by day per faculty member - uses email and date
function mergeBlocksByDay(blocks) {
  const grouped = {};
  blocks.forEach(b => {
    const key = `${b.facultyEmail}-${b.date}`;
    if (!grouped[key]) {
      grouped[key] = { facultyEmail: b.facultyEmail, date: b.date, timeSlots: [] };
    }
    grouped[key].timeSlots.push(...b.timeSlots);
  });

  const mergedBlocks = Object.values(grouped).map(entry => {
    const mergedSlots = mergeTimeSlots(entry.timeSlots);
    return { facultyEmail: entry.facultyEmail, date: entry.date, timeSlots: mergedSlots };
  });

  return mergedBlocks;
}

// save unavailable blocks to db - post logic
router.post("/", async (req, res) => {
  const { facultyEmail, unavailableBlocks } = req.body;

  if (!facultyEmail) {
    return res.status(400).json({ error: 'Faculty email is required' });
  }

  if (!unavailableBlocks || !Array.isArray(unavailableBlocks)) {
    return res.status(400).json({ error: 'Invalid data: unavailableBlocks must be an array' });
  }

  const blocksWithEmail = unavailableBlocks.map(entry => ({
    ...entry,
    facultyEmail
  }));

  const cleanedBlocks = mergeBlocksByDay(blocksWithEmail);

  try {
    await Unavailability.deleteMany({ facultyEmail });
    await Unavailability.insertMany(cleanedBlocks);
    return res.status(200).json({ message: 'Unavailabilities saved successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save unavailabilities' });
  }
});

// prepopulate the page with existing blocked times
router.get("/", async (req, res) => {
  const { facultyEmail } = req.query;

  if (!facultyEmail) {
    return res.status(400).json({ error: "Faculty email is required" });
  }

  try {
    const unavailabilities = await Unavailability.find({ facultyEmail });
    return res.status(200).json({ unavailabilities });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch unavailabilities" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Unavailability = require("../models/Unavailability");

function timeToMinutes(t) {
  const [h,m] = t.split(':').map(Number);
  return h*60+m;
}

function minutesToTime(m) {
  const hh = String(Math.floor(m/60)).padStart(2, '0');
  const mm = String(m%60).padStart(2, '0');
  return `${hh}:${mm}`;
}

function mergeTimeSlots(timeSlots) {
  // timeSlots is array of {startTime, endTime}
  if (!timeSlots.length) return [];

  // Convert to minutes and sort by start
  let intervals = timeSlots.map(ts => ({
    start: timeToMinutes(ts.startTime),
    end: timeToMinutes(ts.endTime)
  }));
  intervals.sort((a,b) => a.start - b.start);

  const merged = [];
  let current = intervals[0];

  for (let i=1; i<intervals.length; i++) {
    const next = intervals[i];
    if (next.start <= current.end) {
      // Overlap or contiguous: merge
      current.end = Math.max(current.end, next.end);
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  // Convert back to {startTime, endTime}
  return merged.map(interval => ({
    startTime: minutesToTime(interval.start),
    endTime: minutesToTime(interval.end)
  }));
}

function mergeBlocksByDay(blocks) {
  // blocks is array of {facultyEmail, date, timeSlots: [...]}
  // Group by date
  const grouped = {};
  blocks.forEach(b => {
    const key = `${b.facultyEmail}-${b.date}`;
    if (!grouped[key]) {
      grouped[key] = { facultyEmail: b.facultyEmail, date: b.date, timeSlots: [] };
    }
    grouped[key].timeSlots.push(...b.timeSlots);
  });

  // Merge each day's timeSlots
  const mergedBlocks = Object.values(grouped).map(entry => {
    const mergedSlots = mergeTimeSlots(entry.timeSlots);
    return { facultyEmail: entry.facultyEmail, date: entry.date, timeSlots: mergedSlots };
  });

  return mergedBlocks;
}

router.post("/", async (req, res) => {
  const { facultyEmail, unavailableBlocks } = req.body;

  if (!facultyEmail) {
    return res.status(400).json({ error: 'Faculty email is required' });
  }

  if (!unavailableBlocks || !Array.isArray(unavailableBlocks)) {
    return res.status(400).json({ error: 'Invalid data: unavailableBlocks must be an array' });
  }

  // Ensure every entry has facultyEmail
  const blocksWithEmail = unavailableBlocks.map(entry => ({
    ...entry,
    facultyEmail
  }));

  // Merge any overlapping or duplicate times before saving
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

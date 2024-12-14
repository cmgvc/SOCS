import React, { useMemo, useState } from "react";
import "../styles/BlockPanel.css";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Generate time options in 5-minute increments from 08:00 to 19:00
function generateTimeOptions() {
  const options = [];
  const startH = 8;
  const endH = 19;
  for (let h = startH; h <= endH; h++) {
    for (let m = 0; m < 60; m += 5) {
      if (h === endH && m > 0) break; // don't go past 19:00
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      options.push(`${hh}:${mm}`);
    }
  }
  return options;
}

const timeOptions = generateTimeOptions();

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
  if (!timeSlots.length) return [];
  let intervals = timeSlots.map(ts => ({
    start: timeToMinutes(ts.startTime),
    end: timeToMinutes(ts.endTime),
  }));
  intervals.sort((a,b) => a.start - b.start);

  const merged = [];
  let current = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    if (next.start <= current.end) {
      current.end = Math.max(current.end, next.end);
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  return merged.map(intv => ({
    startTime: minutesToTime(intv.start),
    endTime: minutesToTime(intv.end)
  }));
}

const BlockOffTimesPanel = ({ mode, onModeChange, unavailableBlocks, onBlocksChange, weekDates }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const unavailabilities = useMemo(() => {
    return weekDates.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const entry = unavailableBlocks.find((b) => b.date === dateStr);
      return { date, timeSlots: entry ? entry.timeSlots : [] };
    });
  }, [unavailableBlocks, weekDates]);

  const handleSetAvailable = () => onModeChange("available");
  const handleSetUnavailable = () => onModeChange("unavailable");

  const handleAddUnavailability = (e) => {
    e.preventDefault();
    const dateObj = weekDates[selectedDayIndex];
    const dateStr = dateObj.toISOString().split("T")[0];

    if (endTime <= startTime) {
      alert("End time must be after start time");
      return;
    }

    let updated = [...unavailableBlocks];
    const dateIndex = updated.findIndex((block) => block.date === dateStr);
    const newTimeSlot = { startTime, endTime };

    if (dateIndex > -1) {
      // Check for exact duplicate
      const duplicate = updated[dateIndex].timeSlots.find(
        ts => ts.startTime === startTime && ts.endTime === endTime
      );
      if (duplicate) {
        alert("This exact time block already exists.");
        return;
      }

      updated[dateIndex].timeSlots.push(newTimeSlot);
      // Merge after adding
      updated[dateIndex].timeSlots = mergeTimeSlots(updated[dateIndex].timeSlots);
    } else {
      updated.push({
        date: dateStr,
        timeSlots: [newTimeSlot],
      });
    }

    onBlocksChange(undefined, updated);
  };

  const handleDeleteUnavailability = (dateStr, tsToDelete) => {
    let updated = [...unavailableBlocks];
    const dateIndex = updated.findIndex((block) => block.date === dateStr);
    if (dateIndex > -1) {
      updated[dateIndex].timeSlots = updated[dateIndex].timeSlots.filter(
        (ts) => !(ts.startTime === tsToDelete.startTime && ts.endTime === tsToDelete.endTime)
      );
      if (updated[dateIndex].timeSlots.length === 0) {
        updated.splice(dateIndex, 1);
      }
    }
    onBlocksChange(undefined, updated);
  };

  const handleSaveToDatabase = async () => {
    try {
      const facultyEmail = localStorage.getItem("email");
      if (!facultyEmail) {
        console.error("No faculty email found in local storage.");
        return;
      }

      const response = await fetch("http://localhost:5001/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facultyEmail, unavailableBlocks }),
      });
      if (response.ok) {
        console.log("Unavailabilities saved successfully!");
      } else {
        console.error("Failed to save unavailabilities.");
      }
    } catch (err) {
      console.error("Error saving unavailabilities:", err);
    }
  };

  return (
    <div className="block-off-panel">
      <h3 className="panel-title">Block Off Times</h3>
      <hr className="panel-divider" />
      <p className="panel-description">
        Select any time you are not free, so that students cannot request a meeting with you at that time.
      </p>
      <hr className="panel-divider" />

      <h4 className="sub-title">Unavailabilities</h4>
      <h5 className="description">Set when you are unavailable for meetings.</h5>

      <div className="set-buttons">
        <button className="set-available" onClick={handleSetAvailable}>
          Set Available
        </button>
        <button className="set-unavailable" onClick={handleSetUnavailable}>
          Set Unavailable
        </button>
      </div>

      <button className="repeat-weekly-toggle">Repeat weekly</button>

      <form onSubmit={handleAddUnavailability} style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
            Day:
            <select value={selectedDayIndex} onChange={(e) => setSelectedDayIndex(Number(e.target.value))}>
              {weekDates.map((d, i) => (
                <option key={i} value={i}>
                  {dayNames[d.getDay()]} {d.getDate()}
                </option>
              ))}
            </select>
          </label>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: "normal" }}>Start Time:</label>
            <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
              {timeOptions.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: "normal" }}>End Time:</label>
            <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
              {timeOptions.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="save-btn">
          Add Unavailability
        </button>
      </form>

      <div className="unavailabilities-list">
        {unavailabilities.map((dayData, i) => {
          const dateObj = dayData.date;
          const timeSlots = dayData.timeSlots;
          const dayName = dayNames[new Date(dateObj).getDay()];
          const dayDate = new Date(dateObj).getDate();

          return (
            <div key={i} className="day-row">
              <div className="day-label">
                {dayName} {dayDate}
              </div>
              <div className="day-blocks">
                {timeSlots.length === 0 ? (
                  <span className="available-label">Available</span>
                ) : (
                  timeSlots.map((ts, index) => (
                    <div key={index} className="time-block" style={{ position: "relative" }}>
                      {ts.startTime} - {ts.endTime}
                      <button
                        className="icon-button"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleDeleteUnavailability(dayData.date.toISOString().split("T")[0], ts)}
                        title="Delete this unavailability"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <button className="save-btn" onClick={handleSaveToDatabase}>
          Save to Database
        </button>
      </div>
    </div>
  );
};

export default BlockOffTimesPanel;

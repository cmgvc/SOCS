// Emily Roest, 260960015
import React, { useMemo, useState } from "react";
import "../styles/BlockPanel.css";
import { v4 as uuidv4 } from "uuid";

// define constants
const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// generate times
function generateTimeOptions() {
  const options = [];
  const startH = 8;
  const endH = 19;
  for (let h = startH; h <= endH; h++) {
    for (let m = 0; m < 60; m += 5) {
      if (h === endH && m > 0) break;
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      options.push(`${hh}:${mm}`);
    }
  }
  return options;
}

const timeOptions = generateTimeOptions();
const backendUrl = "http://localhost:5001";

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m) {
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

// merge logic
function mergeTimeSlots(timeSlots) {
  if (!timeSlots.length) return [];
  let intervals = timeSlots.map((ts) => ({
    start: timeToMinutes(ts.startTime),
    end: timeToMinutes(ts.endTime),
    repeatWeekly: ts.repeatWeekly || false,
    recurringId: ts.recurringId || null,
  }));
  intervals.sort((a, b) => a.start - b.start);

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

  return merged.map((intv) => ({
    startTime: minutesToTime(intv.start),
    endTime: minutesToTime(intv.end),
    repeatWeekly: intv.repeatWeekly,
    recurringId: intv.recurringId,
  }));
}

// time formatting
function formatTime24to12(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  const minuteStr = m.toString().padStart(2, "0");
  return `${hour12}:${minuteStr} ${suffix}`;
}

// panel logic
const BlockOffTimesPanel = ({
  mode,
  onModeChange,
  unavailableBlocks,
  onBlocksChange,
  weekDates,
  onJumpToDate,
}) => {
  const [inlineAddTimes, setInlineAddTimes] = useState({});
  const [jumpDate, setJumpDate] = useState("");

  const unavailabilities = useMemo(() => {
    return weekDates.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const entry = unavailableBlocks.find((b) => b.date === dateStr);
      return { date, timeSlots: entry ? entry.timeSlots : [] };
    });
  }, [unavailableBlocks, weekDates]);

  // block for specific date
  function addBlockToDate(
    dateStr,
    sTime,
    eTime,
    repeatWeekly = false,
    recurringId = null
  ) {
    if (eTime <= sTime) {
      alert("End time must be after start time");
      return;
    }

    let updated = [...unavailableBlocks];
    const dateIndex = updated.findIndex((block) => block.date === dateStr);
    const newTimeSlot = {
      startTime: sTime,
      endTime: eTime,
      repeatWeekly,
      recurringId,
    };

    if (dateIndex > -1) {
      const duplicate = updated[dateIndex].timeSlots.find(
        (ts) => ts.startTime === sTime && ts.endTime === eTime
      );
      if (duplicate) return;

      updated[dateIndex].timeSlots.push(newTimeSlot);
      updated[dateIndex].timeSlots = mergeTimeSlots(
        updated[dateIndex].timeSlots
      );
    } else {
      updated.push({
        date: dateStr,
        timeSlots: [newTimeSlot],
      });
    }

    onBlocksChange(undefined, updated);
    setInlineAddTimes((prev) => ({
      ...prev,
      [dateStr]: { ...prev[dateStr], editing: false },
    }));
  }

  const handleDeleteUnavailability = (dateStr, tsToDelete) => {
    let updated = [...unavailableBlocks];

    if (tsToDelete.repeatWeekly && tsToDelete.recurringId) {
      updated = updated
        .map((dayBlock) => ({
          ...dayBlock,
          timeSlots: dayBlock.timeSlots.filter(
            (ts) => ts.recurringId !== tsToDelete.recurringId
          ),
        }))
        .filter((db) => db.timeSlots.length > 0);
    } else {
      const dateIndex = updated.findIndex((block) => block.date === dateStr);
      if (dateIndex > -1) {
        updated[dateIndex].timeSlots = updated[dateIndex].timeSlots.filter(
          (ts) =>
            !(
              ts.startTime === tsToDelete.startTime &&
              ts.endTime === tsToDelete.endTime
            )
        );
        if (updated[dateIndex].timeSlots.length === 0) {
          updated.splice(dateIndex, 1);
        }
      }
    }

    onBlocksChange(undefined, updated);
  };

  const handleToggleRepeatWeekly = (dateStr, tsToToggle) => {
    let updated = [...unavailableBlocks];
    const dateIndex = updated.findIndex((block) => block.date === dateStr);
    if (dateIndex === -1) return; // Not found

    const slotIndex = updated[dateIndex].timeSlots.findIndex(
      (ts) =>
        ts.startTime === tsToToggle.startTime &&
        ts.endTime === tsToToggle.endTime
    );
    if (slotIndex === -1) return;

    const slot = updated[dateIndex].timeSlots[slotIndex];
    const currentlyRepeating = !!slot.repeatWeekly;
    slot.repeatWeekly = !currentlyRepeating;

    if (!currentlyRepeating) {
      const recurringId = uuidv4();
      slot.recurringId = recurringId;

      const baseDate = new Date(dateStr);
      const sTime = slot.startTime;
      const eTime = slot.endTime;

      for (let i = 1; i <= 16; i++) {
        const nextDate = new Date(baseDate);
        nextDate.setDate(nextDate.getDate() + 7 * i);
        const nextDateStr = nextDate.toISOString().split("T")[0];
        addBlockToDateNoInline(
          nextDateStr,
          sTime,
          eTime,
          true,
          recurringId,
          updated
        );
      }
    } else {
      slot.repeatWeekly = false;
      slot.recurringId = null;
    }

    onBlocksChange(undefined, updated);
  };

  function addBlockToDateNoInline(
    dateStr,
    sTime,
    eTime,
    repeatWeekly,
    recurringId,
    updated
  ) {
    if (eTime <= sTime) return;

    const dateIndex = updated.findIndex((block) => block.date === dateStr);
    const newTimeSlot = {
      startTime: sTime,
      endTime: eTime,
      repeatWeekly,
      recurringId,
    };

    if (dateIndex > -1) {
      const duplicate = updated[dateIndex].timeSlots.find(
        (ts) => ts.startTime === sTime && ts.endTime === eTime
      );
      if (!duplicate) {
        updated[dateIndex].timeSlots.push(newTimeSlot);
        updated[dateIndex].timeSlots = mergeTimeSlots(
          updated[dateIndex].timeSlots
        );
      }
    } else {
      updated.push({
        date: dateStr,
        timeSlots: [newTimeSlot],
      });
    }
  }

  const handleSaveToDatabase = async () => {
    try {
      const facultyEmail = localStorage.getItem("email");
      if (!facultyEmail) {
        console.error("No faculty email found in local storage.");
        return;
      }

      const response = await fetch(`${backendUrl}/block`, {
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

  // inline add
  const startInlineAdd = (dateStr) => {
    setInlineAddTimes((prev) => ({
      ...prev,
      [dateStr]: { startTime: "09:00", endTime: "10:00", editing: true },
    }));
  };

  const cancelInlineAdd = (dateStr) => {
    setInlineAddTimes((prev) => ({
      ...prev,
      [dateStr]: { ...prev[dateStr], editing: false },
    }));
  };

  const setInlineAddStart = (dateStr, val) => {
    setInlineAddTimes((prev) => ({
      ...prev,
      [dateStr]: { ...prev[dateStr], startTime: val },
    }));
  };

  const setInlineAddEnd = (dateStr, val) => {
    setInlineAddTimes((prev) => ({
      ...prev,
      [dateStr]: { ...prev[dateStr], endTime: val },
    }));
  };

  const confirmInlineAdd = (dateStr) => {
    const { startTime: s, endTime: e } = inlineAddTimes[dateStr];
    addBlockToDate(dateStr, s, e, false, null);
  };

  const handleJumpToWeek = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      const d = new Date(selectedDate);
      onJumpToDate(d);
    }
  };

  // display panel
  return (
    <div className="block-off-panel">
      <h3 className="panel-title">Block Off Times</h3>
      <hr className="panel-divider" />
      <p className="panel-description">
        Select any time you are not free, so that students cannot request a
        meeting with you at that time.
      </p>
      <hr className="panel-divider" />
      <h4 className="sub-title">Unavailabilities</h4>
      <h5 className="description">
        Set when you are unavailable for meetings.
      </h5>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontSize: "0.8rem", color: "#fff" }}>
          Jump to:{" "}
          <input
            type="date"
            value={jumpDate}
            onChange={(e) => {
              setJumpDate(e.target.value);
              handleJumpToWeek(e);
            }}
            style={{
              background: "#555",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "3px 8px",
              fontSize: "0.8rem",
            }}
          />
        </label>
      </div>

      <div className="unavailabilities-list">
        {weekDates.map((dayDate, i) => {
          const dateStr = dayDate.toISOString().split("T")[0];
          const dayData = unavailabilities[i];
          const timeSlots = dayData ? dayData.timeSlots : [];
          const dayName = dayNames[dayDate.getDay()];
          const inlineData = inlineAddTimes[dateStr];

          return (
            <div key={i} className="day-row">
              <div className="day-label">{dayName}</div>
              <div className="day-content">
                {timeSlots.length === 0 &&
                (!inlineData || !inlineData.editing) ? (
                  <span className="unavailable-text">Available</span>
                ) : (
                  <>
                    {timeSlots.map((ts, index) => (
                      <div key={index} className="time-row-item">
                        <span className="time-chip">
                          {formatTime24to12(ts.startTime)}
                        </span>
                        <span className="time-dash">-</span>
                        <span className="time-chip">
                          {formatTime24to12(ts.endTime)}
                        </span>
                        <button
                          className="icon-button repeat-button"
                          title="Toggle repeat weekly"
                          style={{ color: ts.repeatWeekly ? "#FF2424" : "#fff" }}
                          onClick={() => handleToggleRepeatWeekly(dateStr, ts)}
                        >
                          ↺
                        </button>
                        <button
                          className="icon-button remove-button"
                          onClick={() =>
                            handleDeleteUnavailability(dateStr, ts)
                          }
                          title="Delete this unavailability"
                        >
                          &#x2298;
                        </button>
                      </div>
                    ))}
                    {inlineData && inlineData.editing && (
                      <div className="time-row-item inline-add-form">
                        <select
                          value={inlineData.startTime}
                          onChange={(e) =>
                            setInlineAddStart(dateStr, e.target.value)
                          }
                        >
                          {timeOptions.map((t, idx) => (
                            <option key={idx} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <span className="time-dash">-</span>
                        <select
                          value={inlineData.endTime}
                          onChange={(e) =>
                            setInlineAddEnd(dateStr, e.target.value)
                          }
                        >
                          {timeOptions.map((t, idx) => (
                            <option key={idx} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <button
                          className="icon-button confirm-button"
                          title="Confirm new time block"
                          onClick={() => confirmInlineAdd(dateStr)}
                        >
                          ✓
                        </button>
                        <button
                          className="icon-button cancel-button"
                          title="Cancel"
                          onClick={() => cancelInlineAdd(dateStr)}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              {(!inlineData || !inlineData.editing) && (
                <button
                  className="icon-button add-day-button"
                  title="Add a new block for this day"
                  onClick={() => startInlineAdd(dateStr)}
                >
                  +
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <button className="save-btn" onClick={handleSaveToDatabase}>
          Save
        </button>
      </div>
    </div>
  );
};

export default BlockOffTimesPanel;

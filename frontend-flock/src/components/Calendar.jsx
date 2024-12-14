// Emily Roest, 260960015
import React, { useState } from "react";
import "../styles/Calendar.css";

// section for constants
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// section for helper functions and variables
function generateTimeSlots(start = "08:00", end = "19:00") {
  const increment = 5; 
  const times = [];
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;

  for (let t = startTotal; t <= endTotal; t += increment) {
    const hh = String(Math.floor(t / 60)).padStart(2, '0');
    const mm = String(t % 60).padStart(2, '0');
    times.push(`${hh}:${mm}`);
  }
  return times;
}

const timeSlots = generateTimeSlots("08:00","19:00");

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


// define helper funcitons within calendar
const StyledCalendar = ({ 
  mode = "unavailable", 
  availableBlocks, 
  unavailableBlocks, 
  onBlocksChange,
  weekDates,
  currentDate,
  onPrev,
  onNext
}) => {
    const [dragging, setDragging] = useState(false);
    const [currentSelection, setCurrentSelection] = useState(null);

    const formattedHeader = currentDate.toLocaleDateString('default', {
      month: 'long',
      year: 'numeric',
    });

    const handleMouseDown = (dayIndex, slotIndex) => {
      setDragging(true);
      setCurrentSelection({ dayIndex, startSlot: slotIndex, endSlot: slotIndex });
    };

    const handleMouseMove = (dayIndex, slotIndex) => {
      if (dragging && currentSelection) {
        const start = Math.min(currentSelection.startSlot, slotIndex);
        const end = Math.max(currentSelection.startSlot, slotIndex);
        setCurrentSelection(prev => ({ ...prev, startSlot: start, endSlot: end }));
      }
    };

    const handleMouseUp = () => {
      if (dragging && currentSelection) {
        const { dayIndex, startSlot, endSlot } = currentSelection;
        const blockDate = weekDates[dayIndex].toISOString().split('T')[0];
        const startTime = timeSlots[startSlot];
        const endTime = timeSlots[endSlot + 1] || timeSlots[endSlot];

        let updatedUnavailable = [...unavailableBlocks];
        const dateIndex = updatedUnavailable.findIndex(b => b.date === blockDate);
        const newSlot = { startTime, endTime };

        if (dateIndex > -1) {
          const duplicate = updatedUnavailable[dateIndex].timeSlots.find(
            ts => ts.startTime === startTime && ts.endTime === endTime
          );
          if (!duplicate) {
            updatedUnavailable[dateIndex].timeSlots.push(newSlot);
            updatedUnavailable[dateIndex].timeSlots = mergeTimeSlots(updatedUnavailable[dateIndex].timeSlots);
          }
        } else {
          updatedUnavailable.push({
            date: blockDate,
            timeSlots: [newSlot]
          });
        }

        if (mode === "available") {
          onBlocksChange([...availableBlocks], updatedUnavailable);
        } else {
          onBlocksChange(undefined, updatedUnavailable);
        }
        setCurrentSelection(null);
      }
      setDragging(false);
    };

    function isTimeInRange(time, start, end) {
      const tm = timeToMinutes(time);
      const st = timeToMinutes(start);
      const en = timeToMinutes(end);
      return tm >= st && tm < en;
    }

    const isInBlock = (blocks, dayIndex, slotIndex) => {
      const blockDate = weekDates[dayIndex].toISOString().split('T')[0];
      const slotTime = timeSlots[slotIndex];
      const dateEntry = blocks.find(b => b.date === blockDate);
      if (!dateEntry) return false;
      return dateEntry.timeSlots.some(ts => isTimeInRange(slotTime, ts.startTime, ts.endTime));
    };

    const isCurrentSelectionFn = (dayIndex, slotIndex) => {
      return (
        currentSelection &&
        currentSelection.dayIndex === dayIndex &&
        slotIndex >= currentSelection.startSlot &&
        slotIndex <= currentSelection.endSlot
      );
    };

    const getSlotClassName = (dayIndex, slotIndex) => {
      if (isCurrentSelectionFn(dayIndex, slotIndex)) {
        return mode === "available" ? "current-selection-red" : "current-selection-grey";
      }
      if (isInBlock(availableBlocks || [], dayIndex, slotIndex)) {
        return "selected red-block";
      }
      if (isInBlock(unavailableBlocks || [], dayIndex, slotIndex)) {
        return "unavailable grey-block";
      }
      return "";
    };

    // show calendar on screen
    return (
      <div className="styled-calendar-container"
        onMouseLeave={() => {
          if (dragging) {
            setDragging(false);
            setCurrentSelection(null);
          }
        }}
      >
        <div className="calendar-header">
          <button className="nav-arrow" onClick={onPrev}>←</button>
          <h2 className="month-year">{formattedHeader}</h2>
          <button className="nav-arrow" onClick={onNext}>→</button>
        </div>
        <div className="days-container">
          <div className="days-header-row">
            <div className="day-header placeholder"></div>
            {weekDates.map((date, i) => (
              <div className="day-header" key={i}>
                <div className="day-name">{days[i]}</div>
                <div className="day-date">{date.getDate()}</div>
              </div>
            ))}
          </div>
          <div className="days-grid">
            <div className="times-column">
              {timeSlots.map((t, i) => {
                const [HH, MM] = t.split(':');
                const label = MM === "00" ? `${Number(HH)}:00` : "";
                return (
                  <div key={i} className="time-row">
                    <div className="hour-label">{label}</div>
                  </div>
                );
              })}
            </div>
      
            {weekDates.map((date, dayIndex) => (
              <div key={dayIndex} className="day-column">
                {timeSlots.map((time, slotIndex) => (
                  <div
                    key={slotIndex}
                    className={`hour-slot ${getSlotClassName(dayIndex, slotIndex)}`}
                    onMouseDown={() => handleMouseDown(dayIndex, slotIndex)}
                    onMouseMove={() => handleMouseMove(dayIndex, slotIndex)}
                    onMouseUp={handleMouseUp}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default StyledCalendar;

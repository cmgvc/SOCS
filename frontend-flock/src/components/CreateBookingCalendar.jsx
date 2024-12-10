// coded by Danielle Wahrhaftig

import React, { useState } from "react";
import "../styles/Calendar.css";

const hours = [
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
];
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// sample unavailable times - for testing ONLY - remove later
const unavailableTimes = [
  { dayIndex: 0, startHour: 9, endHour: 10 },
  { dayIndex: 2, startHour: 15, endHour: 18 },
];

const CreateBookingCalendar = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dragging, setDragging] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null);

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const getStartOfWeek = (date) => {
    const dayIndex = date.getDay();
    const diff = date.getDate() - dayIndex;
    const newDate = new Date(date);
    newDate.setDate(diff);
    return newDate;
  };

  const startOfWeek = getStartOfWeek(new Date(currentDate));

  const getWeekDates = (startOfWeek) => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(startOfWeek);

  const handleMouseDown = (dayIndex, hourIndex) => {
    if (isUnavailable(dayIndex, hourIndex)) return;
    setDragging(true);
    setCurrentSelection({ dayIndex, startHour: hourIndex, endHour: hourIndex });
  };

  const handleMouseMove = (dayIndex, hourIndex) => {
    if (dragging && currentSelection) {
      setCurrentSelection((prev) => ({
        ...prev,
        endHour: Math.max(hourIndex, prev.startHour),
      }));
    }
  };

  const handleMouseUp = () => {
    if (dragging && currentSelection) {
      setSelectedBlocks((prev) => [...prev, currentSelection]);
      setCurrentSelection(null);
    }
    setDragging(false);
  };

  const isSelected = (dayIndex, hourIndex) => {
    return selectedBlocks.some(
      (block) =>
        block.dayIndex === dayIndex &&
        hourIndex >= block.startHour &&
        hourIndex <= block.endHour
    );
  };

  const isCurrentSelection = (dayIndex, hourIndex) => {
    return (
      currentSelection &&
      currentSelection.dayIndex === dayIndex &&
      hourIndex >= currentSelection.startHour &&
      hourIndex <= currentSelection.endHour
    );
  };

  const isUnavailable = (dayIndex, hourIndex) => {
    return unavailableTimes.some(
      (block) =>
        block.dayIndex === dayIndex &&
        hourIndex >= block.startHour &&
        hourIndex <= block.endHour
    );
  };

  const formattedHeader = currentDate.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="styled-calendar-container">
      <div className="calendar-header">
        <button className="nav-arrow" onClick={handlePrev}>
          ←
        </button>
        <h2 className="month-year">{formattedHeader}</h2>
        <button className="nav-arrow" onClick={handleNext}>
          →
        </button>
      </div>
      <div className="days-container">
        <div className="days-header-row">
          {/* Day headers */}
          {/* Add an empty placeholder for the times column */}
          <div className="day-header placeholder"></div>
          {weekDates.map((date, i) => (
            <div className="day-header" key={i}>
              <div className="day-name">{days[i]}</div>
              <div className="day-date">{date.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="days-grid">
          {/* Times Column */}
          <div className="times-column">
            {hours.map((hour, i) => (
              <div key={i} className="time-row">
                <div className="hour-label">{hour}</div>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="day-column">
              {hours.map((hour, hourIndex) => (
                <div
                  key={hourIndex}
                  className={`hour-slot ${
                    isUnavailable(dayIndex, hourIndex)
                      ? "unavailable"
                      : isSelected(dayIndex, hourIndex)
                      ? "selected"
                      : isCurrentSelection(dayIndex, hourIndex)
                      ? "current-selection"
                      : ""
                  }`}
                  onMouseDown={() => handleMouseDown(dayIndex, hourIndex)}
                  onMouseMove={() => handleMouseMove(dayIndex, hourIndex)}
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

export default CreateBookingCalendar;

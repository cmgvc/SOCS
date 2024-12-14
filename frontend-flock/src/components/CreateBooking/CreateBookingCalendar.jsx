// coded by Danielle Wahrhaftig
import React, { useState } from "react";
import "./create-booking-calendar.css";

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
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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
    const dayIndex = date.getDay() - 1; // start on Monday
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
    <div className="cb-calendar-container">
      <div className="cb-calendar-header">
        <button className="cb-nav-arrow" onClick={handlePrev}>
          ←
        </button>
        <h2 className="cb-month-year">{formattedHeader}</h2>
        <button className="cb-nav-arrow" onClick={handleNext}>
          →
        </button>
      </div>
      <div className="cb-days-container">
        <div className="cb-days-header-row">
          {/* Day headers */}
          {/* Add an empty placeholder for the times column */}
          <div className="cb-day-header cb-placeholder"></div>
          {weekDates.map((date, i) => (
            <div className="cb-day-header" key={i}>
              <div className="cb-day-name">{days[i]}</div>
              <div className="cb-day-date">{date.getDate()}</div>
            </div>
          ))}
        </div>
        <div className="cb-days-grid">
          {/* Times Column */}
          <div className="cb-times-column">
            {hours.map((hour, i) => (
              <div key={i} className="cb-time-row">
                <div className="cb-hour-label">{hour}</div>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="cb-day-column">
              {hours.map((hour, hourIndex) => (
                <div
                  key={hourIndex}
                  className={`cb-hour-slot ${
                    isUnavailable(dayIndex, hourIndex)
                      ? "cb-unavailable"
                      : isSelected(dayIndex, hourIndex)
                      ? "cb-selected"
                      : isCurrentSelection(dayIndex, hourIndex)
                      ? "cb-current-selection"
                      : ""
                  }`}
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

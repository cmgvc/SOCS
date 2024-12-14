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
const selectedSlotsDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CreateBookingCalendar = ({ selectedTimeSlots = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const formattedHeader = currentDate.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  // Helper function to check if a slot is selected
  const isSelected = (dayIndex, hourIndex) => {
    const dayName = selectedSlotsDays[dayIndex]; // Map day index to day name (e.g., 0 -> Mon)
    const slotsForDay = selectedTimeSlots[dayName] || []; // Get selected slots for the day

    const convertTimeToHourIndex = (time) => {
      const [hourMinute, period] = time.split(" "); // Split "9:00 AM" into "9:00" and "AM"
      const [hour, minute] = hourMinute.split(":").map(Number); // Split "9:00" into [9, 0]
      let totalHour = hour;

      // Convert to 24-hour format
      if (period === "PM" && hour !== 12) {
        totalHour += 12; // Add 12 hours for PM (except 12 PM)
      }
      if (period === "AM" && hour === 12) {
        totalHour = 0; // Midnight is 0 hours
      }

      return totalHour - 8; // Subtract 8 because "8 AM" corresponds to index 0
    };

    // Check if hourIndex falls within any of the selected slots
    return slotsForDay.some((slot) => {
      const startIndex = convertTimeToHourIndex(slot.start);
      const endIndex = convertTimeToHourIndex(slot.end);
      return hourIndex >= startIndex && hourIndex < endIndex; // Check if hourIndex is within the range
    });
  };

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
                    isSelected(dayIndex, hourIndex) ? "cb-selected" : ""
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

import React, { useState } from "react";
import { ReactComponent as AddSquareSvg } from "../../svg/add-square.svg";
import { ReactComponent as CancelRightSvg } from "../../svg/cancel-right.svg";
import "./repeat-weekly-availability.css";

const RepeatWeeklyAvailability = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [availability, setAvailability] = useState(
    days.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );

  // Generate 12-hour formatted time options
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h % 12 || 12; // Convert to 12-hour format
        const minute = m.toString().padStart(2, "0");
        const period = h < 12 ? "AM" : "PM";
        options.push(`${hour}:${minute} ${period}`);
      }
    }
    return options;
  };

  const convertTo24Hour = (time) => {
    const [hourMinute, period] = time.split(" ");
    let [hour, minute] = hourMinute.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const convertTo12Hour = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const addTimeSlot = (day) => {
    setAvailability({
      ...availability,
      [day]: [...availability[day], { start: "09:00", end: "17:00" }],
    });
  };

  const removeTimeSlot = (day, index) => {
    const updatedSlots = availability[day].filter((_, i) => i !== index);
    setAvailability({ ...availability, [day]: updatedSlots });
  };

  const handleTimeChange = (day, index, field, value) => {
    const updatedSlots = availability[day].map((slot, i) =>
      i === index ? { ...slot, [field]: convertTo24Hour(value) } : slot
    );
    setAvailability({ ...availability, [day]: updatedSlots });
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="repeat-weekly-container">
      {days.map((day) => (
        <div key={day} className="day-row-availability">
          {/* Day Block */}
          <div className="day-block">
            <h4 className="repeat-weekly-day">{day}</h4>
          </div>

          {/* Availability Block */}
          <div className="availability-block">
            {availability[day].length === 0 ? (
              <p className="availability unavailable">Unavailable</p>
            ) : (
              <div className="time-slots-wrapper">
                {availability[day].map((slot, index) => (
                  <div key={index} className="time-slot">
                    <select
                      className="time-picker"
                      value={convertTo12Hour(slot.start)}
                      onChange={(e) =>
                        handleTimeChange(day, index, "start", e.target.value)
                      }
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="time-separator">-</span>
                    <select
                      className="time-picker"
                      value={convertTo12Hour(slot.end)}
                      onChange={(e) =>
                        handleTimeChange(day, index, "end", e.target.value)
                      }
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <button
                      className="remove-availability-button"
                      onClick={() => removeTimeSlot(day, index)}
                    >
                      <CancelRightSvg />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Time Slot Button */}
          <button
            className="add-availability-button"
            onClick={() => addTimeSlot(day)}
          >
            <AddSquareSvg />
          </button>
        </div>
      ))}
    </div>
  );
};

export default RepeatWeeklyAvailability;

import React, { useState } from "react";
import { ReactComponent as AddSquareSvg } from "../../svg/add-square.svg";
import { ReactComponent as CancelRightSvg } from "../../svg/cancel-right.svg";
import "./repeat-weekly-availability.css";

const RepeatWeeklyAvailability = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [availability, setAvailability] = useState(
    days.reduce((acc, day) => {
      acc[day] = []; // Initialize each day with an empty array for time slots
      return acc;
    }, {})
  );

  const addTimeSlot = (day) => {
    // Default time slot: 9:00 AM - 5:00 PM
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
      i === index ? { ...slot, [field]: value } : slot
    );
    setAvailability({ ...availability, [day]: updatedSlots });
  };

  return (
    <div className="repeat-weekly-container">
      {days.map((day) => (
        <div key={day} className="day-row-availability">
          <div className="day-block">
            <h4 className="repeat-weekly-day">{day}</h4>
          </div>
          <div className="availability-block">
            {availability[day].length === 0 ? (
              <p className="availability">Unavailable</p>
            ) : (
              availability[day].map((slot, index) => (
                <div key={index} className="time-slot">
                  <input
                    type="time"
                    value={slot.start || "09:00"}
                    onChange={(e) =>
                      handleTimeChange(day, index, "start", e.target.value)
                    }
                  />
                  <span className="time-separator">-</span>
                  <input
                    type="time"
                    value={slot.end || "17:00"}
                    onChange={(e) =>
                      handleTimeChange(day, index, "end", e.target.value)
                    }
                  />
                  <button
                    className="remove-availability-button"
                    onClick={() => removeTimeSlot(day, index)}
                  >
                    <CancelRightSvg />
                  </button>
                  <button
                    className="remove-availability-button"
                    onClick={() => addTimeSlot(day, index)}
                  >
                    <AddSquareSvg />
                  </button>
                </div>
              ))
            )}
          </div>
          <button
            className="add-availability-button"
            onClick={() => addTimeSlot(day)}
          >
            {availability[day].length === 0 ? <AddSquareSvg /> : ""}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RepeatWeeklyAvailability;

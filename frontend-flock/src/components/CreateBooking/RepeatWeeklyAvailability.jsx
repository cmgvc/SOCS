// Danielle Wahrhaftig 260984602
import React, { useEffect, useState } from "react";
import { ReactComponent as AddSquareSvg } from "../../svg/add-square.svg";
import { ReactComponent as CancelRightSvg } from "../../svg/cancel-right.svg";
import "./repeat-weekly-availability.css";

const RepeatWeeklyAvailability = ({
  meetingDuration = "1 hour",
  onAvailabilityChange,
}) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const durationInMinutes = parseInt(meetingDuration.split(" ")[0]) * 60 || 60; // Convert meeting duration to minutes

  // Helper function to convert minutes to 12-hour time format
  const convertTo12Hour = (minutes) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const initializeAvailability = () => {
    return days.reduce((acc, day) => {
      if (day === "Mon") {
        acc[day] = [
          {
            start: "9:00 AM",
            end: convertTo12Hour(9 * 60 + durationInMinutes), // Calculate based on meeting duration
          },
        ];
      } else {
        acc[day] = []; // Other days have no slots
      }
      return acc;
    }, {});
  };

  // Component state
  const [availability, setAvailability] = useState(initializeAvailability);
  const [error, setError] = useState("");

  // Notify parent whenever availability changes
  useEffect(() => {
    onAvailabilityChange(availability);
  }, [availability]);

  // Reset availability when meeting duration changes
  useEffect(() => {
    const newAvailability = initializeAvailability();
    setAvailability(newAvailability);
  }, [meetingDuration]);

  // Generate time options for the dropdown, based on meeting duration
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24 * 60; i += 30) {
      options.push(convertTo12Hour(i));
    }
    return options;
  };

  // Validate that a new slot does not overlap with existing slots
  const validateNoOverlap = (slots, newSlot, index) => {
    const newStart = convertToMinutes(newSlot.start);
    const newEnd = convertToMinutes(newSlot.end);

    for (let i = 0; i < slots.length; i++) {
      if (i === index) continue; // Skip the slot being edited
      const slotStart = convertToMinutes(slots[i].start);
      const slotEnd = convertToMinutes(slots[i].end);

      // Check for overlap conditions
      if (
        (newStart >= slotStart && newStart < slotEnd) || // New start overlaps existing slot
        (newEnd > slotStart && newEnd <= slotEnd) || // New end overlaps existing slot
        (newStart <= slotStart && newEnd >= slotEnd) // New slot fully overlaps an existing slot
      ) {
        return false;
      }
    }
    return true; // No overlap
  };

  // Convert time (12-hour format) to total minutes
  const convertToMinutes = (time) => {
    const [hourMinute, period] = time.split(" ");
    let [hour, minute] = hourMinute.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour * 60 + minute;
  };

  // Find the next available slot
  const getNextAvailableSlot = (slots) => {
    if (slots.length === 0) {
      return {
        start: "9:00 AM",
        end: convertTo12Hour(9 * 60 + durationInMinutes),
      };
    }

    // Sort slots and find the next available gap
    const sortedSlots = [...slots].sort(
      (a, b) => convertToMinutes(a.start) - convertToMinutes(b.start)
    );

    // Check for gaps
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const currentEnd = convertToMinutes(sortedSlots[i].end);
      const nextStart = convertToMinutes(sortedSlots[i + 1].start);
      if (nextStart - currentEnd >= durationInMinutes) {
        return {
          start: convertTo12Hour(currentEnd),
          end: convertTo12Hour(currentEnd + durationInMinutes),
        };
      }
    }

    // Place slot after the last slot if no gaps are found
    const lastEnd = convertToMinutes(sortedSlots[sortedSlots.length - 1].end);
    return {
      start: convertTo12Hour(lastEnd),
      end: convertTo12Hour(lastEnd + durationInMinutes),
    };
  };

  // Add a new time slot
  const addTimeSlot = (day) => {
    setError("");
    const nextSlot = getNextAvailableSlot(availability[day]);
    setAvailability({
      ...availability,
      [day]: [...availability[day], nextSlot],
    });
  };

  // Remove a time slot
  const removeTimeSlot = (day, index) => {
    setError("");
    const updatedSlots = availability[day].filter((_, i) => i !== index);
    setAvailability({ ...availability, [day]: updatedSlots });
  };

  // Handle changes to time slots
  const handleTimeChange = (day, index, field, value) => {
    const updatedSlots = availability[day].map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    );

    const newSlot = updatedSlots[index];
    if (!validateNoOverlap(updatedSlots, newSlot, index)) {
      setError("Time slots cannot overlap.");
      return;
    }

    setError("");
    setAvailability({ ...availability, [day]: updatedSlots });
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="repeat-weekly-container">
      {days.map((day) => (
        <div key={day} className="day-row-availability">
          <div className="day-block">
            <h4 className="repeat-weekly-day">{day}</h4>
          </div>
          <div className="availability-block">
            {availability[day].length === 0 ? (
              <p className="availability unavailable">Unavailable</p>
            ) : (
              <div className="time-slots-wrapper">
                {availability[day].map((slot, index) => (
                  <div key={index} className="time-slot">
                    <select
                      className="time-picker"
                      value={slot.start}
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
                      value={slot.end}
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
          <button
            className="add-availability-button"
            onClick={() => addTimeSlot(day)}
          >
            <AddSquareSvg />
          </button>
        </div>
      ))}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RepeatWeeklyAvailability;

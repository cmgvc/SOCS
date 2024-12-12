import React, { useState } from "react";
import "./does-not-repeat.css";
import { ReactComponent as AddIcon } from "../../svg/add-square.svg"; // Replace with your actual SVG path

const DoesNotRepeat = () => {
  const [dates, setDates] = useState([
    { date: "2024-12-14", startTime: "09:00", endTime: "17:00" },
  ]);

  const addDate = () => {
    setDates([...dates, { date: "", startTime: "09:00", endTime: "17:00" }]);
  };

  const handleDateChange = (index, field, value) => {
    const updatedDates = dates.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    console.log(updatedDates);
    setDates(updatedDates);
  };

  // Function to format date as "Month Day, Year"
  const formatDate = (date) => {
    if (!date) return "Select a date";
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <div className="does-not-repeat-container">
      {dates.map((item, index) => (
        <div key={index} className="date-row">
          {/* Date Picker */}
          <div className="date-display-wrapper">
            <input
              type="date"
              className="date-picker"
              value={item.date}
              onChange={(e) => handleDateChange(index, "date", e.target.value)}
            />
            <div className="date-display">{formatDate(item.date)}</div>
          </div>

          {/* Time Inputs */}
          <div className="time-inputs">
            <input
              type="time"
              className="time-picker"
              value={item.startTime}
              onChange={(e) =>
                handleDateChange(index, "startTime", e.target.value)
              }
            />
            <span className="time-separator">-</span>
            <input
              type="time"
              className="time-picker"
              value={item.endTime}
              onChange={(e) =>
                handleDateChange(index, "endTime", e.target.value)
              }
            />
          </div>

          {/* Add Icon */}
          {index === dates.length - 1 && (
            <button className="add-date-button" onClick={addDate}>
              <AddIcon />
            </button>
          )}
        </div>
      ))}

      {/* Add a Date Button */}
      <button className="add-date-footer" onClick={addDate}>
        Add a date
      </button>
    </div>
  );
};

export default DoesNotRepeat;

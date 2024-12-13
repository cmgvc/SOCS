import React, { useState } from "react";
import "./scheduling-window.css";

const SchedulingLimits = () => {
  const [maxDaysEnabled, setMaxDaysEnabled] = useState(true);
  const [minHoursEnabled, setMinHoursEnabled] = useState(true);
  const [maxDays, setMaxDays] = useState(60); // Default maximum days
  const [minHours, setMinHours] = useState(4); // Default minimum hours

  const handleMaxDaysToggle = () => {
    setMaxDaysEnabled(!maxDaysEnabled);
  };

  const handleMinHoursToggle = () => {
    setMinHoursEnabled(!minHoursEnabled);
  };

  const handleMaxDaysChange = (e) => {
    setMaxDays(Number(e.target.value));
  };

  const handleMinHoursChange = (e) => {
    setMinHours(Number(e.target.value));
  };

  return (
    <div className="scheduling-limits-container">
      <div className="input-group">
        <label className="checkbox-label">
          <span>Maximum time in advance that an appointment can be booked</span>
        </label>
        <div className="input-row">
        <input
            type="checkbox"
            checked={maxDaysEnabled}
            onChange={handleMaxDaysToggle}
          />
          <input
            type="number"
            value={maxDays}
            min="1"
            onChange={handleMaxDaysChange}
            disabled={!maxDaysEnabled}
            className="time-input"
          />
          <span className="input-unit">days</span>
        </div>
      </div>
      <div className="input-group">
        <label className="checkbox-label">
          <span>
            Minimum time before the appointment start that it can be booked
          </span>
        </label>
        <div className="input-row">
            <input
            type="checkbox"
            checked={minHoursEnabled}
            onChange={handleMinHoursToggle}
          />
          <input
            type="number"
            value={minHours}
            min="1"
            onChange={handleMinHoursChange}
            disabled={!minHoursEnabled}
            className="time-input"
          />
          <span className="input-unit">hours</span>
        </div>
      </div>
    </div>
  );
};

export default SchedulingLimits;

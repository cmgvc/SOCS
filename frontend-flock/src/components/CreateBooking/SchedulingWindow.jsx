// Danielle Wahrhaftig 260984602
import React, { useState, useEffect } from "react";
import "./scheduling-window.css";

const SchedulingLimits = ({ onSchedulingLimitsChange }) => {
  const [maxDaysEnabled, setMaxDaysEnabled] = useState(true);
  const [minHoursEnabled, setMinHoursEnabled] = useState(true);
  const [maxDays, setMaxDays] = useState(30); // Default maximum days
  const [minHours, setMinHours] = useState(4); // Default minimum hours

  const handleMaxDaysToggle = () => {
    setMaxDaysEnabled((prev) => {
      if (prev) {
        setMaxDays(null); // set maxDays to null when disabling
      }
      return !prev;
    });
  };

  const handleMinHoursToggle = () => {
    setMinHoursEnabled((prev) => {
      if (prev) {
        setMinHours(null); // Set minHours to null when disabling
      }
      return !prev;
    });
  };

  const handleMaxDaysChange = (e) => {
    setMaxDays(e.target.value === "" ? "" : Number(e.target.value));
  };

  const handleMinHoursChange = (e) => {
    setMinHours(e.target.value === "" ? "" : Number(e.target.value));
  };

  // Notify parent only when dependencies change
  useEffect(() => {
    if (onSchedulingLimitsChange) {
      onSchedulingLimitsChange({
        maxDaysEnabled,
        maxDays,
        minHoursEnabled,
        minHours,
      });
    }
  }, [maxDaysEnabled, maxDays, minHoursEnabled, minHours]);

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
            value={maxDaysEnabled ? maxDays : ""}
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
            value={minHoursEnabled ? minHours : ""}
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

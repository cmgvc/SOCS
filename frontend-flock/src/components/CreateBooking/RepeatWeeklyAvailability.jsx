import React from "react";
import "./repeat-weekly-availability.css";

const RepeatWeeklyAvailability = () => {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return (
    <div className="repeat-weekly-container">
      <div className="day-row">
        <div className="day-block">
          <h4 className="repeat-weekly-day">Mon</h4>
        </div>
        <p className="availability">Unavailable</p>
      </div>
      <div className="day-row">
        <div className="day-block">
          <h4 className="repeat-weekly-day">Tue</h4>
        </div>
        <p className="availability">Unavailable</p>
      </div>
      <div className="day-row">
        <div className="day-block">
          <h4 className="repeat-weekly-day">Wed</h4>
        </div>
        <p className="availability">Unavailable</p>
      </div>
      <div className="day-row">
        <div className="day-block">
          <h4 className="repeat-weekly-day">Thu</h4>
        </div>
        <p className="availability">Unavailable</p>
      </div>
      <div className="day-row">
        <div className="day-block">
          <h4 className="repeat-weekly-day">Fri</h4>
        </div>
        <p className="availability">Unavailable</p>
      </div>
      <div className="day-row">
        <div className="day-block">
          <h4 className="repeat-weekly-day">Sat</h4>
        </div>
        <p className="availability">Unavailable</p>
      </div>
      <div className="day-row">
        <div className="day-block">
          <h4 className="repeat-weekly-day">Sun</h4>
        </div>
        <p className="availability">Unavailable</p>
      </div>
    </div>
  );
};

export default RepeatWeeklyAvailability;

import React, { useMemo } from "react";
import "../styles/BlockPanel.css";

const hours = [
  "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM",
  "4 PM", "5 PM", "6 PM", "7 PM"
];

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const BlockOffTimesPanel = ({ mode, onModeChange, unavailableBlocks }) => {

  const unavailabilities = useMemo(() => {
    const result = {
      SUN: [],
      MON: [],
      TUE: [],
      WED: [],
      THU: [],
      FRI: [],
      SAT: []
    };

    unavailableBlocks.forEach(block => {
      const { dayIndex, startHour, endHour } = block;
      const day = days[dayIndex];

      const startTime = hours[startHour];
      const endTimeIndex = endHour + 1 < hours.length ? endHour + 1 : endHour;
      const endTime = hours[endTimeIndex];

      result[day].push({ start: startTime, end: endTime });
    });

    return result;
  }, [unavailableBlocks]);

  const handleSetAvailable = () => onModeChange("available");
  const handleSetUnavailable = () => onModeChange("unavailable");

  return (
    <div className="block-off-panel">
      <h3 className="panel-title">Block Off Times</h3>
      <hr className="panel-divider" />
      <p className="panel-description">
        Select any time you are not free such that students will not be able to request a meeting with you at that time.
      </p>
      <hr className="panel-divider" />

      <h4 className="sub-title">Unavailabilities</h4>
      <h5 className="description">Set when you are unavailable for meetings.</h5>

      <div className="set-buttons">
        <button 
          className="set-available"
          onClick={handleSetAvailable}
        >
          Set Available
        </button>
        <button 
          className="set-unavailable"
          onClick={handleSetUnavailable}
        >
          Set Unavailable
        </button>
      </div>

      {/* The repeat weekly button */}
      <button className={`repeat-weekly-toggle`}>
        Repeat weekly
      </button>

      <div className="unavailabilities-list">
        {days.map((day) => {
          const dayBlocks = unavailabilities[day] || [];
          return (
            <div key={day} className="day-row">
              <div className="day-label">{day}</div>
              <div className="day-blocks">
                {dayBlocks.length === 0 ? (
                  <span className="available-label">Available</span>
                ) : (
                  dayBlocks.map((block, index) => (
                    <div key={index} className="time-block">
                      {block.start} - {block.end}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <button className="save-btn">Save</button>
      </div>
    </div>
  );
};

export default BlockOffTimesPanel;
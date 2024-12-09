import React, { useState } from "react";
import "../styles/BlockPanel.css";

const initialUnavailabilities = {
  SUN: [],
  MON: [],
  TUE: [],
  WED: [],
  THU: [],
  FRI: [],
  SAT: []
};

const BlockOffTimesPanel = () => {
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [unavailabilities, setUnavailabilities] = useState(initialUnavailabilities);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const handleAddTime = (day) => {
    setUnavailabilities((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: "", end: "" }]
    }));
  };

  return (
    <div className="block-off-panel">
      <h3 className="panel-title">Block Off Times</h3>
      <hr className="panel-divider" />
      <p className="panel-description">
        Select any time you are not free such that students will not be able to request a meeting with you at that time.
      </p>

      <hr className="panel-divider" />

      <h4 className="sub-title">Unavailabilities</h4>
      <h5 className="description">Set when you are unavailable for meetings. </h5>

      <button
        className={`repeat-weekly-toggle ${repeatWeekly ? "active" : ""}`}
        onClick={() => setRepeatWeekly((r) => !r)}
      >
        Repeat weekly
      </button>

      <div className="unavailabilities-list">
        {days.map((day) => {
          const dayBlocks = unavailabilities[day] || [];
          return (
            <div key={day} className="day-row">
              <div className="day-label">{day}</div>
              <div className="day-blocks">
                {dayBlocks.length === 0
                  ? <span className="available-label">Available</span>
                  : dayBlocks.map((block, index) => (
                      <div key={index} className="time-block">
                        {block.start && block.end
                          ? `${block.start} - ${block.end}`
                          : block.start || "Set time"}
                        {/* Here you could add edit/remove icons */}
                      </div>
                    ))
                }
              </div>
              <button className="icon-button" onClick={() => handleAddTime(day)}>+</button>
            </div>
          );
        })}
      </div>

      <button className="save-btn">Save</button>
    </div>
  );
};

export default BlockOffTimesPanel;

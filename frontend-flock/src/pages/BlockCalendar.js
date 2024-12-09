import React from "react";
import BlockOffTimesPanel from "../components/BlockPanel.jsx";
import StyledCalendar from "../components/Calendar";
import "../styles/BlockCalendar.css"; // overall layout styling

const CalendarWithSidebar = () => {
  return (
    <div className="app-container">
      <br></br>
      <br></br>
      <div className="content-container">
        <BlockOffTimesPanel />
        <StyledCalendar />
      </div>
    </div>
  );
};

export default CalendarWithSidebar;

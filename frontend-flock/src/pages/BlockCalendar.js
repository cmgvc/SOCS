import React, { useState } from "react";
import BlockOffTimesPanel from "../components/BlockPanel.jsx";
import StyledCalendar from "../components/Calendar";
import "../styles/BlockCalendar.css"; // overall layout styling


const CalendarWithSidebar = () => {
  const [mode, setMode] = useState("unavailable");

  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [unavailableBlocks, setUnavailableBlocks] = useState([]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleBlocksChange = (newAvailableBlocks, newUnavailableBlocks) => {
    if (newAvailableBlocks !== undefined) setAvailableBlocks(newAvailableBlocks);
    if (newUnavailableBlocks !== undefined) setUnavailableBlocks(newUnavailableBlocks);
  };

  
  return (
    <div style={{ margin: "20px" }}>
      <br></br>
      <br></br>
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <BlockOffTimesPanel 
        mode={mode} 
        onModeChange={handleModeChange} 
        unavailableBlocks={unavailableBlocks}
      />
      <StyledCalendar 
        mode={mode} 
        availableBlocks={availableBlocks} 
        unavailableBlocks={unavailableBlocks} 
        onBlocksChange={handleBlocksChange}
      />
    </div>
    </div>
  );
};

export default CalendarWithSidebar;
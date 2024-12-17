// Emily Roest, 260960015
import React, { useState, useEffect } from "react";
import BlockOffTimesPanel from "../components/BlockPanel.jsx";
import StyledCalendar from "../components/Calendar";
import "../styles/BlockCalendar.css";

// define helper functions
const getStartOfWeek = (date) => {
  const dayIndex = date.getDay();
  const diff = date.getDate() - dayIndex;
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  newDate.setDate(diff);
  return newDate;
};

const getWeekDates = (startOfWeek) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    date.setHours(0, 0, 0, 0);
    return date;
  });
};

const CalendarWithSidebar = () => {
  const [mode, setMode] = useState("unavailable");
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [unavailableBlocks, setUnavailableBlocks] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDates = getWeekDates(startOfWeek);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    // populate with existing data
    const facultyEmail = localStorage.getItem("email");
    if (!facultyEmail) {
      console.error("No faculty email found in local storage.");
      return;
    }

    fetch(
      `${backendUrl}/block?facultyEmail=${encodeURIComponent(facultyEmail)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.unavailabilities) {
          // turn data into correct format
          const loadedBlocks = data.unavailabilities.map((ua) => ({
            date: ua.date,
            timeSlots: ua.timeSlots.map((ts) => ({
              startTime: ts.startTime,
              endTime: ts.endTime,
            })),
          }));
          setUnavailableBlocks(loadedBlocks);
        }
      })
      .catch((err) => console.error("Failed to load unavailabilities:", err));
  }, []);

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleBlocksChange = (newAvailableBlocks, newUnavailableBlocks) => {
    if (newAvailableBlocks !== undefined)
      setAvailableBlocks(newAvailableBlocks);
    if (newUnavailableBlocks !== undefined)
      setUnavailableBlocks(newUnavailableBlocks);
  };

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  // set currentDate to the selected date -> updates calendar and panel
  const handleJumpToDate = (d) => {
    setCurrentDate(d);
  };

  return (
    <div style={{ margin: "20px" }}>
      <br />
      <br />
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <BlockOffTimesPanel
          mode={mode}
          onModeChange={handleModeChange}
          unavailableBlocks={unavailableBlocks}
          onBlocksChange={handleBlocksChange}
          weekDates={weekDates}
          onJumpToDate={handleJumpToDate}
        />
        <StyledCalendar
          mode={mode}
          availableBlocks={availableBlocks}
          unavailableBlocks={unavailableBlocks}
          onBlocksChange={handleBlocksChange}
          weekDates={weekDates}
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

export default CalendarWithSidebar;

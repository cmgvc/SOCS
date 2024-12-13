import React, { useState } from "react";
import "../styles/Calendar.css";

const hours = [
  "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM",
  "4 PM", "5 PM", "6 PM", "7 PM"
];
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const StyledCalendar = ({ mode = "unavailable", availableBlocks, unavailableBlocks, onBlocksChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dragging, setDragging] = useState(false);
    const [currentSelection, setCurrentSelection] = useState(null);
  
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
  
    const getStartOfWeek = (date) => {
      const dayIndex = date.getDay();
      const diff = date.getDate() - dayIndex;
      const newDate = new Date(date);
      newDate.setDate(diff);
      return newDate;
    };
  
    const startOfWeek = getStartOfWeek(new Date(currentDate));
  
    const getWeekDates = (startOfWeek) => {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
      });
    };
  
    const weekDates = getWeekDates(startOfWeek);
  
    const handleMouseDown = (dayIndex, hourIndex) => {
      setDragging(true);
      setCurrentSelection({ dayIndex, startHour: hourIndex, endHour: hourIndex });
    };
  
    const handleMouseMove = (dayIndex, hourIndex) => {
      if (dragging && currentSelection) {
        setCurrentSelection((prev) => ({
          ...prev,
          endHour: Math.max(hourIndex, prev.startHour),
        }));
      }
    };
  
    const handleMouseUp = () => {
      if (dragging && currentSelection) {
        if (mode === "available") {
          onBlocksChange([...availableBlocks, currentSelection], undefined);
        } else {
          onBlocksChange(undefined, [...unavailableBlocks, currentSelection]);
        }
        setCurrentSelection(null);
      }
      setDragging(false);
    };
  
    const isInBlock = (blocks, dayIndex, hourIndex) => {
      return blocks.some(
        (block) =>
          block.dayIndex === dayIndex &&
          hourIndex >= block.startHour &&
          hourIndex <= block.endHour
      );
    };
  
    const isAvailableSelected = (dayIndex, hourIndex) => {
      return isInBlock(availableBlocks, dayIndex, hourIndex);
    };
  
    const isUnavailableSelected = (dayIndex, hourIndex) => {
      return isInBlock(unavailableBlocks, dayIndex, hourIndex);
    };
  
    const isCurrentSelectionFn = (dayIndex, hourIndex) => {
      return (
        currentSelection &&
        currentSelection.dayIndex === dayIndex &&
        hourIndex >= currentSelection.startHour &&
        hourIndex <= currentSelection.endHour
      );
    };
  
    const getSlotClassName = (dayIndex, hourIndex) => {
      if (isCurrentSelectionFn(dayIndex, hourIndex)) {
        //currently dragging
        return mode === "available" ? "current-selection-red" : "current-selection-grey";
      }
      if (isAvailableSelected(dayIndex, hourIndex)) {
        // final red
        return "selected red-block";
      }
      if (isUnavailableSelected(dayIndex, hourIndex)) {
        // final grey
        return "unavailable grey-block";
      }
      return "";
    };
  
    const formattedHeader = currentDate.toLocaleDateString('default', {
      month: 'long',
      year: 'numeric',
    });
  
    return (
      <div className="styled-calendar-container"
        onMouseLeave={() => {
          if (dragging) {
            setDragging(false);
            setCurrentSelection(null);
          }
        }}
      >
        <div className="calendar-header">
          <button className="nav-arrow" onClick={handlePrev}>←</button>
          <h2 className="month-year">{formattedHeader}</h2>
          <button className="nav-arrow" onClick={handleNext}>→</button>
        </div>
        <div className="days-container">
          <div className="days-header-row">
            <div className="day-header placeholder"></div>
            {weekDates.map((date, i) => (
              <div className="day-header" key={i}>
                <div className="day-name">{days[i]}</div>
                <div className="day-date">{date.getDate()}</div>
              </div>
            ))}
          </div>
          <div className="days-grid">
            {/* Times Column */}
            <div className="times-column">
              {hours.map((hour, i) => (
                <div key={i} className="time-row">
                  <div className="hour-label">{hour}</div>
                </div>
              ))}
            </div>
  
            {/* Day Columns */}
            {weekDates.map((date, dayIndex) => (
              <div key={dayIndex} className="day-column">
                {hours.map((hour, hourIndex) => (
                  <div
                    key={hourIndex}
                    className={`hour-slot ${getSlotClassName(dayIndex, hourIndex)}`}
                    onMouseDown={() => handleMouseDown(dayIndex, hourIndex)}
                    onMouseMove={() => handleMouseMove(dayIndex, hourIndex)}
                    onMouseUp={handleMouseUp}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default StyledCalendar;
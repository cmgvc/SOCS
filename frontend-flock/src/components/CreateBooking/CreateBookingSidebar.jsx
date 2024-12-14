// Coded by Danielle Wahrhaftig
import React, { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import CustomDurationModal from "./CustomDurationModal";
import CustomMeetingModal from "./CustomMeetingModal";
import RepeatWeeklyAvailability from "./RepeatWeeklyAvailability";
import DoesNotRepeat from "./DoesNotRepeat";
import SchedulingLimits from "./SchedulingWindow";
import { ReactComponent as Chevron } from "../../svg/chevron-down.svg";
import "./create-booking-sidebar.css";

const CreateBookingSidebar = () => {
  const [meetingType, setMeetingType] = useState("1-1");
  const [meetingDuration, setMeetingDuration] = useState("1 hour");
  const [availability, setAvailability] = useState("Repeat weekly");
  const [repeatWeeklyData, setRepeatWeeklyData] = useState({});
  const [doesNotRepeatData, setDoesNotRepeatData] = useState([]);
  const [showCustomDurationModal, setShowCustomDurationModal] = useState(false);
  const [showCustomMeetingModal, setShowCustomMeetingModal] = useState(false);
  const backendUrl = process.env.backendUrl || "http://localhost:5001";
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null); // Add this state

  const [schedulingLimits, setSchedulingLimits] = useState({
    maxDays: null,
    minHours: null,
  });

  const handleMeetingDuration = (meetingDuration) => {
    const meetingDurationSplit = meetingDuration.split(" ");
    const timeType = meetingDurationSplit[1];
    const time = parseInt(meetingDurationSplit[0]);
    if (timeType === "hour" || timeType === "hours") {
      return time * 60;
    }
    return time;
  };

  const isValidTimeSlot = (slot, meetingDurationInMinutes) => {
    const { startTime, endTime } = slot;

    const startMinutes =
      parseInt(startTime.split(":")[0], 10) * 60 +
      parseInt(startTime.split(":")[1], 10);
    const endMinutes =
      parseInt(endTime.split(":")[0], 10) * 60 +
      parseInt(endTime.split(":")[1], 10);

    // Ensure end time is greater than start time
    if (endMinutes <= startMinutes) return false;

    // Ensure the difference is a multiple of the meeting duration
    const difference = endMinutes - startMinutes;
    return difference % meetingDurationInMinutes === 0;
  };

  const isValidTimeSlotWeekly = (slot, meetingDurationInMinutes) => {
    const { start, end } = slot;

    const startMinutes =
      parseInt(start.split(":")[0], 10) * 60 +
      parseInt(start.split(":")[1], 10);
    const endMinutes =
      parseInt(end.split(":")[0], 10) * 60 + parseInt(end.split(":")[1], 10);

    // Ensure end time is greater than start time
    if (endMinutes <= startMinutes) return false;

    // Ensure the difference is a multiple of the meeting duration
    const difference = endMinutes - startMinutes;
    return difference % meetingDurationInMinutes === 0;
  };

  const isOverlapping = (slots) => {
    const slotsByDate = slots.reduce((acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);
      return acc;
    }, {});

    for (const date in slotsByDate) {
      const slotsForDate = slotsByDate[date];
      for (let i = 0; i < slotsForDate.length; i++) {
        for (let j = i + 1; j < slotsForDate.length; j++) {
          const slotA = slotsForDate[i];
          const slotB = slotsForDate[j];

          const startA = new Date(`${date}T${slotA.startTime}`);
          const endA = new Date(`${date}T${slotA.endTime}`);
          const startB = new Date(`${date}T${slotB.startTime}`);
          const endB = new Date(`${date}T${slotB.endTime}`);

          // Check if times overlap
          if (startA < endB && startB < endA) {
            return true; // Overlap detected
          }
        }
      }
    }
    return false; // No overlaps
  };

  const isOverlappingWeekly = (repeatWeeklyData) => {
    // Iterate through each day's slots
    for (const day in repeatWeeklyData) {
      const slotsForDay = repeatWeeklyData[day];

      if (!Array.isArray(slotsForDay)) continue; // Skip invalid data

      // Check for overlaps within the same day
      for (let i = 0; i < slotsForDay.length; i++) {
        for (let j = i + 1; j < slotsForDay.length; j++) {
          const slotA = slotsForDay[i];
          const slotB = slotsForDay[j];

          const startA = new Date(`1970-01-01T${slotA.start}`);
          const endA = new Date(`1970-01-01T${slotA.end}`);
          const startB = new Date(`1970-01-01T${slotB.start}`);
          const endB = new Date(`1970-01-01T${slotB.end}`);

          // Check if times overlap
          if (startA < endB && startB < endA) {
            console.error(`Overlap detected on ${day}:`, slotA, slotB);
            return true; // Overlap detected
          }
        }
      }
    }
    return false; // No overlaps
  };

  const handleSave = async () => {
    // Check if "Does not repeat" is selected
    if (availability === "Does not repeat") {
      // Check for missing dates
      const invalidDate = doesNotRepeatData.some(
        (slot) => slot.date === "" || slot.date === "Select a date"
      );
      if (invalidDate) {
        setError("All date fields must be filled with valid dates.");
        return; // Prevent saving
      }

      // Check if there are no time slots
      if (doesNotRepeatData.length === 0) {
        setError("Must add a time slot.");
        return; // Prevent saving
      }

      // Meeting duration in minutes
      const meetingDurationInMinutes = handleMeetingDuration(meetingDuration);

      // Validate each time slot
      const invalidTimeSlot = doesNotRepeatData.some(
        (slot) => !isValidTimeSlot(slot, meetingDurationInMinutes)
      );
      if (invalidTimeSlot) {
        setError(
          `Each time slot must align with the ${meetingDuration} duration.`
        );
        return;
      }
      // Check for overlapping slots
      if (isOverlapping(doesNotRepeatData)) {
        setError("Time slots on the same date cannot overlap.");
        return;
      }
    }

    if (availability === "Repeat weekly") {
      const meetingDurationInMinutes = handleMeetingDuration(meetingDuration);

      // Validate intervals for each slot
      const timeSlots = Object.values(repeatWeeklyData).flat();
      for (const slot of timeSlots) {
        console.log(slot);
        if (!isValidTimeSlotWeekly(slot, meetingDurationInMinutes)) {
          setError(
            `Each time slot must align with the ${meetingDuration} duration.`
          );
          return;
        }
      }
      // Check for overlapping time slots on the same day
      if (isOverlappingWeekly(repeatWeeklyData)) {
        setError("Time slots for the same day cannot overlap.");
        return; // Prevent saving
      }
    }

    // Clear error if validation passes
    setError(null);

    const bookingData = {
      title: document.querySelector(".add-title-input").value,
      email: localStorage.getItem("email"),
      meetingType,
      meetingDuration: handleMeetingDuration(meetingDuration),
      doesRepeatWeekly: availability === "Repeat weekly" ? true : false,
      availabilityData:
        availability === "Repeat weekly" ? repeatWeeklyData : doesNotRepeatData,
      windowDaysAdvance: schedulingLimits.maxDays,
      windowTimeBefore: schedulingLimits.minHours,
    };

    console.log(bookingData);

    try {
      const response = await fetch(`${backendUrl}/availability/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleCustomDurationSubmit = (duration) => {
    setMeetingDuration(duration);
    setShowCustomDurationModal(false);
  };

  const handleCustomMeetingSubmit = (customMeetingType) => {
    setMeetingType(customMeetingType);
    setShowCustomMeetingModal(false);
  };

  const toggleSchedulingLimits = () => {
    setIsOpen(!isOpen); // Toggle the state
  };

  const handleSchedulingLimitsChange = (limits) => {
    setSchedulingLimits(limits);
  };

  return (
    <div className="create-meeting-sidebar">
      <h3 className="booking-sidebar-title">BOOKABLE MEETING SCHEDULE</h3>
      <input type="text" className="add-title-input" placeholder="Add Title" />
      <hr className="sidebar-divider" />
      <div className="gap"></div>
      <h3 className="bold-title">Meeting type</h3>
      <h4 className="booking-subtitle">What kind of meeting is this?</h4>
      <DropdownMenu
        options={["Office Hours", "1-1", "Group", "Custom..."]}
        defaultOption={meetingType}
        onChange={(selected) =>
          selected === "Custom..."
            ? setShowCustomMeetingModal(true)
            : setMeetingType(selected)
        }
      />
      <hr className="sidebar-divider" />
      <h3 className="bold-title">Meeting duration</h3>
      <h4 className="booking-subtitle">How long should each meeting last?</h4>
      <DropdownMenu
        options={["30 minutes", "1 hour", "1.5 hours", "2 hours"]}
        defaultOption={meetingDuration}
        onChange={(selected) =>
          selected === "Custom..."
            ? setShowCustomDurationModal(true)
            : setMeetingDuration(selected)
        }
      />
      <hr className="sidebar-divider" />
      <h3 className="bold-title">General availability</h3>
      <h4 className="booking-subtitle">
        Set when you're regularly available for meetings.
      </h4>
      <DropdownMenu
        options={["Repeat weekly", "Does not repeat"]}
        defaultOption={availability}
        onChange={(selected) => {
          setAvailability(selected);
        }}
      />
      {availability === "Repeat weekly" && (
        <RepeatWeeklyAvailability
          meetingDuration={meetingDuration}
          onAvailabilityChange={setRepeatWeeklyData}
        />
      )}
      {availability === "Does not repeat" && (
        <DoesNotRepeat
          onAvailabilityChange={setDoesNotRepeatData}
          meetingDuration={meetingDuration}
        />
      )}
      <hr className="sidebar-divider" />
      <div className="scheduling-window-title">
        <h3 className="bold-title">Scheduling window</h3>
        <Chevron
          className={`chevron ${isOpen ? "rotated" : ""}`}
          onClick={toggleSchedulingLimits}
        />
      </div>
      {/* Subtitle dynamically updated */}
      <h4 className="booking-subtitle">
        {schedulingLimits.maxDaysEnabled
          ? `${schedulingLimits.maxDays} days in advance`
          : "No limit in advance bookings"}{" "}
        to{" "}
        {schedulingLimits.minHoursEnabled
          ? `${schedulingLimits.minHours} hours before`
          : "no limit before the appointment"}
      </h4>
      {/* <h4 className="booking-subtitle">
        {startDays} days in advance to {endHours} hours before
      </h4> */}
      {isOpen && (
        <SchedulingLimits
          onSchedulingLimitsChange={handleSchedulingLimitsChange}
        />
      )}
      {error && <div className="error-message">{error}</div>}
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
      {/* Custom Duration Modal */}
      {showCustomDurationModal && (
        <CustomDurationModal
          isVisible={showCustomDurationModal}
          onClose={() => setShowCustomDurationModal(false)}
          onSubmit={handleCustomDurationSubmit}
          defaultValue={1}
          defaultUnit="hours"
        />
      )}
      {/* Custom Meeting Modal */}
      {showCustomMeetingModal && (
        <CustomMeetingModal
          isVisible={showCustomMeetingModal}
          onClose={() => setShowCustomMeetingModal(false)}
          onSubmit={handleCustomMeetingSubmit}
          defaultValue=""
        />
      )}
    </div>
  );
};

export default CreateBookingSidebar;

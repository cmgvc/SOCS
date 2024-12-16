// Coded by Danielle Wahrhaftig
import React, { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import CustomMeetingModal from "./CustomMeetingModal";
import RepeatWeeklyAvailability from "./RepeatWeeklyAvailability";
import DoesNotRepeat from "./DoesNotRepeat";
import SchedulingLimits from "./SchedulingWindow";
import { ReactComponent as Chevron } from "../../svg/chevron-down.svg";
import "./create-booking-sidebar.css";

const CreateBookingSidebar = ({ setSelectedTimeSlots }) => {
  const [meetingType, setMeetingType] = useState("1-1");
  const [meetingDuration, setMeetingDuration] = useState("1 hour");
  const [availability, setAvailability] = useState("Repeat weekly");
  const [repeatWeeklyData, setRepeatWeeklyData] = useState({});
  const [doesNotRepeatData, setDoesNotRepeatData] = useState([]);
  const [bookingUrl, setBookingUrl] = useState(null); // Add state for booking URL
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [showCustomMeetingModal, setShowCustomMeetingModal] = useState(false);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

  const [schedulingLimits, setSchedulingLimits] = useState({
    maxDays: null,
    minHours: null,
  });

  const convertDoesNotRepeatSlotsFormat = () => {
    const convertTo12Hour = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      const period = hour < 12 ? "AM" : "PM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
    };

    const availabilityData = doesNotRepeatData.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = []; // Initialize an array for the date if it doesn't exist
      }

      acc[slot.date].push({
        start: convertTo12Hour(slot.startTime),
        end: convertTo12Hour(slot.endTime),
      });

      return acc;
    }, {});

    return availabilityData;
  };

  const handleMeetingDuration = (meetingDuration) => {
    const meetingDurationSplit = meetingDuration.split(" ");
    const timeType = meetingDurationSplit[1];
    const time = parseFloat(meetingDurationSplit[0]);
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

    const convertToMinutes = (time) => {
      const [hourMinute, period] = time.split(" ");
      const [hour, minute] = hourMinute.split(":").map(Number);

      let totalMinutes = hour * 60 + minute;

      // Adjust for PM times, except for 12 PM (noon)
      if (period === "PM" && hour !== 12) {
        totalMinutes += 720; // Add 12 hours
      }

      // Adjust for 12 AM (midnight)
      if (period === "AM" && hour === 12) {
        totalMinutes -= 720; // Subtract 12 hours
      }

      return totalMinutes;
    };

    const startMinutes = convertToMinutes(start);
    const endMinutes = convertToMinutes(end);

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
    const title = document.querySelector(".cb-add-title-input").value.trim();
    const availabilityData =
      availability === "Repeat weekly"
        ? repeatWeeklyData
        : convertDoesNotRepeatSlotsFormat();

    // Check if the title is empty
    if (!title) {
      setError("The title cannot be empty.");
      return; // Prevent saving
    }
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
      title: document.querySelector(".cb-add-title-input").value,
      email: localStorage.getItem("email"),
      meetingType,
      meetingDuration: handleMeetingDuration(meetingDuration),
      doesRepeatWeekly: availability === "Repeat weekly" ? true : false,
      availabilityData:
        availability === "Repeat weekly"
          ? repeatWeeklyData
          : convertDoesNotRepeatSlotsFormat(),
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

      if (response.ok) {
        const data = await response.json();
        setBookingUrl(data.bookingUrl); // Update the state with the generated URL
        console.log("Booking URL:", data.bookingUrl);
        // Update the parent state with the selected time slots
        setSelectedTimeSlots(availabilityData);
      } else {
        setError("Failed to save booking. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const toggleSchedulingLimits = () => {
    setIsOpen(!isOpen); // Toggle the state
  };

  const handleSchedulingLimitsChange = (limits) => {
    setSchedulingLimits(limits);
  };

  return (
    <div className="cb-create-meeting-sidebar">
      <h3 className="cb-create-booking-sidebar-title">
        BOOKABLE MEETING SCHEDULE
      </h3>
      <input
        type="text"
        className="cb-add-title-input"
        placeholder="Add Title"
      />
      <hr className="cb-sidebar-divider" />
      <div className="cb-gap"></div>
      <h3 className="cb-bold-title">Meeting type</h3>
      <h4 className="cb-booking-subtitle">What kind of meeting is this?</h4>
      <DropdownMenu
        options={["Office Hours", "1-1", "Group"]}
        defaultOption={meetingType}
        onChange={(selected) =>
          selected === "Custom..."
            ? setShowCustomMeetingModal(true)
            : setMeetingType(selected)
        }
      />
      <hr className="cb-sidebar-divider" />
      <h3 className="cb-bold-title">Meeting duration</h3>
      <h4 className="cb-booking-subtitle">
        How long should each meeting last?
      </h4>
      <DropdownMenu
        options={["30 minutes", "1 hour", "1.5 hours", "2 hours"]}
        defaultOption={meetingDuration}
        onChange={(selected) => setMeetingDuration(selected)}
      />
      <hr className="cb-sidebar-divider" />
      <h3 className="cb-bold-title">General availability</h3>
      <h4 className="cb-booking-subtitle">
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
      <hr className="cb-sidebar-divider" />
      <div className="cb-scheduling-window-title">
        <h3 className="cb-bold-title">Scheduling window</h3>
        <Chevron
          className={`cb-chevron ${isOpen ? "cb-rotated" : ""}`}
          onClick={toggleSchedulingLimits}
        />
      </div>
      {/* Subtitle dynamically updated */}
      <h4 className="cb-booking-subtitle">
        {schedulingLimits.maxDaysEnabled
          ? `${schedulingLimits.maxDays} days in advance`
          : "No limit in advance bookings"}{" "}
        to{" "}
        {schedulingLimits.minHoursEnabled
          ? `${schedulingLimits.minHours} hours before`
          : "no limit before the appointment"}
      </h4>
      {isOpen && (
        <SchedulingLimits
          onSchedulingLimitsChange={handleSchedulingLimitsChange}
        />
      )}
      {error && <div className="error-message">{error}</div>}
      {bookingUrl && (
        <div className="booking-url-container">
          <h4>Your booking URL:</h4>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
            {bookingUrl}
          </a>
        </div>
      )}
      <button className="cb-save-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default CreateBookingSidebar;

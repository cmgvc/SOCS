// Chloe Gavriloivc 260955835
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./booking-page.css";
import BookingCalendar from "./BookingCalendar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MeetingModal from "./MeetingModal";

export const BookingPage = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [recurring, setRecurring] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL;
  const daysOfWeek = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date));
  };

  const handleNextClick = () => {
    if (startIndex + 3 < getAvailabilitiesByDate().length) {
      setStartIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevClick = () => {
    if (startIndex > 0) {
      setStartIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const currentUrl = window.location.href;
        const response = await fetch(
          `${backendUrl}/availabilities/url`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: currentUrl }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch meetings");
        }

        const data = await response.json();
        setMeeting(data[0]);
        setRecurring(data[0].doesRepeatWeekly);
        
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, []);

  const parseTimeToMinutes = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  };

  const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const modifier = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${mins.toString().padStart(2, "0")} ${modifier}`;
  };

  const splitAvailabilityByDuration = (startTime, endTime, duration) => {
    const slots = [];
    let currentStart = parseTimeToMinutes(startTime);
    const end = parseTimeToMinutes(endTime);
    const totalMinutes = end - currentStart;
    const numberOfSlots = totalMinutes / duration;

    for (let i = 0; i < numberOfSlots; i++) {
      const currentEnd = currentStart + duration;
      slots.push({
        start: convertMinutesToTime(currentStart),
      });
      currentStart = currentEnd;
    }
    return slots;
  };

  const getAvailabilitiesForSelectedDay = () => {
    if (!meeting || !selectedDate) return [];
    const date = new Date(selectedDate);
    const selectedDay = date.getDay();
    const day = daysOfWeek[selectedDay];
    const dayAvailabilities = meeting.availabilityData[day];
    let duration = meeting.meetingDuration;
    duration = parseInt(duration, 10);
    if (!dayAvailabilities) return [];

    const slots = [];
    if (dayAvailabilities.length === 1 && dayAvailabilities[0] === "") {
      return [];
    }
    dayAvailabilities.forEach((availability) => {
      const { start, end } = availability;
      const splitSlots = splitAvailabilityByDuration(start, end, duration);
      splitSlots.forEach((slot) => {
        slots.push(slot);
      });
    });
    return slots;
  };

  const getAvailabilitiesByDate = () => {
    if (!meeting) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const slots = [];

    for (const date in meeting.availabilityData) {
      const dayAvailabilities = meeting.availabilityData[date];
      const dateParts = date.split("-");
      const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      dateObj.setHours(0, 0, 0, 0);

      if (dateObj < today) continue;

      const dateName = dateObj.toDateString();

      let duration = meeting.meetingDuration;
      duration = parseInt(duration, 10);

      if (
        !dayAvailabilities ||
        (dayAvailabilities.length === 1 && dayAvailabilities[0] === "")
      ) {
        continue;
      }

      let dateSlot = slots.find(
        (slot) => slot.dateObj.getTime() === dateObj.getTime()
      );
      if (!dateSlot) {
        dateSlot = { dateName, dateObj, slots: [] };
        slots.push(dateSlot);
      }

      dayAvailabilities.forEach((availability) => {
        const { start, end } = availability;
        const splitSlots = splitAvailabilityByDuration(start, end, duration);
        dateSlot.slots.push(...splitSlots);
      });
    }

    return slots.sort((a, b) => a.dateObj - b.dateObj);
  };

  const extractNameFromEmail = (email) => {
    if (!email) return "";
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      const capitalize = (str) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      return `${capitalize(parts[0])} ${capitalize(parts[1])}`;
    }
    return email;
  };

  const openModal = (time, meeting, date) => {
    setModalContent({
      time,
      title: meeting.title,
      email: meeting.email,
      name: extractNameFromEmail(meeting.email),
      date: date ? date.toDateString() : "",
      duration: meeting.meetingDuration,
      type: meeting.meetingType,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="booking-page">
      <h2>Booking Page</h2>
      <h3>{meeting?.title}</h3>
      <h3>{extractNameFromEmail(meeting?.email)}</h3>
      <div className="dates-container">
        {recurring ? (
          <>
            <p>Select a meeting date/time:</p>
            <div className="calendar-container">
              <BookingCalendar onDateChange={handleDateChange} />
              <div className="meetings-container">
                <div className="time-buttons">
                  {getAvailabilitiesForSelectedDay().map((slot, index) => (
                    <button
                      key={index}
                      className="meeting-btn"
                      onClick={() =>
                        openModal(slot.start, meeting, selectedDate)
                      }
                    >
                      {slot.start}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {selectedDate && (
              <p>Selected Date: {selectedDate.toDateString()}</p>
            )}
          </>
        ) : (
          <>
            <div className="non-recurring-meetings">
              <button
                onClick={handlePrevClick}
                disabled={startIndex === 0}
                className="panel-arrow"
              >
                <ArrowBackIosIcon />
              </button>
              {getAvailabilitiesByDate()
                .slice(startIndex, startIndex + 3)
                .map((dateObj, index) => (
                  <div className="non-recurring-meeting" key={index}>
                    <p>{dateObj.dateName}</p>
                    <div className="time-buttons">
                      {dateObj.slots.map((slot, slotIndex) => (
                        <button
                          key={slotIndex}
                          className="meeting-btn"
                          onClick={() => openModal(slot.start, meeting)}
                        >
                          {slot.start}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              <button
                onClick={handleNextClick}
                disabled={startIndex + 3 >= getAvailabilitiesByDate().length}
                className="panel-arrow"
              >
                <ArrowForwardIosIcon />
              </button>
            </div>
          </>
        )}
      </div>
      {modalOpen && (
        <MeetingModal
          onClose={closeModal}
          content={modalContent}
        ></MeetingModal>
      )}
      <a href="/book">
        <button className="back-btn">Back</button>
      </a>
    </div>
  );
};

export default BookingPage;

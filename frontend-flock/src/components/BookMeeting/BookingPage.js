// Chloe Gavriloivc 260955835
import React, { useState, useEffect } from "react";
import "./booking-page.css";
import BookingCalendar from "./BookingCalendar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MeetingModal from "./MeetingModal";

export const BookingPage = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [meeting, setMeeting] = useState(null);
  const [recurring, setRecurring] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
  const daysOfWeek = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  };

  // fetch meeting availability data
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const currentUrl = window.location.href;
        const response = await fetch(`${backendUrl}/availabilities/url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: currentUrl }),
        });

        if (!response.ok) throw new Error("Failed to fetch meetings");
        const data = await response.json();

        setMeeting(data[0]);
        setRecurring(data[0].doesRepeatWeekly);

        // fetch full meetings
        const bookedResponse = await fetch(`${backendUrl}/meetings/full`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            faculty: data[0].email,
            title: data[0].title,
          }),
        });
        const bookedData = await bookedResponse.json();
        setBookedTimes(
          bookedData.map((meeting) => ({
            date: new Date(meeting.date).toDateString(),
            time: meeting.time,
          }))
        );
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };
    fetchMeetings();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setAvailableTimes(getAvailabilitiesForSelectedDay());
    }
  }, [selectedDate, meeting, bookedTimes]);

  const convertToEST = (date) => {
    const estDate = new Date(
      date.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
    return estDate;
  };

  // check if time has already passed
  const isTimeSlotAvailable = (slotTime, selectedDate) => {
    const estDate = convertToEST(selectedDate);
    const [time, modifier] = slotTime.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    const slotDateTime = new Date(estDate);
    slotDateTime.setHours(hours, minutes, 0, 0);

    const currentTime = convertToEST(new Date());

    return slotDateTime > currentTime;
  };

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

  // split availability into slots based on duration
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

  // filter out booked (full) slots
  const filterBookedSlots = (slots, bookedTimes, selectedDate) => {
    const validBookedTimes = Array.isArray(bookedTimes) ? bookedTimes : [];

    return slots.filter((slot) => {
      const timeAvailable = isTimeSlotAvailable(slot.start, selectedDate);

      const notBooked = !validBookedTimes.some(
        (booked) =>
          booked.time === slot.start &&
          booked.date === selectedDate.toDateString()
      );

      return slot.start && timeAvailable && notBooked;
    });
  };

  // availabilities when meeting is recurring (weekly)
  const getAvailabilitiesForSelectedDay = () => {
    if (!meeting || !selectedDate) return [];
    const date = new Date(selectedDate);
    const selectedDay = daysOfWeek[date.getDay()];

    const dayAvailabilities = meeting.availabilityData[selectedDay];

    if (!dayAvailabilities || dayAvailabilities.length === 0) return [];

    const duration = parseInt(meeting.meetingDuration, 10);
    const slots = dayAvailabilities.flatMap(({ start, end }) =>
      splitAvailabilityByDuration(start, end, duration)
    );
    const filteredSlots = filterBookedSlots(slots, bookedTimes, selectedDate);
    return filteredSlots;
  };

  // availabilities when meeting is not recurring
  const getAvailabilitiesByDate = () => {
    if (!meeting) return [];
    const today = convertToEST(new Date());
    today.setHours(0, 0, 0, 0);

    const slots = [];
    Object.entries(meeting.availabilityData).forEach(
      ([dateString, availabilities]) => {
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        date.setHours(0, 0, 0, 0);
        if (date < today) {
          return;
        }
        const duration = parseInt(meeting.meetingDuration, 10);
        const daySlots = [];
        availabilities.forEach(({ start, end }) => {
          if (!start || !end) {
            return;
          }

          const slotsForThisAvailability = splitAvailabilityByDuration(
            start,
            end,
            duration
          );
          daySlots.push(...slotsForThisAvailability);
        });

        if (daySlots.length === 0) {
          return;
        }

        // Filter out booked times and past times
        const availableSlots = daySlots.filter(
          (slot) =>
            (date.toDateString() === today.toDateString()
              ? isTimeSlotAvailable(slot.start, date)
              : true) &&
            !bookedTimes.some(
              (booked) =>
                booked.time === slot.start &&
                booked.date === date.toDateString()
            )
        );

        if (availableSlots.length === 0) {
          return;
        }

        slots.push({
          dateName: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          dateObj: date,
          slots: availableSlots,
        });
      }
    );
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

  // handle pagination
  const availableDates = getAvailabilitiesByDate();
  const showArrows = availableDates.length > 3;

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
                  {availableTimes.length === 0 && <p>No available times</p>}
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
              {availableDates.length === 0 && <p>No available times</p>}
              {showArrows && (
                <button
                  onClick={handlePrevClick}
                  disabled={startIndex === 0}
                  className="panel-arrow"
                >
                  <ArrowBackIosIcon />
                </button>
              )}
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
                          onClick={() =>
                            openModal(slot.start, meeting, dateObj.dateObj)
                          }
                        >
                          {slot.start}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              {showArrows && (
                <button
                  onClick={handleNextClick}
                  disabled={startIndex + 3 >= availableDates.length}
                  className="panel-arrow"
                >
                  <ArrowForwardIosIcon />
                </button>
              )}
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

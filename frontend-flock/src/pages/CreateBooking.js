import React, { useState } from "react";
// import CreateBookingCalendar from "../components/CreateBookingCalendar";
import CreateBookingSidebar from "../components/CreateBookingSidebar";

const BookingPage = () => {
  const [events, setEvents] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const handleSlotSelect = (slot) => {
    // Handle adding availability
    console.log("Selected slot:", slot);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    // Handle saving form data
  };

  const handleCancelMeeting = (id) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id));
  };

  return (
    <div className="booking-page">
      {/* <Header /> */}
      <CreateBookingSidebar onSave={handleSaveForm} />
      <main className="main-content">
        {/* <CreateBookingCalendar */}
        events={events}
        onSlotSelect={handleSlotSelect}
        {/* /> */}
        {/* <DashboardView meetings={meetings} onCancel={handleCancelMeeting} /> */}
      </main>
    </div>
  );
};

export default BookingPage;

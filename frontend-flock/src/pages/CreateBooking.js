/* coded by Danielle Wahrhaftig */
import React, { useState } from "react";
import CreateBookingCalendar from "../components/CreateBooking/CreateBookingCalendar";
import CreateBookingSidebar from "../components/CreateBooking/CreateBookingSidebar";
import "./create-booking-page.css";

const CreateBookingPage = () => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  return (
    <div className="cb-booking-page">
      <CreateBookingSidebar setSelectedTimeSlots={setSelectedTimeSlots} />
      <CreateBookingCalendar selectedTimeSlots={selectedTimeSlots} />
    </div>
  );
};

export default CreateBookingPage;

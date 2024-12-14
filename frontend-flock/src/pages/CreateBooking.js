import React, { useState } from "react";
import CreateBookingCalendar from "../components/CreateBooking/CreateBookingCalendar";
import CreateBookingSidebar from "../components/CreateBooking/CreateBookingSidebar";
import "./create-booking-page.css";

const CreateBookingPage = () => {
  return (
    <div className="cb-booking-page">
      <CreateBookingSidebar />
      <CreateBookingCalendar />
    </div>
  );
};

export default CreateBookingPage;

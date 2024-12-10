import React, { useState } from "react";
import CreateBookingCalendar from "../components/CreateBookingCalendar";
import CreateBookingSidebar from "../components/CreateBookingSidebar";
import "./create-booking-page.css";

const CreateBookingPage = () => {
  return (
    <div className="booking-page">
      <CreateBookingSidebar />
      <CreateBookingCalendar />
    </div>
  );
};

export default CreateBookingPage;

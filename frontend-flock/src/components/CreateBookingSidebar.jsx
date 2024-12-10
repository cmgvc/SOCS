// coded by Danielle Wahrhaftig

import React, { useState } from "react";
import "./create-booking-sidebar.css";

const CreateBookingSidebar = () => {
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="create-meeting-sidebar">
      <h3 className="booking-sidebar-title">BOOKABLE MEETING SCHEDULE</h3>
      <h3 className="add-title">Add title</h3>
      <hr className="sidebar-divider" />
      <div className="gap"></div>
      <h3 className="bold-title">Meeting type</h3>
      <h4 className="booking-subtitle">What kind of meeting is this?</h4>
      <hr className="sidebar-divider" />
      <h3 className="bold-title">Meeting duration</h3>
      <h4 className="booking-subtitle">How long should each meeting last?</h4>
      <hr className="sidebar-divider" />
      <h3 className="bold-title">General availability</h3>
      <h4 className="booking-subtitle">
        Set when you're regularly available for meetings.
      </h4>
      <hr className="sidebar-divider" />
      <h3 className="bold-title">Scheduling window</h3>
      <h4 className="booking-subtitle">30 days in advance to 4 hours before</h4>
      <hr className="sidebar-divider" />
      <h3 className="bold-title">Adjusted availability</h3>
      <h4 className="booking-subtitle">
        Indicate times you're available for specific dates
      </h4>

      <button className="save-btn">Save</button>
    </div>
  );
};

export default CreateBookingSidebar;

// Coded by Danielle Wahrhaftig
import React, { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import CustomDurationModal from "./CustomDurationModal";
import CustomMeetingModal from "./CustomMeetingModal"; // Import Custom Meeting Modal
import "./create-booking-sidebar.css";

const CreateBookingSidebar = () => {
  const [meetingType, setMeetingType] = useState("1-1");
  const [meetingDuration, setMeetingDuration] = useState("1 hour");
  const [availability, setAvailability] = useState("Repeat Weekly");
  const [showCustomDurationModal, setShowCustomDurationModal] = useState(false);
  const [showCustomMeetingModal, setShowCustomMeetingModal] = useState(false); // Manage Custom Meeting Modal

  const handleSave = () => {
    const bookingData = {
      title: document.querySelector(".add-title-input").value,
      meetingType,
      meetingDuration,
      availability,
    };

    console.log("Booking Data:", bookingData);
    // Handle save logic (e.g., send to API)
  };

  const handleCustomDurationSubmit = (duration) => {
    setMeetingDuration(duration);
    setShowCustomDurationModal(false);
  };

  const handleCustomMeetingSubmit = (customMeetingType) => {
    setMeetingType(customMeetingType); // Update with custom meeting type
    setShowCustomMeetingModal(false); // Close the modal
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
        options={[
          "15 minutes",
          "30 minutes",
          "45 minutes",
          "1 hour",
          "1.5 hours",
          "2 hours",
          "Custom...",
        ]}
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
        options={["Repeat Weekly", "Does not repeat", "Custom..."]}
        defaultOption={availability}
        onChange={(selected) => setAvailability(selected)}
      />
      <hr className="sidebar-divider" />
      <h3 className="bold-title">Scheduling window</h3>
      <h4 className="booking-subtitle">30 days in advance to 4 hours before</h4>
      <hr className="sidebar-divider" />
      <h3 className="bold-title">Adjusted availability</h3>
      <h4 className="booking-subtitle">
        Indicate times you're available for specific dates.
      </h4>
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

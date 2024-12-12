// Coded by Danielle Wahrhaftig
import React from "react";
import PropTypes from "prop-types";
import "./custom-meeting-modal.css";

const CustomMeetingModal = ({
  isVisible,
  onClose,
  onSubmit,
  defaultValue = "",
}) => {
  const [meetingType, setMeetingType] = React.useState(defaultValue);

  const handleSubmit = () => {
    if (meetingType.trim() === "") {
      alert("Meeting type cannot be empty.");
      return;
    }
    onSubmit(meetingType.trim()); // Pass the custom meeting type to the parent
    onClose(); // Close the modal
  };

  if (!isVisible) return null;

  return (
    <div className="custom-meeting-modal-overlay">
      <div className="custom-meeting-modal">
        <h3 className="custom-meeting-modal-title">Custom Meeting Type</h3>
        <div className="custom-meeting-inputs">
          <input
            type="text"
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value)}
            placeholder="Enter meeting type"
            className="custom-meeting-text-input"
          />
        </div>
        <div className="custom-meeting-modal-actions">
          <button onClick={onClose} className="custom-meeting-cancel-button">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="custom-meeting-submit-button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

CustomMeetingModal.propTypes = {
  isVisible: PropTypes.bool.isRequired, // Determines if the modal is shown
  onClose: PropTypes.func.isRequired, // Function to close the modal
  onSubmit: PropTypes.func.isRequired, // Function to handle submission
  defaultValue: PropTypes.string, // Default value for the meeting type
};

export default CustomMeetingModal;

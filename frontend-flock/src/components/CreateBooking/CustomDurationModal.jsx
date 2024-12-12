// Coded by Danielle Wahrhaftig
import React from "react";
import PropTypes from "prop-types";
import "./custom-duration-modal.css";

const CustomDurationModal = ({
  isVisible,
  onClose,
  onSubmit,
  defaultValue = 1,
  defaultUnit = "hours",
}) => {
  const [durationValue, setDurationValue] = React.useState(defaultValue);
  const [durationUnit, setDurationUnit] = React.useState(defaultUnit);

  const handleSubmit = () => {
    // determine the correct label (singular or plural)
    const unitLabel =
      durationValue === 1
        ? durationUnit === "hours"
          ? "hour"
          : "minute" // Singular
        : durationUnit; // Plural

    const customDuration = `${durationValue} ${unitLabel}`;
    onSubmit(customDuration); // Pass the custom duration to the parent
    onClose(); // Close the modal
  };

  const handleDurationChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setDurationValue("");
      return;
    }

    const parsedValue = parseFloat(value);

    // Validation: Ensure value is within valid bounds
    if (durationUnit === "hours" && parsedValue > 24) {
      alert("Duration cannot exceed 24 hours.");
      setDurationValue(24); // Set to max hours
    } else if (durationUnit === "minutes" && parsedValue > 1440) {
      alert("Duration cannot exceed 1440 minutes.");
      setDurationValue(1440); // Set to max minutes
    } else if (parsedValue <= 0 || isNaN(parsedValue)) {
      setDurationValue(1); // Set to minimum of 1
    } else {
      setDurationValue(parsedValue); // Allow valid floating-point values
    }
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;

    // Adjust duration if switching units exceeds limits
    if (newUnit === "hours" && durationValue > 24) {
      setDurationValue(24);
    } else if (newUnit === "minutes" && durationValue > 1440) {
      setDurationValue(1440);
    }

    setDurationUnit(newUnit);
  };

  if (!isVisible) return null;

  return (
    <div className="custom-duration-modal-overlay">
      <div className="custom-duration-modal">
        <h3 className="custom-duration-modal-title">Custom duration</h3>
        <div className="custom-duration-inputs">
          <input
            type="number"
            min="1"
            value={durationValue}
            onChange={handleDurationChange}
            className="custom-duration-number-input"
          />
          <select
            value={durationUnit}
            onChange={handleUnitChange}
            className="custom-duration-unit-dropdown"
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
          </select>
        </div>
        <div className="custom-duration-modal-actions">
          <button onClick={onClose} className="custom-duration-cancel-button">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="custom-duration-submit-button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

CustomDurationModal.propTypes = {
  isVisible: PropTypes.bool.isRequired, // Determines if the modal is shown
  onClose: PropTypes.func.isRequired, // Function to close the modal
  onSubmit: PropTypes.func.isRequired, // Function to handle submission
  defaultValue: PropTypes.number, // Default numeric value for duration
  defaultUnit: PropTypes.string, // Default unit for duration (e.g., "hours")
};

export default CustomDurationModal;

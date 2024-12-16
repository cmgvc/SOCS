// Jacob Weldon 20986471
import React, { useState } from "react";
import CalendarComponent from "../components/date-select-calendar";
import { useLocation, useNavigate } from "react-router-dom";
import "./MeetingRequests.css";

function MeetingRequest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { professorName } = location.state || {};
  const [newProfessorName, setNewProfessorName] = useState("");
  const [error, setError] = useState("");

  const [meetingDate, setMeetingDate] = useState(null); // CalendarComponent provides this
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [status] = useState("Pending"); // Default status while requesting meeting
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

  const handleInputChange = (e) => {
    setNewProfessorName(e.target.value);
  };

  const handleSearchClick = () => {
    if (newProfessorName.trim() === "") {
      setError("Please enter a professor's name.");
      return;
    } else {
      setError(""); // Clear any existing errors
      console.log(`Looking up new professor: ${newProfessorName}`);

      // Navigate to the same page with the new professor's name
      navigate("/meetingRequest", {
        state: { professorName: newProfessorName },
      });
    }
  };

  // Handler for the "Request new meeting time" button
  const handleRequestMeeting = async () => {
    // Validate inputs
    if (!meetingDate || !meetingTime || !meetingDuration || !meetingType) {
      setError("Please fill in all the meeting details.");
      return;
    }

    const durationInt = parseInt(meetingDuration, 10);
    if (isNaN(durationInt) || durationInt <= 0) {
      setError("Please enter a valid duration in whole minutes.");
      return;
    }

    // Combine date and time into a single Date object
    const [hours, minutes] = meetingTime.split(":");
    const meetingDateTime = new Date(meetingDate);
    meetingDateTime.setHours(parseInt(hours, 10));
    meetingDateTime.setMinutes(parseInt(minutes, 10));

    // Create the meeting object
    const meeting = {
      title: "Requested Meeting",
      duration: durationInt,
      date: meetingDateTime,
      faculty: professorName || newProfessorName,
      participants: [localStorage.getItem("email")],
      status: status,
      meetingType: meetingType,
      time: meetingTime,
    };

    try {
      const response = await fetch(`${backendUrl}/alternateMeetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meeting),
      });
      if (response.ok) {
        // Successfully created meeting
        alert("Meeting requested successfully!");
        // navigate back to profLookup page
        navigate("/profLookup");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to request meeting.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while requesting the meeting.");
    }
  };

  return (
    <div className="request-wrapper">
      <div className="request-container">
        <div className="header-section">
          <div className="label-section">
            <label>Enter professor or TA's name:</label>
          </div>
          <div className="title-section">
            <h1 className="lookup-title">Request a Meeting</h1>
          </div>
          <div className="empty-section"></div>

          <div className="input-section">
            <input
              id="professorName"
              className="input-search"
              type="text"
              placeholder="Name"
              value={newProfessorName}
              onChange={handleInputChange}
              required
            />
            <button className="lookup-button2" onClick={handleSearchClick}>
              Search
            </button>
          </div>
          <div className="professor-name">
            {professorName ? (
              <p>
                <strong>{professorName}</strong>
              </p>
            ) : (
              <p>No professor selected.</p>
            )}
          </div>
        </div>

        <div className="meeting-section">
          <div className="meeting-details">
            <CalendarComponent onDateChange={setMeetingDate} />
          </div>

          <div className="meeting-inputs">
            <label className="lookup-task" htmlFor="meetingTime">
              Enter desired time:
            </label>
            <input
              id="meetingTime"
              className="input"
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              required
            />

            <label className="lookup-task" htmlFor="meetingDuration">
              Enter desired duration (in minutes):
            </label>
            <input
              id="meetingDuration"
              className="input"
              type="number"
              placeholder="30"
              value={meetingDuration}
              onChange={(e) => setMeetingDuration(e.target.value)}
              min="1"
              step="1"
              max="120"
              required
            />

            <label className="lookup-task" htmlFor="meetingType">
              Enter desired type of meeting:
            </label>
            <input
              id="meetingType"
              className="input"
              type="text"
              placeholder="One on one"
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              required
            />
            <button className="lookup-button2" onClick={handleRequestMeeting}>
              Request new meeting time
            </button>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default MeetingRequest;

import React, { useState } from "react";

const MeetingCard = ({ meeting }) => {
  const email = localStorage.getItem("email");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const isFaculty = localStorage.getItem("isFaculty");
  const {
    title,
    date,
    time,
    faculty: organizer,
    duration,
    meetingType,
    _id: meetingId,
    status,
  } = meeting;

  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString) => {
    const newDate = new Date(dateString);
    const dateOptions = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    };
    const formattedDate = newDate.toLocaleDateString("en-US", dateOptions);
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York",
    };
    const formattedTime = newDate.toLocaleTimeString("en-US", timeOptions);
    return { formattedDate, formattedTime, newDate };
  };

  const { formattedDate, formattedTime, newDate } = formatDate(date);
  const currentDate = new Date();
  const isPastOrStarted = currentDate >= newDate;

  const handleCancelMeeting = async () => {
    try {
        let endpoint = "/meetings/cancel";
        if (isFaculty === "true") {
            endpoint = "/meetings/cancelFaculty";
        }
      await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, meetingId }),
      });
      alert("Meeting cancelled successfully.");
      setShowModal(false);
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      alert("Error cancelling meeting.");
    }
  };

  const handleUpdateMeetingStatus = async (status) => {
    try {
      await fetch(`${backendUrl}/meetings/updateStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, meetingId, status }),
      });
      window.location.reload();
    } catch (error) {
      console.error(`Error updating meeting status to ${status}:`, error);
    }
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

  return (
    <div className="meeting-card">
      <h4>{formattedDate}</h4>
      <div className="meeting-date">
        <button>{time}</button>
        <button>{duration} min</button>
      </div>
      <p>
        {title}
        <br />
        <br />
        {meetingType}
        <br />
        <br />
        <b>{extractNameFromEmail(organizer)}</b>
      </p>

      {!isPastOrStarted && status === "Accepted" && (
        <button className="cancel-btn" onClick={() => setShowModal(true)}>
          Cancel
        </button>
      )}

      {!isPastOrStarted && status === "Pending" && (
        <div className="pending-actions">
          <button
            className="cancel-btn"
            onClick={() => handleUpdateMeetingStatus("Accepted")}
          >
            Accept
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            className="cancel-btn"
            onClick={() => handleUpdateMeetingStatus("Declined")}
          >
            Decline
          </button>
        </div>
      )}

      {!isFaculty && (status === "Pending" || status === "Declined") && (
        <p>
          <b>Status: {status}</b>
        </p>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Are you sure you want to cancel the meeting?</h4>
            <button className="cancel-btn" onClick={handleCancelMeeting}>
              Yes
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;

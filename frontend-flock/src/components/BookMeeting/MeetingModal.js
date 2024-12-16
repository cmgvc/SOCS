import React, { useState } from "react";
import "./meeting-modal.css";

const MeetingModal = ({ onClose, content }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [meetingBooked, setMeetingBooked] = useState(false);
    const backendUrl =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

    const handleBookMeeting = async () => {
    const studentEmail = localStorage.getItem("email");
    if (studentEmail === content.email) {
        setErrorMessage("Cannot book your own meeting");
        return; 
    }

    try {
        const response = await fetch(`${backendUrl}/meetings/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: content.title,
                faculty: content.email,
                date: content.date,
                duration: content.duration,
                meetingType: content.type,
                student: localStorage.getItem("email"),
                status: "Accepted",
                time: content.time,
            }),
        });

        if (response.status === 400) {
            setErrorMessage("Meeting already booked");
        } else if (!response.ok) {
            throw new Error("Failed to book meeting");
        } else {
            setErrorMessage(""); 
            setMeetingBooked(true);
        }

        const data = await response.json();
    } catch (error) {
        console.error("Error booking meeting:", error);
        setErrorMessage("Error booking the meeting. Please try again.");
    }
    };

    return (
        <div className="meeting-modal-overlay">
            <div className="meeting-modal-content">
            <div
                className={meetingBooked ? `meeting-modal-header-success` : "meeting-modal-header"}>
                {meetingBooked ? (
                <>
                    <h3>
                        <b>Meeting Booked!</b>
                    </h3>
                    <a href="/dashboard">
                        <button className="close-btn">Go to Dashboard</button>
                    </a>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="close-btn" onClick={onClose}>
                        Close
                    </button>
                    <p>
                        <strong>{content.date}</strong>
                    </p>
                    <p>
                        <strong>Time:</strong> {content.time}
                    </p>
                </>
                ) : content ? (
                <>
                    <div className="booking-modal-content">
                    <h3>
                        <b>{content.title}</b>
                    </h3>
                    <p>
                        <strong>{content.date}</strong>
                    </p>
                    <p>
                        <strong>Time:</strong> {content.time}
                    </p>
                    <p>{content.duration} min</p>
                    <p>{content.name}</p>
                    <p>{content.email}</p>
                    <p>
                        <strong>Meeting type:</strong> {content.type}
                    </p>
                    {errorMessage && (
                        <p style={{ color: "var(--primary-red)" }}>*{errorMessage}</p>
                    )}
                    <button
                        className="close-btn"
                        onClick={handleBookMeeting}
                    >
                        Book Meeting
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="close-btn" onClick={onClose}>
                        Close
                    </button>
                    </div>
                </>
                ) : (
                <>
                    <p>Loading...</p>
                    <button className="close-btn" onClick={onClose}>
                    Close
                    </button>
                </>
                )}
            </div>
            </div>
        </div>
    );
};

export default MeetingModal;

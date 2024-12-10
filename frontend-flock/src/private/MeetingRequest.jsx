import React, { useState } from "react";
import CalendarComponent from "../components/date-select-calendar";
import { useLocation, useNavigate } from "react-router-dom";
import "./MeetingRequests.css";

function MeetingRequest() {
    const location = useLocation();
    const navigate = useNavigate();
    const { professorName } = location.state || {};
    const [newProfessorName, setNewProfessorName] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setNewProfessorName(e.target.value);
    };

    const handleSearchClick = () => {
        if (newProfessorName.trim() === '') {
            setError('Please enter a professor\'s name.');
            return;
        } else {
            setError(''); // Clear any existing errors
            console.log(`Looking up new professor: ${newProfessorName}`);
            
            // Navigate to the same page with the new professor's name
            navigate('/meetingRequest', { state: { professorName: newProfessorName } });
        }
    };

    return (
        <div className="request-wrapper">
            <div className="request-container">
                {/* Header Section: Label, Title, and Professor Name */}
                <div className="header-section">
                    {/* Row 1: Label and Title */}
                    <div className="label-section">
                        <label htmlFor="professorName">Enter person’s name:</label>
                    </div>
                    <div className="title-section">
                        <h1 className="lookup-title">Request a Meeting</h1>
                    </div>
                    {/* Empty div for grid alignment */}
                    <div className="empty-section"></div>

                    {/* Row 2: Input, Button, and Professor Name */}
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
                        <button className="lookup-button" onClick={handleSearchClick}>Search</button>
                    </div>
                    <div className="professor-name">
                        {professorName ? (
                            <p><strong>{professorName}</strong></p>
                        ) : (
                            <p>No professor selected.</p>
                        )}
                    </div>
                </div>
                
                {/* Meeting Section */}
                <div className="meeting-section">
                    <div className="meeting-details">
                        <CalendarComponent />
                    </div>
                    
                    <div className="meeting-inputs">
                        <label className="lookup-task" htmlFor="meetingTime">Enter desired time:</label>
                        <input
                            id="meetingTime"
                            className="input"
                            type="time"
                            placeholder="12:00 pm"
                            required
                        />

                        <label className="lookup-task" htmlFor="meetingDuration">Enter desired duration:</label>
                        <input
                            id="meetingDuration"
                            className="input"
                            type="text"
                            placeholder="1 hour"
                            required
                        />

                        <label className="lookup-task" htmlFor="meetingType">Enter desired type of meeting:</label>
                        <input
                            id="meetingType"
                            className="input"
                            type="text"
                            placeholder="One on one"
                            required
                        />
                        <button className="lookup-button" onClick={""}>Request new meeting time</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingRequest;

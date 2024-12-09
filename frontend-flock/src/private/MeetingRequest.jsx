import React from "react";
import CalendarComponent from "../components/date-select-calendar"
import { useLocation, useNavigate } from "react-router-dom";
import "./MeetingRequests.css";

function Request() {
    const location = useLocation();
    const navigate = useNavigate();
    const { professorName } = location.state || {};
    return (
        <div className="request-wrapper">
            <div className="request-container">
                <h1 className="lookup-title">Request a Meeting</h1>
                {/* Display the professor's name */}
                {professorName ? (
                    <p className="professor-name"><strong>{professorName}</strong></p>
                ) : (
                    <p className="professor-name">No professor selected.</p>
                )}
                <table>
                    <tr>
                        <td className="meeting-details">
                            <CalendarComponent /> </td>
                            
                        <div className="meeting-inputs">
                            <p className="lookup-task">Enter desired time:</p>
                            <input
                                className="input"
                                type="time"
                                placeholder="12:00 pm"
                                required
                            />

                            <p className="lookup-task">Enter desired duration:</p>
                            <input
                                className="input"
                                type="text" // Corrected input type
                                placeholder="1 hour"
                                required
                            />

                            <p className="lookup-task">Enter desired type of meeting:</p>
                            <input
                                className="input"
                                type="text" // Corrected input type
                                placeholder="One on one"
                                required
                            />
                            <p></p>
                            <button className="lookup-button" onClick={""}>Request new meeting time</button>
                        </div>
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default Request;
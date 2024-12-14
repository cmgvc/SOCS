// CHloe Gavrilovic 260955835
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingCalendar from './BookingCalendar';
import CalendarComponent from '../date-select-calendar';
import './faculty-page.css';

function FacultyPage({ facultyName }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
    const [meetings, setMeetings] = useState([]);

    const handleDateChange = (date) => {
        const newDate = new Date(date);
        setSelectedDate(newDate);
    };

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await fetch(`${backendUrl}/availabilities`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: facultyName.email }),
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch meetings');
                }
                const data = await response.json();
                setMeetings(data);
            } catch (error) {
                console.error('Error fetching meetings:', error);
            }
        };
        if (facultyName.email) {
            fetchMeetings();
        }
    }, [facultyName.email]);

    const getStartTimesForSelectedDay = (meeting) => {
        if (!selectedDate) return [];
        const selectedDay = daysOfWeek[selectedDate.getDay()];
        const availabilities = meeting.generalAvailability?.filter((availability) => availability.dayOfWeek === selectedDay);
        return availabilities ? availabilities.map((availability) => availability.startTime) : [];
    };

    const oneOnOneMeetings = meetings.filter(meeting => meeting.title === "1-on-1");
    const groupMeetings = meetings.filter(meeting => meeting.title === "Group meeting");

    return (
        <div>
            <h2>{facultyName?.firstName} {facultyName?.lastName}</h2>
            <p>Select a meeting date:</p>
            <div className='dates-container'>
                <div className='calendar-container'>
                    <CalendarComponent />
                    {/* <BookingCalendar onDateChange={handleDateChange} /> */}
                </div>
                {meetings.length > 0 && (
                    <div className="meetings-container">
                        <div className="column">
                            <h3>1-on-1 Meetings:</h3>
                            <div>
                                {oneOnOneMeetings.map((meeting) => {
                                    const startTimes = getStartTimesForSelectedDay(meeting);
                                    return (
                                        startTimes.length > 0 && (
                                            <div key={meeting._id}>
                                                {startTimes.map((startTime, index) => (
                                                    <Link to={`/meeting/${facultyName.email}/${meeting._id}/${startTime}`} key={index}>
                                                        <button className='meeting-btn'>
                                                            {startTime}
                                                        </button>
                                                    </Link>
                                                ))}
                                            </div>
                                        )
                                    );
                                })}
                            </div>
                        </div>
                        <div className="column">
                            <h3>Group Meetings:</h3>
                            <div>
                                {groupMeetings.map((meeting) => {
                                    const startTimes = getStartTimesForSelectedDay(meeting);
                                    return (
                                        startTimes.length > 0 && (
                                            <div key={meeting._id}>
                                                {startTimes.map((startTime, index) => (
                                                    <Link to={`/meeting/${facultyName.email}/${meeting._id}/${startTime}`} key={index}>
                                                        <button className='meeting-btn'>
                                                            {startTime}
                                                        </button>
                                                    </Link>
                                                ))}
                                            </div>
                                        )
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {selectedDate && (
                <p>Selected Date: {selectedDate?.toDateString()}</p>
            )}
        </div>
    );
}

export default FacultyPage;

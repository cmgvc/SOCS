// Chloe Gavrilovic 260955835
import React, { useState, useEffect } from 'react';
import BookingCalendar from './BookingCalendar';
import './faculty-page.css';

function FacultyPage({ facultyName }) {
    const [selectedDate, setSelectedDate] = useState(null); 
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const backendUrl = 'http://localhost:5001';
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


    const getStartTimeForSelectedDay = (meeting) => {
        if (!selectedDate) return null;
        const selectedDay = daysOfWeek[selectedDate.getDay()];
        const availability = meeting.generalAvailability?.find((availability) => availability.dayOfWeek === selectedDay);
        if (availability) {
            return availability.startTime;
        }
        return null; 
    };

    return (
        <div>
            <h2>{facultyName?.firstName} {facultyName?.lastName}</h2>
            <p>Select a meeting date:</p>
            <div className='dates-container'>
                <div className='calendar-container'>
                    <BookingCalendar onDateChange={handleDateChange} />
                </div>
                {meetings.length > 0 && (
                    <div>
                        <p>Available Meetings:</p>
                        <div>
                            {meetings.filter((meeting) => getStartTimeForSelectedDay(meeting)).map((meeting) => (
                                <button className='meeting-btn' key={meeting._id}>
                                    {getStartTimeForSelectedDay(meeting)}
                                </button>
                            ))}
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

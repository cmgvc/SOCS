// Chloe Gavrilovic 260955835
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function MeetingPage() {
    const { facultyEmail, meetingId, startTime } = useParams(); // Get facultyEmail, meetingId, and startTime from the URL
    const [availability, setAvailability] = useState(null);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await fetch(`http://localhost:5001/availabilities/${facultyEmail}/${meetingId}/${startTime}`);
                if (!response.ok) {
                    throw new Error('Availability not found');
                }
                const data = await response.json();
                setAvailability(data);
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        if (facultyEmail && meetingId && startTime) {
            fetchAvailability();
        }
    }, [facultyEmail, meetingId, startTime]);

    if (!availability) {
        return <p>Loading availability details...</p>;
    }

    return (
        <div>
            <h2>{availability.title}</h2>
            <p>Location: {availability.location}</p>
            <p>Start Time: {availability.startTime}</p>
            <p>End Time: {availability.endTime}</p>
            <button>Book this Meeting</button>
        </div>
    );
}

export default MeetingPage;

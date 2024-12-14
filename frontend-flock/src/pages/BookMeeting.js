import React, { useState } from 'react';
import '../styles/BookMeeting.css';

function BookMeeting() {
    const [meetingUrl, setMeetingUrl] = useState('');
    const backendUrl = "http://localhost:5001";

    const handleMeetingUrlSearch = async () => {
        if (!meetingUrl.trim()) {
            alert('Please enter a valid meeting URL');
            return;
        }

        try {
            console.log(`Checking URL: ${meetingUrl}`);
            const response = await fetch(`${backendUrl}/availabilities/url?url=${meetingUrl}`);

            if (!response.ok) {
                throw new Error('Failed to check availability');
            }

            const data = await response.json();

            if (data) {
                window.location.href = meetingUrl;
            } else {
                alert('Meeting URL does not exist in the system.');
            }
        } catch (error) {
            console.error('Error checking meeting URL:', error);
            alert('Error occurred while checking the meeting URL.');
        }
    };

    return (
        <div className="booking">
            <h1>Book a meeting</h1>
            <div>
                <div className="booking-inputs">
                    <div className="booking-input">
                        <p>Enter meeting URL:</p>
                        <input
                            type="text"
                            placeholder="e.g. https://example.com/bookings"
                            value={meetingUrl}
                            onChange={(e) => setMeetingUrl(e.target.value)}
                        />
                        <button onClick={handleMeetingUrlSearch}>Search</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookMeeting;

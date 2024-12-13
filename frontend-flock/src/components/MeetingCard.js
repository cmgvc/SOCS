// Chloe Gavrilovic 260955835
import React from 'react';

const MeetingCard = ({ meeting }) => {
    const email = localStorage.getItem('email');
    const backendUrl = 'http://localhost:5001';
    const title = meeting.title;
    const date = meeting.date;
    const formatDate = (dateString) => {
        const newDate = new Date(dateString);
        const dateOptions = {
          weekday: 'short',
          year: 'numeric',
          month: 'long',   
          day: 'numeric',
          timeZone: 'America/New_York'
        };
        const formattedDate = newDate.toLocaleDateString('en-US', dateOptions);
        const timeOptions = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'America/New_York'
        };
        const formattedTime = newDate.toLocaleTimeString('en-US', timeOptions);
        return { formattedDate, formattedTime, newDate };
    };
    const { formattedDate, formattedTime, newDate } = formatDate(date);
    const organizer = meeting.faculty;
    const duration = meeting.duration;
    const meetingId = meeting._id;
    const currentDate = new Date();
    const isPastOrStarted = currentDate >= newDate;

    const handleCancelMeeting = async () => {
        try {
            const res = await fetch(`${backendUrl}/meetings/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, meetingId: meetingId }),
            });
            const data = await res.json();
        } catch (error) {
            console.error('Error cancelling meeting:', error);
            alert('Error cancelling meeting');
        }
    }

    return (
        <div>
            <div className='meeting-card'>
                <h4>{formattedDate}</h4>
                <div className='meeting-date'>
                    <button>{formattedTime}</button>
                    <button>{duration}</button>
                </div>
                <p>{title}</p>
                <h5>{organizer}</h5>
                {!isPastOrStarted && (
                    <button className='cancel-btn' onClick={handleCancelMeeting}>Cancel</button>
                )}            
                </div>
        </div>
    );
};

export default MeetingCard;
// Chloe Gavrilovic 260955835
import React from 'react';

const MeetingCard = ({ meeting }) => {
    const email = localStorage.getItem('email');
    const backendUrl =  'http://localhost:5001';
    const title = meeting.title;
    const date = meeting.date;
    const time = meeting.time;
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
    const meetingType = meeting.meetingType;
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

    const extractNameFromEmail = (email) => {
        if (!email) return '';
        const parts = email.split('@')[0].split('.');
        if (parts.length >= 2) {
            const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            return `${capitalize(parts[0])} ${capitalize(parts[1])}`;
        }
        return email;
    };

    return (
        <div>
            <div className='meeting-card'>
                <h4>{formattedDate}</h4>
                <div className='meeting-date'>
                    <button>{time}</button>
                    <button>{duration} min</button>
                </div>
                <p>{title}
                    <br/><br/>
                    {meetingType}
                    <br/><br/>
                    <b>{extractNameFromEmail(organizer)}</b>
                </p>
                {!isPastOrStarted && (
                    <button className='cancel-btn' onClick={handleCancelMeeting}>Cancel</button>
                )}            
                </div>
        </div>
    );
};

export default MeetingCard;
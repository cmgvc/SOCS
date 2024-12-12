import React from 'react';

const MeetingCard = ({ meeting }) => {
    const title = meeting.Title;
    const date = meeting.Date;
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
        return { formattedDate, formattedTime };
    };
    const { formattedDate, formattedTime } = formatDate(date);
    const organizer = meeting.Faculty;
    const duration = meeting.Duration;

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
                <a >More Information</a>
            </div>
        </div>
    );
};

export default MeetingCard;
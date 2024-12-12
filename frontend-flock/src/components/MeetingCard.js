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
                <p>{formattedDate}</p>
                <div className='meeting-date'>
                    <p>{formattedTime}</p>
                    <p>{duration}</p>
                </div>
                <p>{title}</p>
                <p>{organizer}</p>
                <a >More Information</a>
            </div>
        </div>
    );
};

export default MeetingCard;
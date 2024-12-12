import React from 'react';

const MeetingCard = ({ meeting }) => {
    return (
        <div>
            <div className='meeting-card'>
                <h3>{meeting.title}</h3>
                <p>{meeting.time}</p>
            </div>
        </div>
    );
};

export default MeetingCard;
import React from 'react';
import './meeting-modal.css';

const MeetingModal = ({ onClose, content }) => {
    const backendUrl =  'http://localhost:5001';

    const handleBookMeeting = async () => {
        try {
            const response = await fetch(`${backendUrl}/meetings/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: content.title, faculty: content.email, date: content.date, duration: content.duration, type: content.type, student: localStorage.getItem('email') , status: 'Accepted'}),
            });
            if (!response.ok) {
                throw new Error('Failed to book meeting');
            }
            const data = await response.json();
        } catch (error) {
            console.error('Error booking meeting:', error);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    {content ? (
                    <>
                        <h3><b>{content.title}</b></h3>
                        <p><strong>{content.date}</strong> </p>
                        <p><strong>Time:</strong> {content.time}</p>
                        <p>{content.duration} min</p>
                        <p>{content.name}</p>
                        <p>{content.email}</p>
                        <p><strong>Meeting type:</strong> {content.type}</p>
                        <button className="close-btn" onClick={handleBookMeeting}>Book Meeting</button>
                        <button className="close-btn" onClick={onClose}>Close</button>
                    </>
                ) : (<>
                    <p>Loading...</p>
                    <button className="close-btn" onClick={onClose}>
                    Close
                    </button></>
                )}
                </div>
            </div>
        </div>
    );
};

export default MeetingModal;

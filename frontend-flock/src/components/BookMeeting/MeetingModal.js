import React from 'react';
import './meeting-modal.css';

const MeetingModal = ({ onClose, content }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    {content ? (
                    <>
                        <h3><b>{content.title}</b></h3>
                        <p><strong>{content.date}</strong> </p>
                        <p><strong>Time:</strong> {content.time}</p>
                        <p>{content.name}</p>
                        <p>{content.email}</p>
                        <p><strong>Meeting type:</strong> {content.type}</p>
                        <button className="close-btn">Book Meeting</button>
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

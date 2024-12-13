// Chloe Gavrilovic 260955835
import React, {useState, useEffect} from 'react';
import '../styles/BookMeeting.css';
import FacultyPage from '../components/BookMeeting/FacultyPage';

function BookMeeting() {
    const [faculty, setFaculty] = useState(() => {
        const savedFaculty = localStorage.getItem('facultyName');
        return savedFaculty ? JSON.parse(savedFaculty) : null;
    });    const backendUrl = "http://localhost:5001";
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [meetingUrl, setMeetingUrl] = useState('');
    const [searchByUrl, setSearchByUrl] = useState(false);

    const capitalizeName = (name) => {
        return name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
    };

    const handleFacultySearch = () => {
        const formattedFirstName = capitalizeName(firstName);
        const formattedLastName = capitalizeName(lastName);

        if (!formattedFirstName || !formattedLastName) {
            alert('Please enter both first and last name');
            return;
        }

        try {
            fetch(`${backendUrl}/faculty`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName: formattedFirstName, lastName: formattedLastName })  
            })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem('facultyName', JSON.stringify(data));
                    setFaculty({firstName: data.firstName, lastName: data.lastName, email: data.email});
                });
        } catch (error) {
            console.error('Error finding faculty:', error);
            alert('Error finding faculty');
        }
    };

    const handleMeetingUrlSearch = () => {
        window.location.href = meetingUrl;
    };

    const toggleSearchMethod = () => {
        setSearchByUrl(!searchByUrl); 
    };

    const handleReturnToBooking = () => {
        localStorage.removeItem('facultyName');
        setFaculty('');
    };

    return (
        <div className='booking'>
            <h1>Book a meeting</h1>
            {faculty ?
                <>
                    <FacultyPage facultyName={faculty}/>
                    <button className='booking-button' onClick={handleReturnToBooking}>Return to search</button>
                </>
                : <div>
                    <div className='booking-inputs'>
                        {!searchByUrl ? (
                            <div className='booking-input'>
                                <p>Enter faculty member's first name:</p>
                                <input
                                    type='text'
                                    placeholder='e.g. Joseph'
                                    onChange={(e) => setFirstName(e.target.value)} />
                                <p>Enter faculty member's last name:</p>
                                <input
                                    type='text'
                                    placeholder='e.g. Vybihal'
                                    onChange={(e) => setLastName(e.target.value)} />
                                <button onClick={handleFacultySearch}>Search</button>
                                <div className='toggle-btn'>
                                    <button className='toggle-btn' onClick={toggleSearchMethod}>Search by URL</button>
                                </div>
                            </div>
                        ) : (
                            <div className='booking-input'>
                                <p>Enter meeting URL:</p>
                                <input
                                    type='text'
                                    placeholder='e.g. www.bookmeetingurl.com'
                                    onChange={(e) => setMeetingUrl(e.target.value)}/>
                                <button onClick={handleMeetingUrlSearch}>Search</button>
                                <div className='toggle-btn'>
                                    <button onClick={toggleSearchMethod}>Search by Name</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>}
        </div>
    );
}

export default BookMeeting;

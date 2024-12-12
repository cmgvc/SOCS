import React, {useEffect, useState} from 'react'
import '../styles/Dashboard.css'
import MeetingCard from '../components/MeetingCard'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Dashboard() {
    const [startIndex, setStartIndex] = useState(0);
    const [meetings, setMeetings] = useState([])
    const getDisplayedCards = meetings.slice(startIndex, startIndex + 3)

    const handleNextClick = () => {
        if (startIndex + 3 < meetings.length) {
            setStartIndex(prevIndex => prevIndex + 1)
        }
    };

    const handlePrevClick = () => {
        if (startIndex > 0) {
            setStartIndex(prevIndex => prevIndex - 1)
        }
    }

    useEffect(() => {
        const getMeetingsData = async () => {
            try {
                const email = localStorage.getItem('email')
                const res = await fetch('http://localhost:5001/meetings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email }),
                });
                const data = await res.json();
                console.log(data)
                setMeetings(data); 
            } catch (error) {
                console.error('Error fetching meetings:', error);
            }
        };
        getMeetingsData();
    }, []);

    return (
        <div className='dashboard'>
            <div className='dash-header'>
                <h1>Dashboard</h1>
            </div>
            <div className='dash-overview'>
                <div className='dash-upcoming'>
                    <h2>Upcoming Meetings</h2>
                    <a href='meetingRequest' ><button >Request alternate meeting time</button></a>
                </div>
                <div className='upcoming-panel'>
                    <button onClick={handlePrevClick} disabled={startIndex === 0} className='panel-arrow'><ArrowBackIosIcon /></button>
                    <div className='meeting-cards'>
                        {getDisplayedCards.map(meeting => (
                            <MeetingCard key={meeting._id || meeting.title} meeting={meeting} />
                        ))}
                    </div>
                    <button onClick={handleNextClick} disabled={startIndex + 3 >= meetings.length} className='panel-arrow'><ArrowForwardIosIcon /></button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

import React, {useEffect, useState} from 'react'
import '../styles/Dashboard.css'
import MeetingCard from '../components/MeetingCard'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Dashboard() {
    const [startIndex, setStartIndex] = useState(0);
    const [upcomingMeetings, setUpcomingMeetings] = useState([])
    const [pastMeetings, setPastMeetings] = useState([])
    const getUpcomingDisplayedCards = upcomingMeetings.slice(startIndex, startIndex + 3)
    const getHistoryDisplayedCards = pastMeetings.slice(startIndex, startIndex + 3)

    const handleUpcomingNextClick = () => {
        if (startIndex + 3 < upcomingMeetings.length) {
            setStartIndex(prevIndex => prevIndex + 1)
        }
    };

    const handleUpcomingPrevClick = () => {
        if (startIndex > 0) {
            setStartIndex(prevIndex => prevIndex - 1)
        }
    }
    const handleHistoryNextClick = () => {
        if (startIndex + 3 < upcomingMeetings.length) {
            setStartIndex(prevIndex => prevIndex + 1)
        }
    };

    const handleHistoryPrevClick = () => {
        if (startIndex > 0) {
            setStartIndex(prevIndex => prevIndex - 1)
        }
    }

    useEffect(() => {
        const getUpcomingMeetingsData = async () => {
            try {
                const email = localStorage.getItem('email');
                const res = await fetch('http://localhost:5001/meetings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email }),
                });
                const data = await res.json();
                const currentTime = new Date();
    
                const upcomingMeetings = data.filter(meeting => 
                    new Date(meeting.Date) > currentTime
                );
    
                setUpcomingMeetings(upcomingMeetings);
            } catch (error) {
                console.error('Error fetching upcoming meetings:', error);
            }
        };
    
        const getPastMeetingsData = async () => {
            try {
                const email = localStorage.getItem('email');
                const res = await fetch('http://localhost:5001/meetings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email }),
                });
                const data = await res.json();
                const currentTime = new Date();
    
                const pastMeetings = data.filter(meeting => 
                    new Date(meeting.Date) <= currentTime
                );
    
                setPastMeetings(pastMeetings);
            } catch (error) {
                console.error('Error fetching past meetings:', error);
            }
        };
    
        getPastMeetingsData();
        getUpcomingMeetingsData();
    }, []);
    

    return (
        <div className='dashboard'>
            <div className='dash-title'>
                <h1>Dashboard</h1>
                <button onClick={() => localStorage.clear()} >Logout</button>
            </div>
            <div className='dash-overview'>
                <div className='dash-section'>
                    <div className='dash-header'>
                        <h2>Upcoming Meetings</h2>
                        <a href='meetingRequest' ><button >Request alternate meeting time</button></a>
                    </div>
                    <div className='upcoming-panel'>
                        <button onClick={handleUpcomingPrevClick} disabled={startIndex === 0} className='panel-arrow'><ArrowBackIosIcon /></button>
                        <div className='meeting-cards'>
                            {getUpcomingDisplayedCards.map(meeting => (
                                <MeetingCard key={meeting._id || meeting.title} meeting={meeting} />
                            ))}
                        </div>
                        <button onClick={handleUpcomingNextClick} disabled={startIndex + 3 >= upcomingMeetings.length} className='panel-arrow'><ArrowForwardIosIcon /></button>
                    </div>
                </div>
                <div className='dash-section'>
                    <div className='dash-header'>
                        <h2>Past Meetings</h2>
                    </div>
                    <div className='upcoming-panel'>
                        <button onClick={handleHistoryPrevClick} disabled={startIndex === 0} className='panel-arrow'><ArrowBackIosIcon /></button>
                        <div className='meeting-cards'>
                            {getHistoryDisplayedCards.map(meeting => (
                                <MeetingCard key={meeting._id || meeting.title} meeting={meeting} />
                            ))}
                        </div>
                        <button onClick={handleHistoryNextClick} disabled={startIndex + 3 >= upcomingMeetings.length} className='panel-arrow'><ArrowForwardIosIcon /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

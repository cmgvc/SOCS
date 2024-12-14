// Chloe Gavrilovic 260955835
import React, {useEffect, useState} from 'react'
import '../styles/Dashboard.css'
import MeetingCard from '../components/MeetingCard'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Dashboard() {
    const [startPrevIndex, setStartPrevIndex] = useState(0);
    const [startNextIndex, setStartNextIndex] = useState(0);
    const email = localStorage.getItem('email');
    const backendUrl = "http://localhost:5001";
    const [upcomingMeetings, setUpcomingMeetings] = useState([])
    const [pastMeetings, setPastMeetings] = useState([])
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const getUpcomingDisplayedCards = upcomingMeetings.slice(startNextIndex, startNextIndex + 3)
    const getHistoryDisplayedCards = pastMeetings.slice(startPrevIndex, startPrevIndex + 3)

    const handleUpcomingNextClick = () => {
        if (startNextIndex + 3 < upcomingMeetings.length) {
            setStartNextIndex(prevIndex => prevIndex + 1)
        }
    };

    const handleUpcomingPrevClick = () => {
        if (startPrevIndex > 0) {
            setStartPrevIndex(prevIndex => prevIndex - 1)
        }
    }
    const handleHistoryNextClick = () => {
        if (startNextIndex + 3 < upcomingMeetings.length) {
            setStartNextIndex(prevIndex => prevIndex + 1)
        }
    };

    const handleHistoryPrevClick = () => {
        if (startPrevIndex > 0) {
            setStartPrevIndex(prevIndex => prevIndex - 1)
        }
    }
    
    const handleLogoutClick = () => {
        setShowLogoutModal(true);  
    };

    const handleConfirmLogout = () => {
        localStorage.clear();  
        setShowLogoutModal(false);  
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);  

    };

    useEffect(() => {
        const getUpcomingMeetingsData = async () => {
            try {
                const res = await fetch(`${backendUrl}/meetings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email }),
                });
                const data = await res.json();
                const currentTime = new Date();
                const upcomingMeetings = data.filter(meeting => 
                    new Date(meeting.date) > currentTime
                );
    
                setUpcomingMeetings(upcomingMeetings);
            } catch (error) {
                console.error('Error fetching upcoming meetings:', error);
            }
        };
    
        const getPastMeetingsData = async () => {
            try {
                const res = await fetch(`${backendUrl}/meetings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email }),
                });
                const data = await res.json();
                const currentTime = new Date();
                const pastMeetings = data.filter(meeting => 
                    new Date(meeting.date) <= currentTime
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
        <>
        {email ? 
        <div className='dashboard'>
            
            <div className='dash-title'>
                <h1>Dashboard</h1>
                <button onClick={handleLogoutClick}>Logout</button>
            </div>
            <div className='dash-overview'>
                <div className='dash-section'>
                    <div className='dash-header'>
                        <h2>Upcoming Meetings</h2>
                        <a href='meetingRequest' ><button >Request alternate meeting time</button></a>
                    </div>
                    <div className='upcoming-panel'>
                        <button onClick={handleUpcomingPrevClick} disabled={startNextIndex === 0} className='panel-arrow'><ArrowBackIosIcon /></button>
                        <div className='meeting-cards'>
                            {getUpcomingDisplayedCards.map(meeting => (
                                <MeetingCard key={meeting._id || meeting.title} meeting={meeting} />
                            ))}
                        </div>
                        <button onClick={handleUpcomingNextClick} disabled={startNextIndex + 3 >= upcomingMeetings.length} className='panel-arrow'><ArrowForwardIosIcon /></button>
                    </div>
                </div>
                <div className='dash-section'>
                    <div className='dash-header'>
                        <h2>Past Meetings</h2>
                    </div>
                    <div className='upcoming-panel'>
                        <button onClick={handleHistoryPrevClick} disabled={startPrevIndex === 0} className='panel-arrow'><ArrowBackIosIcon /></button>
                        <div className='meeting-cards'>
                            {getHistoryDisplayedCards.map(meeting => (
                                <MeetingCard key={meeting._id} meeting={meeting} />
                            ))}
                        </div>
                        <button onClick={handleHistoryNextClick} disabled={startPrevIndex + 3 >= upcomingMeetings.length} className='panel-arrow'><ArrowForwardIosIcon /></button>
                    </div>
                </div>
            </div>
        </div> : <div className='dash-login'>
            <h1>Sign in to view meeting history</h1>
            <a href='/auth'><button>Login</button></a>
        </div>}
        {showLogoutModal && (
                <div className="logout-modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to log out?</h3>
                        <button onClick={handleConfirmLogout}>Yes</button>
                        <button onClick={handleCancelLogout}>No</button>
                    </div>
                </div>
        )}
        </>
    )
}

export default Dashboard

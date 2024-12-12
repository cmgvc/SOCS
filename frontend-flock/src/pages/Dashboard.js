import React, {useState} from 'react'
import '../styles/Dashboard.css'
import MeetingCard from '../components/MeetingCard'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const meetings = [
    {
        title: 'Meeting with Prof. Vybihal',
        time: 'Monday, 12:00pm'
    },
    {
        title: 'Meeting with Chloe',
        time: 'Monday, 1:00pm'
    },
    {
        title: 'Meeting with Emily',
        time: 'Monday, 2:00pm'
    },
    {
        title: 'Meeting with Jacob',
        time: 'Monday, 3:00pm'
    },
    {
        title: 'Meeting with Danny',
        time: 'Monday, 4:00pm'
    },
    {
        title: 'Meeting with Prof. Becerra',
        time: 'Monday, 5:00pm'
    },
]

function Dashboard() {
    const [startIndex, setStartIndex] = useState(0);

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

    return (
        <div className='dashboard'>
            <div className='dash-header'>
                <h1>Dashboard</h1>
            </div>
            <div className='dash-overview'>
                <div className='dash-upcoming'>
                    <h2>Upcoming Meetings</h2>
                </div>
                <div className='upcoming-panel'>
                    <button onClick={handlePrevClick} disabled={startIndex === 0} className='panel-arrow'><ArrowBackIosIcon /></button>
                    <div className='meeting-cards'>
                        {getDisplayedCards.map(meeting => (
                            <MeetingCard meeting={meeting} />
                        ))}
                    </div>
                    <button onClick={handleNextClick} disabled={startIndex + 3 >= meetings.length} className='panel-arrow'><ArrowForwardIosIcon /></button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

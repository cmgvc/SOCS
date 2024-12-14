import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './booking-page.css';
import BookingCalendar from './BookingCalendar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const BookingPage = () => {
    const { token } = useParams();
    const [startIndex, setStartIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [meeting, setMeeting] = useState(null);
    const [recurring, setRecurring] = useState(false);
    const backendUrl = 'http://localhost:5001';
    const daysOfWeek = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };

    const handleDateChange = (date) => {
        setSelectedDate(new Date(date));
    };

    const handleNextClick = () => {
        if (startIndex + 3 < getAvailabilitiesByDate().length) {
            setStartIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrevClick = () => {
        if (startIndex > 0) {
            setStartIndex((prevIndex) => prevIndex - 1);
        }        
    }

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const currentUrl = window.location.href;
                const response = await fetch(`${backendUrl}/availabilities/url?url=${currentUrl}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch meetings');
                }

                const data = await response.json();
                setMeeting(data[0]);
                setRecurring(data[0].doesRepeatWeekly);
            } catch (error) {
                console.error('Error fetching meetings:', error);
            }
        };
        fetchMeetings();
    }, []);

    const parseTimeToMinutes = (timeString) => {
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        if (modifier === 'PM' && hours !== 12) {
            hours += 12; 
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        return hours * 60 + minutes;
    };
    
    const convertMinutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const modifier = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${mins.toString().padStart(2, '0')} ${modifier}`;
    };
    
    const splitAvailabilityByDuration = (startTime, endTime, duration) => {
        const slots = [];
        let currentStart = parseTimeToMinutes(startTime);
        const end = parseTimeToMinutes(endTime);
        const totalMinutes = end - currentStart;
        const numberOfSlots = totalMinutes / duration;
    
        for (let i = 0; i < numberOfSlots; i++) {
            const currentEnd = currentStart + duration;
            slots.push({
                start: convertMinutesToTime(currentStart),
            });
            currentStart = currentEnd; 
        }
        return slots;
    };

    const getAvailabilitiesForSelectedDay = () => {
        if (!meeting || !selectedDate) return [];
        const date = new Date(selectedDate);
        const selectedDay = date.getDay();
        const day = daysOfWeek[selectedDay];
        const dayAvailabilities = meeting.availabilityData[day];
        const duration = meeting.meetingDuration;
        if (!dayAvailabilities) return [];
    
        const slots = [];
        if (dayAvailabilities.length === 1 && dayAvailabilities[0] === '') {
            return [];
        }
        dayAvailabilities.forEach((availability) => {
            const { start, end } = availability;
            const splitSlots = splitAvailabilityByDuration(start, end, duration);
            splitSlots.forEach((slot) => {
                slots.push(slot);
            });
        });
        return slots;
    };

    const getAvailabilitiesByDate = () => {
        if (!meeting) return [];
    
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const slots = [];
        for (const date in meeting.availabilityData) {
            const dateObj = new Date(date);
            dateObj.setHours(0, 0, 0, 0); 
            if (dateObj < today) continue; 
            const dateName = dateObj.toDateString();
            const dayAvailabilities = meeting.availabilityData[date];
            const duration = meeting.meetingDuration;
    
            if (!dayAvailabilities || (dayAvailabilities.length === 1 && dayAvailabilities[0] === '')) {
                continue;
            }
            slots.push({ dateName, dateObj, slots: [] });
            dayAvailabilities.forEach((availability) => {
                const { start, end } = availability;
                const splitSlots = splitAvailabilityByDuration(start, end, duration);
                splitSlots.forEach((slot) => {
                    slots[slots.length - 1].slots.push(slot);
                });
            });
        }
        return slots.sort((a, b) => a.dateObj - b.dateObj);
    };
    
    

    return (
        <div className='booking-page'>
            <h2>Booking Page</h2>

            <div className='dates-container'>
                {recurring ? (
                    <>
                        <p>Select a meeting date:</p>
                        <div className='calendar-container'>
                            <BookingCalendar onDateChange={handleDateChange} />
                            <div className="meetings-container">
                                <h3>Available Times:</h3>
                                <div className='time-buttons'>
                                    {getAvailabilitiesForSelectedDay().map((slot, index) => (
                                        <Link to={`/meeting/${token}/${meeting._id}/${slot.start}`} key={index}>
                                            <button className='meeting-btn'>
                                                {slot.start}
                                            </button>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {selectedDate && (
                            <p>Selected Date: {selectedDate.toDateString()}</p>
                        )}
                    </>
                ) : (<>
                    <div className='non-recurring-meetings'>
                        <button onClick={handlePrevClick} disabled={startIndex === 0} className='panel-arrow'><ArrowBackIosIcon /></button>
                        {getAvailabilitiesByDate()
                            .slice(startIndex, startIndex + 3)
                            .map((dateObj, index) => (
                                <div className='non-recurring-meeting' key={index}>
                                    <p>{dateObj.dateName}</p>
                                    <div className='time-buttons'>
                                        {dateObj.slots.map((slot, slotIndex) => (
                                            <Link to={`/meeting/${token}/${meeting._id}/${slot.start}`} key={slotIndex}>
                                                <button className='meeting-btn'>{slot.start}</button>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        <button onClick={handleNextClick} disabled={startIndex + 3 >= getAvailabilitiesByDate().length} className='panel-arrow'><ArrowForwardIosIcon /></button>
                    </div>
                </>
                
                )}
            </div>
        </div>
    );
};

export default BookingPage;

// Jacob Weldon 260986471
const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const User = require('../models/User');  
const Unavailability = require('../models/Unavailability')

router.use(express.json());

router.post('/', async (req, res) => {
    try {
        const { title, duration, date, faculty, participants, status, meetingType, time } = req.body;

        // Basic validation
        if (!title || !duration || !date || !faculty || !status || !meetingType || !time) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const meetingDate = new Date(date);
        if (isNaN(meetingDate.getTime())) { // Check for invalid date
            return res.status(400).json({ message: 'Invalid date format.' });
        }

        const [firstName, lastName] = faculty.split(' ');


        const user = await User.findOne({ firstName, lastName });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { email } = user;        
        const now = new Date();

        // Validate that the meeting date and time are not in the past
        if (meetingDate < now) {
            return res.status(400).json({ message: 'Meeting date and time cannot be in the past.' });
        }

        const year = meetingDate.getFullYear();
        const month = String(meetingDate.getMonth() + 1).padStart(2, '0');
        const day = String(meetingDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        const unavailability = await Unavailability.findOne({
            facultyEmail: email,
            date: dateString
        });

        if (unavailability) {
            const [reqHours, reqMinutes] = time.split(':');
            const requestedStart = parseInt(reqHours, 10) * 60 + parseInt(reqMinutes, 10);
            const requestedEnd = requestedStart + parseInt(duration, 10);

            // Check each timeslot for overlap
            for (const slot of unavailability.timeSlots) {
                const [startH, startM] = slot.startTime.split(':').map(Number);
                const [endH, endM] = slot.endTime.split(':').map(Number);

                const slotStart = startH * 60 + startM;
                const slotEnd = endH * 60 + endM;

                // Overlap check condition:
                if (requestedStart < slotEnd && requestedEnd > slotStart) {
                    return res.status(400).json({ 
                        message: 'Requested meeting time overlaps with faculty unavailability.'
                    });
                }
            }
        }

        // Create new meeting
        const newMeeting = new Meeting({
            title,
            duration,
            date,
            faculty: email,
            participants,
            status,
            meetingType,
            time
        });

        console.log(newMeeting);

        // Save to database
        await newMeeting.save();

        res.status(201).json({ message: 'Meeting created successfully.', meeting: newMeeting });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;

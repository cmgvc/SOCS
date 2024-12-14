// Jacob Weldon 260986471
const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const User = require('../models/User');  

router.use(express.json());

router.post('/', async (req, res) => {
    try {
        const { title, duration, date, faculty, participants, status, meetingType, time } = req.body;

        // Basic validation
        if (!title || !duration || !date || !faculty || !status || !meetingType) {
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

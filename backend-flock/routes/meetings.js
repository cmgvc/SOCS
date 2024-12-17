// Chloe Gavrilovic 260955835
const express = require("express");
const Meeting = require("../models/Meeting");

const router = express.Router();

// get all meetings for a user
router.post("/", async (req, res) => {
    try {
        const userEmail = req.body.email;
        const meetings = await Meeting.find({ participants: { $in: [userEmail] } });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get all meetings for a faculty member
router.post("/faculty", async (req, res) => {
    try {
        const facultyEmail = req.body.email;
        const meetings = await Meeting.find({ faculty: facultyEmail });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// cancel a meeting for a user
router.post("/cancel", async (req, res) => {
    const { email, meetingId } = req.body;
    try {
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        // if the user if only participant then delete the meeting
        if (meeting.participants.length === 1) {
            await Meeting.findByIdAndDelete(meetingId);
            return res.json({ success: true, message: "Meeting canceled, no participants left" });
        }
        await Meeting.updateOne(
            { _id: meetingId },
            { $pull: { participants: email } }
        );
        res.json({ success: true, message: "Participant removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/cancelFaculty', async (req, res) => {
    const { email, meetingId } = req.body;

    try {
        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }

        if (meeting.faculty !== email) {
            return res.status(403).json({ message: 'You are not authorized to cancel this meeting.' });
        }

        await Meeting.findByIdAndDelete(meetingId);

        res.status(200).json({ message: 'Meeting cancelled successfully.' });
    } catch (error) {
        console.error('Error cancelling meeting:', error);
        res.status(500).json({ message: 'Error cancelling meeting.' });
    }
});

router.post("/book", async (req, res) => {
    try {
        const { title, date, duration, faculty, student, status, meetingType, time } = req.body;
        let existingMeeting = await Meeting.findOne({ 
            title, 
            date, 
            duration, 
            faculty,
            time 
        });

        if (existingMeeting) {
            if (!existingMeeting.participants.includes(student)) {
                existingMeeting.participants.push(student);  
                const updatedMeeting = await existingMeeting.save();
                return res.status(200).json(updatedMeeting);  
            } else {
                return res.status(400).json({ message: 'Student is already a participant in this meeting' });
            }
        } else {
            const newMeeting = new Meeting({
                title,
                duration,
                date,
                faculty,
                participants: [student],  
                status,
                meetingType,
                time
            });
            const savedMeeting = await newMeeting.save();
            return res.status(201).json(savedMeeting); 
        }
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

router.post('/updateStatus', async (req, res) => {
    const { email, meetingId, status } = req.body;
    try {
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        meeting.status = status;
        await meeting.save();

        res.status(200).json({ message: `Meeting ${status} successfully.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating meeting status.' });
    }
});

// get all meetings for a faculty member if the meeting is 1-1 and is full
router.post('/full', async (req, res) => {
    const { faculty, title } = req.body;
    try {
        const meetings = await Meeting.find({
            title: title,
            faculty: faculty,
            meetingType: "1-1", 
            participants: { $size: 1 } 
        });
        res.json(meetings); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;

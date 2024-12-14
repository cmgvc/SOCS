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

router.post("/book", async (req, res) => {
    console.log("Request received:", req.body);
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
            console.log(newMeeting);
            const savedMeeting = await newMeeting.save();
            return res.status(201).json(savedMeeting); 
        }
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


module.exports = router;
// Chloe Gavrilovic 260955835
const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post('/', async (req, res) => {
        const { firstName, lastName } = req.body;
        try {
            const faculty = await User.findOne({ firstName: firstName, lastName: lastName, validFaculty: true });
            
            if (!faculty) {
                return res.status(404).json({ message: 'Faculty member not found' });
            }
            res.json(faculty);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    
module.exports = router;
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();

  // split the name into first and last names
  const nameParts = name.trim().split(" ");
  if (nameParts.length < 2) {
    return res
      .status(400)
      .json({ message: "Please provide both first and last name" });
  }

  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" "); // handles multi-part last names like "Van Gogh"

  // Determine if the email belongs to faculty or student
  let isFaculty = null;
  if (lowercaseEmail.endsWith("@mcgill.ca")) {
    isFaculty = true; // Faculty
  } else if (lowercaseEmail.endsWith("@mail.mcgill.ca")) {
    isFaculty = false; // Student
  } else {
    return res
      .status(400)
      .json({ message: "Email must be either @mcgill.ca or @mail.mcgill.ca" });
  }

  try {
    // check if user already exists
    const existingUser = await User.findOne({ email: lowercaseEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create and save the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isFaculty,
    });
    await newUser.save();

    // generate a token
    const token = jwt.sign({ userId: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { firstName, lastName, email: lowercaseEmail, isFaculty },
      token: token,
      isFaculty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: lowercaseEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

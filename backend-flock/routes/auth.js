// coded by Danielle Wahrhaftig 260984602
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

router.put("/update", async (req, res) => {
  const { name, email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();
  const nameParts = name.trim().split(" ");
  if (nameParts.length < 2) {
    return res
      .status(400)
      .json({ message: "Please provide both first and last name" });
  }

  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" "); // handles multi-part last names like "Van Gogh"

  // validate email format
  if (
    !lowercaseEmail.endsWith("@mcgill.ca") &&
    !lowercaseEmail.endsWith("@mail.mcgill.ca")
  ) {
    return res.status(400).json({
      message: "Email must be either @mcgill.ca or @mail.mcgill.ca",
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password is provided, hash it
    let hashedPassword = user.password; // keep the current password if not updated
    if (password && password !== "********") {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters long." });
      }
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    // Update user details
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = lowercaseEmail;
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

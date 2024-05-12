const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// Define middleware functions
router.get('/signup', (req, res) => {
  res.send('Signup page');
});

router.post('/signup', async (req, res) => {
  try {
    // Extract username and password from request body
    const username = "ss", password = "ss";

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create a new user instance
    const newUser = new User({ username, password });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

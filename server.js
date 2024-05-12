// const express = require ('express');
// const router = express.Router();
// const User = require('../models/User'); // Import the User model

// // Define middleware functions
// router.get('/signup', (req, res) => {
//   res.send('Signup page');
// });

// router.post('/signup', async (req, res) => {
//   try {
//     // Extract username and password from request body
//     const username = "ss", password = "ss";

//     // Check if username already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Username already exists' });
//     }

//     // Create a new user instance
//     const newUser = new User({ username, password });

//     // Save the new user to the database
//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (error) {
//     console.error('Error signing up:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// module.exports = router;

const express = require('express');
const path = require('path'); // Import the path module
const app = express();
const authRoutes = require('./routes/authRoutes');
app.use(express.json()); // for parsing application/json
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Mount routes
app.use('/auth', authRoutes);
// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




// Remove mongoose and User model if you're not using them
const express = require('express');
const router = express.Router();

// Define middleware functions
router.get('/signup', (req, res) => {
  res.send('Signup page');
});

router.post('/login', (req, res) => {
  res.send('Login page');
});

router.get('/logout', (req, res) => {
  res.send('Logout page');
});

module.exports = router;

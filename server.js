const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/paqzy', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Use Helmet for basic security headers
app.use(helmet());

// Allow static fonts, images etc. (Fix CSP)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "font-src 'self' data:; " +
    "connect-src 'self';"
  );
  next();
});

// Serve static files from Public directory
app.use(express.static(path.join(__dirname, 'Public')));

// Parse incoming JSON
app.use(express.json());

// Main Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).send('Page or resource not found');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

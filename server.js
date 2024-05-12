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

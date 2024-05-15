const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRoutes);

const uri = "mongodb://localhost:27017/paqzy1";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;
let findUser, createUser, validatePassword;

(async function() {
  await client.connect();
  console.log('Connected to MongoDB');
  db = client.db('paqzy1');
  // Pass the db instance to your user model
  const userFunctions = require('./models/user')(db);
  findUser = userFunctions.findUser;
  createUser = userFunctions.createUser;
  validatePassword = userFunctions.validatePassword; // Add this line

  // Now you can use findUser, createUser, and validatePassword in your routes
  app.post('/signup', async (req, res) => {
    const { name, password } = req.body;
    
    try {
      // Check if the user already exists
      const existingUser = await findUser(name);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create the new user
      const result = await createUser(name, password);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Add a login route
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user in the database
      const user = await findUser(username);
      if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
  
      // Validate the password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
  
      // If the password is valid, log the user in
      res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

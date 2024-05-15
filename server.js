const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const mongoose = require('mongoose');
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


const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
}));

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
  

  app.post('/add-to-cart', async (req, res) => {
    const product = req.body;
    try {
      // Add the product to the cart in the database
      const collection = db.collection('cart');
      const result = await collection.insertOne(product);
      res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/get-cart', async (req, res) => {
    try {
      const collection = db.collection('cart');
      const cart = await collection.find().toArray();
      res.status(200).json(cart);
    } catch (error) {
      console.error('Error getting cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  const { MongoClient, ObjectId } = require('mongodb'); // Import ObjectId

  
  app.delete('/remove-from-cart', async (req, res) => {
    const productId = req.body._id;
    try {
      const collection = db.collection('cart');
      const result = await collection.deleteOne({ _id: new ObjectId(productId) }); // Use ObjectId
      res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  app.post('/send-email', async (req, res) => {
    const { email, name } = req.body;
  
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      logger: true,
      secureConnection: false,
      auth: {
        user: 'paqzypakistan@gmail.com',
        pass: 'PAQZYNEW123',
      },     
    
      tls: {

         rejectUnauthorized: true
      }
    });
  
    let info = await transporter.sendMail({
      from: '"PAQZY Shop" <paqzy.pk@gmail.com>',
      to: email,
      subject: 'Thank you for your purchase!',
      text: `Dear ${name},\n\nThank you for purchasing from PAQZY Shop! We hope you enjoy your new items. You will receive a confirmation call soon.\n\nBest,\nThe PAQZY Shop Team`,
    });
  
    res.status(200).json({ message: 'Email sent successfully' });
  });
  

  app.post('/complete-purchase', async (req, res) => {
  const { customerDetails, cart } = req.body;
  try {
    const collection = db.collection('purchases');
    const result = await collection.insertOne({ customerDetails, cart });
    res.status(200).json({ message: 'Purchase completed successfully' });
  } catch (error) {
    console.error('Error completing purchase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



  

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });



})();

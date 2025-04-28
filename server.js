const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const helmet = require('helmet');  // Security headers
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set a secure Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "font-src 'self' http://20.120.102.228:8080; " +
    "connect-src 'self'; " +
    "img-src 'self' data:;"
  );
  next();
});

// Routes
app.use('/auth', authRoutes);

// MongoDB connection
const uri = "mongodb://localhost:27017/paqzy1";
const client = new MongoClient(uri);  // No need for useNewUrlParser / useUnifiedTopology

let db;
let findUser, createUser, validatePassword;

// Mongoose Product Model
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
}));

// Connect to MongoDB and set up routes
(async function () {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('paqzy1');

    const userFunctions = require('./models/user')(db);
    findUser = userFunctions.findUser;
    createUser = userFunctions.createUser;
    validatePassword = userFunctions.validatePassword;

    // Signup route
    app.post('/signup', async (req, res) => {
      const { name, password } = req.body;
      try {
        const existingUser = await findUser(name);
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        await createUser(name, password);
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Login route
    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      try {
        const user = await findUser(username);
        if (!user) {
          return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return res.status(400).json({ error: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Logged in successfully' });
      } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Add to cart route
    app.post('/add-to-cart', async (req, res) => {
      const product = req.body;
      try {
        const collection = db.collection('cart');
        await collection.insertOne(product);
        res.status(201).json({ message: 'Product added to cart' });
      } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Get cart route
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

    // Remove from cart route
    app.delete('/remove-from-cart', async (req, res) => {
      const productId = req.body._id;
      try {
        const collection = db.collection('cart');
        await collection.deleteOne({ _id: new ObjectId(productId) });
        res.status(200).json({ message: 'Product removed from cart' });
      } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Send email route
    app.post('/send-email', async (req, res) => {
      const { email, name } = req.body;
      try {
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          port: 465,
          secure: true,
          logger: true,
          secureConnection: false,
          auth: {
            user: 'paqzy.pk@gmail.com',
            pass: 'gfxg kxso nczz bsxx',  // Make sure to keep this secure
          },
          tls: {
            rejectUnauthorized: true,
          },
        });

        await transporter.sendMail({
          from: '"PAQZY Shop" <paqzy.pk@gmail.com>',
          to: email,
          subject: 'Thank you for your purchase!',
          text: `Dear ${name},\n\nThank you for purchasing from PAQZY Shop! We hope you enjoy your new items. You will receive a confirmation call soon.\n\nBest,\nThe PAQZY Shop Team`,
        });

        res.status(200).json({ message: 'Email sent successfully' });
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Complete purchase route
    app.post('/complete-purchase', async (req, res) => {
      const { customerDetails, cart } = req.body;
      try {
        const collection = db.collection('purchases');
        await collection.insertOne({ customerDetails, cart });
        res.status(200).json({ message: 'Purchase completed successfully' });
      } catch (error) {
        console.error('Error completing purchase:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Start server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
})();

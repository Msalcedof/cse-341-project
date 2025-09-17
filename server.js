require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const PORT = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGO_URI);

let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db(); // ✅ Automatically uses the DB from your connection string

    console.log('Connected to MongoDB');

    // Middleware to make db accessible in routes
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use(express.json());
    app.use('/contacts', require('./routes/contacts'));

    // Optional: add a root route so "/" doesn't show "Cannot GET /"
    app.get('/', (req, res) => {
      res.send('Contacts API is running');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

startServer();

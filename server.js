const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error:", err));

// Schema
const passwordSchema = new mongoose.Schema({
  id: String,
  site: String,
  username: String,
  password: String
});

const Password = mongoose.model('Password', passwordSchema);

// Routes
app.get('/', async (req, res) => {
  try {
    const passwords = await Password.find({});
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: "Error fetching passwords" });
  }
});

app.post('/', async (req, res) => {
  try {
    const newPassword = new Password(req.body);
    await newPassword.save();
    res.status(201).json(newPassword);
  } catch (err) {
    res.status(500).json({ message: "Error saving password" });
  }
});

app.delete('/', async (req, res) => {
  try {
    await Password.deleteOne({ id: req.body.id });
    res.json({ message: "Password deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting password" });
  }
});

// Start server (for Render)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

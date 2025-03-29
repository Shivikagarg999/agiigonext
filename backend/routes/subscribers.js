const express = require('express');
const Subscriber = require("../models/Subscriber");

const router = express.Router();

// Add new subscriber
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Simple validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if already exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({ email });
    
    res.status(201).json({
      message: 'Subscribed successfully!',
      subscriber
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get all subscribers
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort('-createdAt');
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const ImageKit = require('imagekit');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Update user profile - Fixed endpoint to match frontend
router.patch('/:userId', upload.single('pfp'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, contact, address, state, city, country, pincode } = req.body;

    // Convert pincode to number if it exists
    const pincodeNum = pincode ? parseInt(pincode) : undefined;

    let updateData = { 
      name, 
      email, 
      contact, 
      address, 
      state, 
      city, 
      country, 
      pincode: pincodeNum 
    };

    // Handle file upload if present
    if (req.file) {
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `user_${userId}_${Date.now()}.jpg`,
        folder: "/users",
      });
      updateData.pfp = uploadResponse.url;
    }

    // Ensure we're returning the updated document with all fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { 
        new: true,
        runValidators: true,
        select: '-password' // Exclude password from the returned data
      }
    ).lean(); // Add .lean() for better performance

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send back the complete updated user data
    res.status(200).json({
      ...updatedUser,
      pincode: updatedUser.pincode ? updatedUser.pincode.toString() : ''
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});

module.exports = router;
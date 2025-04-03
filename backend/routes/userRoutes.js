const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const ImageKit = require('imagekit'); // Make sure to require the package

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// Initialize ImageKit (note the variable name consistency)
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Update user profile
router.patch('/:userId', upload.single('pfp'), async (req, res) => {
  try {
      const { userId } = req.params;
      const { name, email, contact, address, state, city, country, pincode } = req.body;

      let updateData = { name, email, contact, address, state, city, country, pincode };

      // Upload Image to ImageKit 
      if (req.file) {
          const uploadResponse = await imagekit.upload({ // Note: lowercase 'i'
              file: req.file.buffer,
              fileName: `user_${userId}.jpg`, 
              folder: "/users", 
          });
          updateData.pfp = uploadResponse.url; 
      }

      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: updateData },
          { 
              new: true,
              runValidators: true 
          }
      ).select("-password");

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
  } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ 
          message: "Server error", 
          error: error.message 
      });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const User= require('../models/User')
const mongoose= require('mongoose')

router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }
  
      // Find the user and populate their products
      const user = await User.findById(id)
        .select('-password -__v') // Exclude sensitive/unnecessary fields
        .populate({
          path: 'products',
          select: 'name price image category', // Only include these product fields
          options: { limit: 4 } // Limit to 4 products for preview
        });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // If the user isn't a seller, you might want to handle that case
      if (user.role !== 'seller') {
        return res.status(400).json({ message: "This user is not a seller" });
      }
  
      // Structure the response
      const sellerData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pfp: user.pfp,
        contact: user.contact,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
        pincode: user.pincode,
        products: user.products,
        createdAt: user.createdAt
      };
  
      res.status(200).json(sellerData);
    } catch (error) {
      console.error("Error fetching seller details:", error);
      res.status(500).json({ 
        message: "Failed to fetch seller details",
        error: error.message 
      });
    }
  });

  module.exports= router
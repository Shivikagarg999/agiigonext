const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get seller profile with their products
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { excludeProductId } = req.query;

        console.log('[DEBUG] Request received for seller ID:', id);

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('[DEBUG] Invalid ID format:', id);
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Find the user (without sensitive data)
        const user = await User.findById(id).select('-password -__v');
        
        if (!user) {
            console.log('[DEBUG] User not found for ID:', id);
            return res.status(404).json({ message: "User not found" });
        }

        console.log('[DEBUG] Found user:', user._id, user.name);

        // If the user isn't a seller
        if (user.role !== 'seller') {
            console.log('[DEBUG] User is not a seller:', user.role);
            return res.status(400).json({ message: "This user is not a seller" });
        }

        // Build query for seller's products - REMOVED isActive FILTER
        const productsQuery = {
            user: user._id
        };

        console.log('[DEBUG] Initial productsQuery:', productsQuery);

        // Exclude specific product if provided
        if (excludeProductId && mongoose.Types.ObjectId.isValid(excludeProductId)) {
            productsQuery._id = { $ne: excludeProductId };
            console.log('[DEBUG] Added excludeProductId to query:', excludeProductId);
        }

        // DEBUG: Check raw product count
        const totalProductsUnfiltered = await Product.countDocuments({ user: user._id });
        console.log('[DEBUG] Total products (unfiltered):', totalProductsUnfiltered);
        
        const totalProductsFiltered = await Product.countDocuments(productsQuery);
        console.log('[DEBUG] Total products (filtered):', totalProductsFiltered);

        // Get seller's products (with pagination)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        console.log('[DEBUG] Pagination - page:', page, 'limit:', limit, 'skip:', skip);

        const [products, totalProducts] = await Promise.all([
            Product.find(productsQuery)
                .select('name price image category createdAt isActive') // Added isActive to response
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(productsQuery)
        ]);

        console.log('[DEBUG] Found products:', products.length);

        // Structure the response
        const response = {
            seller: {
                _id: user._id,
                name: user.name,
                email: user.email,
                pfp: user.pfp,
                contact: user.contact,
                address: user.address,
                city: user.city,
                state: user.state,
                country: user.country,
                pincode: user.pincode,
                createdAt: user.createdAt,
                rating: user.rating
            },
            products: {
                items: products,
                pagination: {
                    total: totalProducts,
                    page,
                    pages: Math.ceil(totalProducts / limit),
                    limit
                }
            }
        };

        console.log('[DEBUG] Response ready, sending...');
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching seller details:", error);
        res.status(500).json({ 
            message: "Failed to fetch seller details",
            error: error.message 
        });
    }
});
// router.get("/:id/products", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { excludeProductId } = req.query;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid seller ID" });
//         }

//         const query = { 
//             user: id,
//             isActive: true 
//         };

//         if (excludeProductId && mongoose.Types.ObjectId.isValid(excludeProductId)) {
//             query._id = { $ne: excludeProductId };
//         }

//         // Using lean() for better performance
//         const products = await Product.find(query)
//             .select('name price image category createdAt')
//             .sort({ createdAt: -1 })
//             .lean();

//         res.status(200).json(products);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ 
//             message: "Server error", 
//             error: error.message 
//         });
//     }
// });

// router.post('/byIds', async (req, res) => {
//     try {
//       const { ids } = req.body;
      
//       if (!ids || !Array.isArray(ids)) {
//         return res.status(400).json({ message: "Invalid product IDs" });
//       }
  
//       // Convert string IDs to ObjectId if needed
//       const objectIds = ids.map(id => mongoose.Types.ObjectId(id));
  
//       const products = await Product.find({
//         _id: { $in: objectIds },
//         isActive: true
//       });
  
//       res.status(200).json(products);
//     } catch (error) {
//       console.error("Error fetching products by IDs:", error);
//       res.status(500).json({ message: "Failed to fetch products", error: error.message });
//     }
//   });
module.exports = router;
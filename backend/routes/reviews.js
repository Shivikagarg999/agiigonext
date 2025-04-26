const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Write a review for a product (without auth)
router.post("/:productId/reviews", async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId, rating, comment } = req.body;

        console.log('[DEBUG] Request received to add review for product:', productId);

        // Validate required fields
        if (!userId || !rating || !comment) {
            console.log('[DEBUG] Missing required fields');
            return res.status(400).json({ 
                message: "userId, rating and comment are required" 
            });
        }

        // Validate IDs format
        if (!mongoose.Types.ObjectId.isValid(productId) || 
            !mongoose.Types.ObjectId.isValid(userId)) {
            console.log('[DEBUG] Invalid ID format');
            return res.status(400).json({ message: "Invalid ID format" });
        }

        if (rating < 1 || rating > 5) {
            console.log('[DEBUG] Invalid rating value:', rating);
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Find the product
        const product = await Product.findById(productId);
        
        if (!product) {
            console.log('[DEBUG] Product not found:', productId);
            return res.status(404).json({ message: "Product not found" });
        }

        console.log('[DEBUG] Found product:', product._id, product.name);

        // Check for existing review (optional)
        const existingReview = product.reviews.find(review => review.user.equals(userId));
        if (existingReview) {
            console.log('[DEBUG] User already reviewed this product');
            return res.status(400).json({ 
                message: "This user has already reviewed this product" 
            });
        }

        // Add the review
        product.reviews.push({
            user: userId,
            rating,
            comment,
            createdAt: new Date()
        });

        // Calculate new average rating
        const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.averageRating = totalRatings / product.reviews.length;

        await product.save();

        console.log('[DEBUG] Review added successfully');
        res.status(201).json({
            message: 'Review added successfully',
            review: product.reviews[product.reviews.length - 1],
            averageRating: product.averageRating
        });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ 
            message: "Failed to add review",
            error: error.message 
        });
    }
});

// Get all reviews for a product
router.get("/:productId/reviews", async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 5 } = req.query;

        console.log('[DEBUG] Request received for product reviews:', productId);

        // Validate the product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.log('[DEBUG] Invalid product ID format:', productId);
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        // Convert page and limit to numbers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        // Find the product with paginated reviews
        const result = await Product.aggregate([
            { 
                $match: { 
                    _id: new mongoose.Types.ObjectId(productId) 
                } 
            },
            {
                $project: {
                    reviews: 1,
                    averageRating: 1,
                    totalReviews: { $size: "$reviews" }
                }
            },
            { $unwind: "$reviews" },
            { $sort: { "reviews.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    reviews: { $push: "$reviews" },
                    averageRating: { $first: "$averageRating" },
                    totalReviews: { $first: "$totalReviews" }
                }
            },
            {
                $project: {
                    reviews: {
                        $slice: [
                            "$reviews",
                            (pageNum - 1) * limitNum,
                            limitNum
                        ]
                    },
                    averageRating: 1,
                    totalReviews: 1
                }
            }
        ]);

        if (!result || result.length === 0) {
            console.log('[DEBUG] Product not found:', productId);
            return res.status(404).json({ message: "Product not found" });
        }

        const product = result[0];

        // Populate user information for each review
        await Product.populate(product, {
            path: 'reviews.user',
            select: 'name pfp'
        });

        console.log('[DEBUG] Found product with reviews:', product.reviews.length);

        // Structure the response
        const response = {
            reviews: product.reviews,
            averageRating: product.averageRating || 0,
            totalReviews: product.totalReviews,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(product.totalReviews / limitNum),
                reviewsPerPage: limitNum
            }
        };

        console.log('[DEBUG] Sending reviews response');
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ 
            message: "Failed to fetch reviews",
            error: error.message 
        });
    }
});

module.exports = router;
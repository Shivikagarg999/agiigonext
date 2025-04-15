const express = require('express');
const router = express.Router();
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Product= require('../models/Product')
const User= require('../models/User')
const mongoose= require('mongoose')

// GET /api/orders/user/:userId - Get all orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name image price' 
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST /api/order/create-from-cart
router.post('/create-from-cart', async (req, res) => {
  try {
    console.log('Incoming order request:', req.body);
    
    const { 
      userId,
      shippingAddress,
      contactInfo,
      paymentMethod,
      currency = 'USD',
      paymentStatus = 'Pending'
    } = req.body;

    // Validate required fields
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || 
        !shippingAddress.country || !shippingAddress.zipCode) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    if (!contactInfo || !contactInfo.email) {
      return res.status(400).json({ message: 'Contact information is required' });
    }

    // Fetch user cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.productId._id,
      quantity: item.quantity,
      priceAtPurchase: item.productId.price,
      name: item.productId.name
    }));

    // Calculate total amount
    const totalAmount = orderItems.reduce((total, item) => {
      return total + (item.priceAtPurchase * item.quantity);
    }, 0);

    // Format shipping address as string
    const formattedShippingAddress = `
      ${shippingAddress.street}, 
      ${shippingAddress.city}, 
      ${shippingAddress.state || ''} 
      ${shippingAddress.zipCode}, 
      ${shippingAddress.country}
    `.replace(/\n/g, '').replace(/\s+/g, ' ').trim();

    // Create new order
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: formattedShippingAddress,
      contactInfo,
      paymentMethod,
      paymentStatus,
      currency,
      totalAmount,
      orderStatus: 'Processing'
    });

    // Save order
    const savedOrder = await newOrder.save();

    // Update user's orders
    await User.findByIdAndUpdate(userId, {
      $push: { orders: savedOrder._id }
    });

    // Clear the cart
    await Cart.findByIdAndUpdate(cart._id, {
      $set: { items: [], totalPrice: 0 }
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder
    });

  } catch (error) {
    console.error('Order creation error:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    res.status(500).json({
      message: 'Failed to create order',
      error: error.message
    });
  }
});

module.exports = router;
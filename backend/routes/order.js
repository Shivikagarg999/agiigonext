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
        select: 'name images price' 
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
    const { userId, shippingAddress, paymentMethod, currency = 'USD' } = req.body;

    if (!userId || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'userId, shippingAddress, and paymentMethod are required.' });
    }

    // Fetch cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtTimeOfAddition,
    }));

    // Calculate totalAmount
    const totalAmount = orderItems.reduce((sum, item) => {
      return sum + item.priceAtPurchase * item.quantity;
    }, 0);

    // Create order
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      currency,
      totalAmount,
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
    });

    const savedOrder = await newOrder.save();

    // Push to user document
    await User.findByIdAndUpdate(userId, {
      $push: { orders: savedOrder._id }
    });

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      message: 'Order placed successfully.',
      order: savedOrder
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
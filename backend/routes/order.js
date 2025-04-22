const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

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

// Create order from cart (before checkout)
router.post('/create-from-cart', async (req, res) => {
  try {
    const { userId, shippingAddress, contactInfo, currency } = req.body;
    
    // 1. Get cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Create order
    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: item.productId.price
      })),
      shippingAddress,
      paymentMethod: 'Stripe',
      paymentStatus: 'Pending',
      totalAmount: cart.totalPrice,
      currency
    });

    await order.save();

    res.json({ 
      orderId: order._id,
      totalAmount: order.totalAmount,
      currency: order.currency
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Order creation failed' });
  }
});

module.exports = router;
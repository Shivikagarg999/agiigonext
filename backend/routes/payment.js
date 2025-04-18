const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const endpointSecret = 'we_1PfI2HBh8DMWVmVhg5HykjnO'; 

// Initialize Stripe
const stripe = Stripe('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');

// Create payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, currency, userId, metadata } = req.body;
    // Basic validation
    if (!amount || !currency || !userId) {
      return res.status(400).json({ error: 'Amount, currency and userId are required' });
    }

    // Verify cart amount
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const calculatedAmount = Math.round(cart.totalPrice * 100);
    if (calculatedAmount !== amount) {
      return res.status(400).json({ error: 'Amount does not match cart total' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      metadata: {
        userId,
        orderId: metadata?.orderId || 'pending',
        cartId: cart._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId, orderId, userId } = req.body;

    if (!paymentIntentId || !orderId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify payment
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.metadata.userId !== userId.toString()) {
      return res.status(403).json({ error: 'Invalid payment' });
    }

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'Paid',
        paymentId: paymentIntent.id,
        paymentDate: new Date(),
        orderStatus: 'Processing'
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: updatedOrder });

  } catch (error) {
    console.error('Confirmation error:', error);
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
});

//Stripe webhook secret

router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    try {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'Paid',
        paymentId: paymentIntent.id,
        paymentDate: new Date()
      });
      console.log(`Updated order ${orderId} to Paid status`);
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  }

  res.json({received: true});
});

module.exports = router;
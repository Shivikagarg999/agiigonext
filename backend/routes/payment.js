const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);  
// Create a new Checkout session
router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;  // Product details sent from the frontend (name, price, quantity)

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",  // Change to AED or your currency
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,  // Stripe accepts price in cents (e.g., $20 = 2000)
    },
    quantity: product.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],  // Payment method
      line_items: lineItems,           // Product items to be shown
      mode: "payment",                 // One-time payment
      success_url: 'https://agiigo.com/success',  // Redirect after successful payment
      cancel_url: 'https://agiigo.com/cancel',    // Redirect after payment cancellation
    });

    res.json({ id: session.id });  // Send session ID to frontend
  } catch (error) {
    console.error("Error creating Stripe checkout session", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;





















// const express = require('express');
// const Stripe = require('stripe');
// const router = express.Router();
// const Order = require('../models/Order');
// const Cart = require('../models/Cart');

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// // Create Stripe Checkout Session
// router.post('/create-checkout-session', async (req, res) => {
//   try {
//     const { userId, cartId, orderId } = req.body;

//     // 1. Fetch cart items
//     const cart = await Cart.findById(cartId).populate('items.productId');
//     if (!cart) return res.status(404).json({ error: 'Cart not found' });

//     // 2. Prepare line items for Stripe
//     const lineItems = cart.items.map(item => ({
//       price_data: {
//         currency: item.productId.priceCurrency.toLowerCase(),
//         product_data: {
//           name: item.productId.name,
//           images: [item.productId.image], // Stripe requires HTTPS images
//         },
//         unit_amount: Math.round(item.productId.price * 100), // Convert to cents
//       },
//       quantity: item.quantity,
//     }));

//     // 3. Create Stripe session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: `${process.env.FRONTEND_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
//       cancel_url: `${process.env.FRONTEND_URL}/checkout?canceled=true`,
//       metadata: {
//         userId: userId.toString(),
//         orderId: orderId.toString(),
//         cartId: cartId.toString()
//       },
//       customer_email: req.body.customerEmail, // Pre-fill email
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error('Checkout error:', error);
//     res.status(500).json({ error: 'Checkout session creation failed' });
//   }
// });

// // Webhook Handler
// router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error('Webhook error:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle successful payment
//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
    
//     try {
//       await Order.findByIdAndUpdate(session.metadata.orderId, {
//         paymentStatus: 'Paid',
//         paymentId: session.payment_intent,
//         paymentDate: new Date(),
//         orderStatus: 'Processing'
//       });
//       console.log(`Updated order ${session.metadata.orderId} to Paid status`);
//     } catch (err) {
//       console.error('Failed to update order:', err);
//     }
//   }

//   res.json({received: true});
// });

// module.exports = router;



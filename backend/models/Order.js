const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true }, // fixed price
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // nullable for guest orders
  guestSession: { type: String }, // for guest orders
  items: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: Number,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Card', 'Stripe'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  totalAmount: { type: Number, required: true },
  currency: {
    type: String,
    enum: ['AED', 'USD'],
    default: 'USD'
  },
  placedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
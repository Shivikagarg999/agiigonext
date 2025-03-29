const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1
  },
  priceAtPurchase: { 
    type: Number, 
    required: true 
  },
  priceCurrency: {
    type: String,
    required: true,
    enum: ['AED', 'USD'],
    default: 'USD'
  }
});

const shippingAddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true }
});

const paymentInfoSchema = new mongoose.Schema({
  method: { 
    type: String, 
    required: true,
    enum: ['credit-card', 'paypal', 'bank-transfer', 'cash-on-delivery']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentDate: Date
});

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  contactInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  payment: paymentInfoSchema,
  subtotal: { 
    type: Number, 
    required: true 
  },
  shippingFee: { 
    type: Number, 
    required: true,
    default: 0 
  },
  tax: { 
    type: Number, 
    required: true,
    default: 0 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  currency: {
    type: String,
    required: true,
    enum: ['AED', 'USD'],
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  carrier: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  notes: String,
  // Reference to the cart at time of purchase (optional but useful)
  cart: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cart' 
  }
}, { 
  timestamps: true 
});

// Add indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.transactionId': 1 }, { unique: true, sparse: true });

// Pre-save hook to calculate totals if not provided
orderSchema.pre('save', function(next) {
  if (this.isModified('items') {
    this.subtotal = this.items.reduce(
      (sum, item) => sum + (item.priceAtPurchase * item.quantity), 
      0
    );
    this.totalAmount = this.subtotal + this.shippingFee + this.tax;
  }
  next();
});

// Static method to get orders by user
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  // Set deliveredAt if status is 'delivered'
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  }
  
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
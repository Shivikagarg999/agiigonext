const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
        priceAtTimeOfAddition: { type: Number, required: true } 
    }],
    totalPrice: { type: Number, default: 0 }, 
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
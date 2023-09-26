const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    }],
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    razorpay_payment_id: {
        type: String
    },
    razorpay_signature: {
        type: String
    },
    status: {
        type: String,
        enum: ["created", "completed", "failed"]
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', Schema);
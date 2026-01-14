// Payment Model - MongoDB schema for payment tracking
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    // Razorpay Details
    orderId: {
        type: String,
        required: true,
        unique: true, // This already creates an index
    },
    paymentId: {
        type: String,
        default: null,
    },
    signature: {
        type: String,
        default: null,
    },

    // Amount Details
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'INR',
    },

    // Status
    status: {
        type: String,
        enum: ['created', 'paid', 'failed', 'refunded'],
        default: 'created',
    },

    // User Details
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
    },

    // Sport Details
    sportId: {
        type: String,
        required: true,
    },
    sportName: {
        type: String,
        required: true,
    },

    // Link to Registration
    registrationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration',
        default: null,
    },

}, {
    timestamps: true,
});

// Only create indexes for non-unique fields
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ email: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

// Payment Routes - Razorpay payment endpoints
const express = require('express');
const router = express.Router();

// Import middleware
const { upload } = require('../middleware/upload');

// Import controller
const {
    createOrder,
    verifyPayment,
    getPaymentStatus,
} = require('../controllers/payment');

// Routes
router.post('/create-order', createOrder);
router.post('/verify', upload.single('aadharPhoto'), verifyPayment);
router.get('/:orderId', getPaymentStatus);

module.exports = router;

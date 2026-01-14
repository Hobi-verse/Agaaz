// Payment Controller - Handles Razorpay payment flow
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Registration = require('../models/Registration');
const { instance } = require('../config/razorpay');
const { uploadToCloudinary } = require('../middleware/upload');

// Generate unique registration ID
const generateRegistrationId = (sportId) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sportCode = sportId.substring(0, 4).toUpperCase();
    return `ARMBH-${sportCode}-${timestamp}-${random}`;
};

// POST /api/payment/create-order - Create Razorpay order
const createOrder = async (req, res) => {
    try {
        const { amount, name, email, mobileNo, sportId, sportName, aadharNo } = req.body;

        // Validate required fields
        if (!amount || !name || !email || !mobileNo || !sportId || !sportName || !aadharNo) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Check if Aadhar is already registered BEFORE taking payment
        const existingRegistration = await Registration.findOne({ aadharNo });
        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'This Aadhar is already registered!',
            });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                sportId,
                sportName,
                name,
                email,
            },
        };

        const order = await instance.orders.create(options);

        // Save payment record
        const payment = new Payment({
            orderId: order.id,
            amount: amount,
            name,
            email,
            mobileNo,
            sportId,
            sportName,
            status: 'created',
        });

        await payment.save();

        res.status(201).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            key: process.env.RAZORPAY_KEY,
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
        });
    }
};

// POST /api/payment/verify - Verify payment and complete registration
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Parse formData from JSON string
        const formData = JSON.parse(req.body.formData);

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            // Update payment status to failed
            await Payment.findOneAndUpdate(
                { orderId: razorpay_order_id },
                { status: 'failed' }
            );

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed',
            });
        }

        // Payment verified - Upload photo to Cloudinary
        let aadharPhotoPath = null;
        if (req.file) {
            const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            aadharPhotoPath = cloudinaryResult.secure_url;
        }

        // Create registration
        const registrationId = generateRegistrationId(formData.sportId);

        const registration = new Registration({
            name: formData.name,
            universityName: formData.universityName,
            branch: formData.branch,
            teamName: formData.teamName || null,
            mobileNo: formData.mobileNo,
            email: formData.email,
            aadharNo: formData.aadharNo,
            aadharPhotoPath: aadharPhotoPath,
            sportCategory: formData.sportCategory,
            sportCategoryId: formData.sportCategoryId,
            sportName: formData.sportName,
            sportId: formData.sportId,
            sportType: formData.sportType,
            teamSize: parseInt(formData.teamSize) || 1,
            registrationId,
        });

        await registration.save();

        // Update payment with registration ID
        await Payment.findOneAndUpdate(
            { orderId: razorpay_order_id },
            {
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                status: 'paid',
                registrationId: registration._id,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Payment successful! Registration completed.',
            registrationId: registration.registrationId,
        });

    } catch (error) {
        console.error('Verify payment error:', error);

        // Handle duplicate Aadhar
        if (error.code === 11000 && error.keyPattern?.aadharNo) {
            return res.status(400).json({
                success: false,
                message: 'This Aadhar number is already registered.',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Payment verification failed. Please contact support.',
        });
    }
};

// GET /api/payment/:orderId - Get payment status
const getPaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId })
            .select('-signature');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        res.json({
            success: true,
            data: payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment status',
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getPaymentStatus,
};

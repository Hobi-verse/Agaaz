// Main Server - Express app with MongoDB, Cloudinary, and Razorpay
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/dataBase');
const { cloudinaryConnect } = require('./config/cloudinary');
const registrationRoutes = require('./routes/registration');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', registrationRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File size must be less than 2MB',
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

// Connect to MongoDB, Cloudinary and start server
connectDB().then(() => {
    cloudinaryConnect();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

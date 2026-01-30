// Main Server - Express app with MongoDB, Cloudinary, and Razorpay
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/dataBase');
const { cloudinaryConnect } = require('./config/cloudinary');
const registrationRoutes = require('./routes/registration');
const paymentRoutes = require('./routes/payment');
const visitsRoutes = require('./routes/visits');
const matchesRoutes = require('./routes/matches');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["https://www.aagaaz.online", "https://aagaaz.online", "http://localhost:5173"]
const isLocalhostOrigin = (origin) => {
    try {
        const url = new URL(origin);
        return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    } catch {
        return false;
    }
};

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // allow server-to-server or Postman requests
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || isLocalhostOrigin(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // IMPORTANT if using cookies / auth
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/auth', authRoutes);

// Serve frontend (Vite build) in production
// This prevents 404s when refreshing on client-side routes (React Router).
if (process.env.NODE_ENV === 'production') {
    const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
    app.use(express.static(frontendDistPath));

    // Serve index.html for any non-API GET route
    app.get(/^\/(?!api(?:\/|$)|health$).*/, (req, res) => {
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
}

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
            message: 'File size must be less than 1MB',
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

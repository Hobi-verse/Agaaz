// Registration Controller - Handles registration API logic
const Registration = require('../models/Registration');
const { uploadToCloudinary } = require('../middleware/upload');

// Generate unique registration ID
const generateRegistrationId = (sportId) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const sportCode = sportId.substring(0, 4).toUpperCase();
    return `ARMBH-${sportCode}-${timestamp}-${random}`;
};

// POST /api/register - Submit new registration
const createRegistration = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aadhar photo is required',
            });
        }

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

        const {
            name,
            universityName,
            branch,
            teamName,
            mobileNo,
            email,
            aadharNo,
            sportCategory,
            sportCategoryId,
            sportName,
            sportId,
            sportType,
            teamSize,
        } = req.body;

        const registrationId = generateRegistrationId(sportId);

        const registration = new Registration({
            name,
            universityName,
            branch,
            teamName: teamName || null,
            mobileNo,
            email,
            aadharNo,
            aadharPhotoPath: cloudinaryResult.secure_url, // Cloudinary URL
            sportCategory,
            sportCategoryId,
            sportName,
            sportId,
            sportType,
            teamSize: parseInt(teamSize) || 1,
            registrationId,
        });

        await registration.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            registrationId: registration.registrationId,
            data: {
                registrationId: registration.registrationId,
                name: registration.name,
                sportName: registration.sportName,
                registrationDate: registration.registrationDate,
            },
        });

    } catch (error) {

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages[0],
                errors: messages,
            });
        }

        if (error.code === 11000) {
            // Check which field caused the duplicate error
            if (error.keyPattern?.aadharNo) {
                return res.status(400).json({
                    success: false,
                    message: 'This Aadhar number is already registered. One person can register only once.',
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Registration failed. Please try again.',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.',
        });
    }
};

// GET /api/registrations - Get all registrations
const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .select('-aadharNo -aadharPhotoPath')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: registrations.length,
            data: registrations,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations',
        });
    }
};

// GET /api/registration/:id - Get registration by ID
const getRegistrationById = async (req, res) => {
    try {
        const registration = await Registration.findOne({
            registrationId: req.params.id,
        }).select('-aadharNo -aadharPhotoPath');

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found',
            });
        }

        res.json({
            success: true,
            data: registration,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registration',
        });
    }
};

module.exports = {
    createRegistration,
    getAllRegistrations,
    getRegistrationById,
};

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
        const {
            sportId,
            sportName,
            sportCategory,
            q,
            page = '1',
            limit = '100',
        } = req.query;

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);

        const filter = {};

        if (sportId) filter.sportId = sportId;
        if (sportName) filter.sportName = { $regex: sportName, $options: 'i' };
        if (sportCategory) filter.sportCategory = { $regex: sportCategory, $options: 'i' };

        if (q && String(q).trim()) {
            const query = String(q).trim();
            const regex = { $regex: query, $options: 'i' };
            filter.$or = [
                { name: regex },
                { email: regex },
                { mobileNo: regex },
                { universityName: regex },
                { branch: regex },
                { registrationId: regex },
                { sportName: regex },
                { sportCategory: regex },
                { teamName: regex },
            ];
        }

        const [registrations, total] = await Promise.all([
            Registration.find(filter)
                .select('-aadharNo -aadharPhotoPath')
                .sort({ createdAt: -1 })
                .skip((pageNumber - 1) * limitNumber)
                .limit(limitNumber),
            Registration.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: registrations.length,
            total,
            page: pageNumber,
            limit: limitNumber,
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
    getSportsList,
};

// GET /api/registrations/sports - Get distinct sports used in registrations
async function getSportsList(req, res) {
    try {
        const sports = await Registration.aggregate([
            {
                $group: {
                    _id: '$sportId',
                    sportId: { $first: '$sportId' },
                    sportName: { $first: '$sportName' },
                    sportCategory: { $first: '$sportCategory' },
                    sportCategoryId: { $first: '$sportCategoryId' },
                    sportType: { $first: '$sportType' },
                    teamSize: { $first: '$teamSize' },
                },
            },
            { $sort: { sportCategory: 1, sportName: 1 } },
        ]);

        res.json({
            success: true,
            count: sports.length,
            data: sports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sports list',
        });
    }
}

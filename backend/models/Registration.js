// Registration Model - MongoDB schema for sports event registration
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    // Common Fields
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    universityName: {
        type: String,
        required: [true, 'University name is required'],
        trim: true,
        maxlength: [100, 'University name cannot exceed 100 characters'],
    },
    branch: {
        type: String,
        required: [true, 'Branch is required'],
        trim: true,
        maxlength: [50, 'Branch cannot exceed 50 characters'],
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^[6-9]\d{9}$/, 'Enter a valid 10 digit mobile number'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
    },
    aadharNo: {
        type: String,
        required: [true, 'Aadhar number is required'],
        match: [/^\d{12}$/, 'Aadhar number must be 12 digits'],
    },
    aadharPhotoPath: {
        type: String,
        required: [true, 'Aadhar photo is required'],
    },

    // Sport Details
    sportCategory: {
        type: String,
        required: [true, 'Sport category is required'],
    },
    sportCategoryId: {
        type: String,
        required: true,
    },
    sportName: {
        type: String,
        required: [true, 'Sport name is required'],
    },
    sportId: {
        type: String,
        required: true,
    },
    sportType: {
        type: String,
        required: true,
        enum: ['individual', 'team', 'singles', 'doubles', 'mixed_doubles', 'squad'],
    },
    teamSize: {
        type: Number,
        default: 1,
    },

    // Team Fields (Optional - only for team sports)
    teamName: {
        type: String,
        trim: true,
        maxlength: [50, 'Team name cannot exceed 50 characters'],
    },

    // Metadata
    registrationId: {
        type: String,
        required: true,
        unique: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Index for faster queries
registrationSchema.index({ email: 1 });
registrationSchema.index({ mobileNo: 1 });
registrationSchema.index({ sportId: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;

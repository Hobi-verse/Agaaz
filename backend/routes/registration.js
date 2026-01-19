// Registration Routes - API endpoints for sports registration
const express = require('express');
const router = express.Router();

// Import middleware
const { upload } = require('../middleware/upload');

// Import controller
const {
    createRegistration,
    getAllRegistrations,
    getRegistrationById,
    getSportsList,
} = require('../controllers/registration');

// Routes
router.post('/register', upload.single('aadharPhoto'), createRegistration);
router.get('/registrations/sports', getSportsList);
router.get('/registrations', getAllRegistrations);
router.get('/registration/:id', getRegistrationById);

module.exports = router;

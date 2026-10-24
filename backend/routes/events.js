const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { listEvents, createEvent, addEventSport } = require('../controllers/events');

router.get('/', listEvents);
router.post('/', authenticateToken, createEvent);
router.post('/:eventId/sports', authenticateToken, addEventSport);

module.exports = router;

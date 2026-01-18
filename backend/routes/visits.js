// Visits Routes - Site-wide visit counter endpoints
const express = require('express');
const router = express.Router();

const { getVisitCount, incrementVisitCount } = require('../controllers/visits');

router.get('/', getVisitCount);
router.post('/', incrementVisitCount);

module.exports = router;

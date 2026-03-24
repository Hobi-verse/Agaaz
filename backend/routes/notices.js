const express = require('express');

const {
  listPublishedNotices,
  listAdminNotices,
  createNotice,
  updateNotice,
} = require('../controllers/notices');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', listPublishedNotices);
router.get('/admin', authenticateToken, listAdminNotices);
router.post('/', authenticateToken, createNotice);
router.put('/:id', authenticateToken, updateNotice);

module.exports = router;

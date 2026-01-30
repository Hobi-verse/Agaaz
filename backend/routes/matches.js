const express = require('express');
const router = express.Router();

const {
  getParticipants,
  listMatches,
  createMatch,
  setMatchResult,
  updateMatchStatus,
} = require('../controllers/matches');
const { authenticateToken } = require('../middleware/auth');

router.get('/participants', authenticateToken, getParticipants);
router.get('/', listMatches);
router.post('/', authenticateToken, createMatch);
router.put('/:id/result', authenticateToken, setMatchResult);
router.put('/:id/status', authenticateToken, updateMatchStatus);

module.exports = router;

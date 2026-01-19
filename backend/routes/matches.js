const express = require('express');
const router = express.Router();

const {
  getParticipants,
  listMatches,
  createMatch,
  setMatchResult,
} = require('../controllers/matches');

router.get('/participants', getParticipants);
router.get('/', listMatches);
router.post('/', createMatch);
router.put('/:id/result', setMatchResult);

module.exports = router;

const Match = require('../models/Match');
const Registration = require('../models/Registration');

// GET /api/matches/participants?sportId=...
// Returns only registrationId + name (minimal for match making)
async function getParticipants(req, res) {
  try {
    const { sportId } = req.query;
    if (!sportId) {
      return res.status(400).json({ success: false, message: 'sportId is required' });
    }

    const participants = await Registration.find({ sportId })
      .select('registrationId name')
      .sort({ name: 1 });

    return res.json({
      success: true,
      count: participants.length,
      data: participants,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch participants' });
  }
}

// GET /api/matches?sportId=...
async function listMatches(req, res) {
  try {
    const { sportId, page = '1', limit = '100' } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);

    const filter = {};
    if (sportId) filter.sportId = sportId;

    const [matches, total] = await Promise.all([
      Match.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      Match.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      count: matches.length,
      total,
      page: pageNumber,
      limit: limitNumber,
      data: matches,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch matches' });
  }
}

// POST /api/matches
// body: { sportId, registrationIdA, registrationIdB }
async function createMatch(req, res) {
  try {
    const { sportId, registrationIdA, registrationIdB } = req.body;

    if (!sportId || !registrationIdA || !registrationIdB) {
      return res.status(400).json({
        success: false,
        message: 'sportId, registrationIdA and registrationIdB are required',
      });
    }

    if (registrationIdA === registrationIdB) {
      return res.status(400).json({ success: false, message: 'Participants must be different' });
    }

    const regs = await Registration.find({
      sportId,
      registrationId: { $in: [registrationIdA, registrationIdB] },
    }).select('registrationId name sportId sportName sportCategory');

    if (regs.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Both participants must exist and belong to the same sport',
      });
    }

    const regA = regs.find((r) => r.registrationId === registrationIdA);
    const regB = regs.find((r) => r.registrationId === registrationIdB);

    const match = await Match.create({
      sportId,
      sportName: regA.sportName,
      sportCategory: regA.sportCategory,
      participants: [
        { registrationId: regA.registrationId, name: regA.name },
        { registrationId: regB.registrationId, name: regB.name },
      ],
      status: 'scheduled',
    });

    return res.status(201).json({ success: true, data: match });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create match' });
  }
}

// PUT /api/matches/:id/result
// body: { winnerRegistrationId }
async function setMatchResult(req, res) {
  try {
    const { id } = req.params;
    const { winnerRegistrationId } = req.body;

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const participantIds = match.participants.map((p) => p.registrationId);

    if (!winnerRegistrationId || !participantIds.includes(winnerRegistrationId)) {
      return res.status(400).json({
        success: false,
        message: 'winnerRegistrationId must be one of the match participants',
      });
    }

    const loserRegistrationId = participantIds.find((pid) => pid !== winnerRegistrationId) || null;

    match.winnerRegistrationId = winnerRegistrationId;
    match.loserRegistrationId = loserRegistrationId;
    match.status = 'completed';

    await match.save();

    return res.json({ success: true, data: match });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update match result' });
  }
}

module.exports = {
  getParticipants,
  listMatches,
  createMatch,
  setMatchResult,
};

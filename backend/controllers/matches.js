const Match = require('../models/Match');
const Registration = require('../models/Registration');

// GET /api/matches/participants?sportId=...
// Returns only registrationId + name (minimal for match making)
// Excludes participants who have lost in completed matches for this sport
async function getParticipants(req, res) {
  try {
    const { sportId } = req.query;
    if (!sportId) {
      return res.status(400).json({ success: false, message: 'sportId is required' });
    }

    // Get loser registrationIds from completed matches
    const losers = await Match.find({ sportId, status: 'finished' }).select('loserRegistrationId').lean();
    const loserIds = losers.map(m => m.loserRegistrationId).filter(id => id !== null);

    const participants = await Registration.find({ sportId, registrationId: { $nin: loserIds } })
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
        .sort({ scheduledAt: -1, createdAt: -1 })
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
// body: { sportId, sportName, sportCategory, registrationIdA, nameA, registrationIdB, nameB, scheduledAt }
async function createMatch(req, res) {
  try {
    const { sportId, sportName, sportCategory, registrationIdA, nameA, registrationIdB, nameB, scheduledAt } = req.body;

    if (!sportId || !sportName) {
      return res.status(400).json({
        success: false,
        message: 'sportId and sportName are required',
      });
    }

    if ((!registrationIdA && !nameA) || (!registrationIdB && !nameB)) {
      return res.status(400).json({ success: false, message: 'Both participants are required' });
    }

    if (registrationIdA && registrationIdB && registrationIdA === registrationIdB) {
      return res.status(400).json({ success: false, message: 'Participants must be different' });
    }

    // Validate registered participants
    if (registrationIdA) {
      const regA = await Registration.findOne({ registrationId: registrationIdA, sportId });
      if (!regA) {
        return res.status(400).json({ success: false, message: 'Participant A not found for this sport' });
      }
    }

    if (registrationIdB) {
      const regB = await Registration.findOne({ registrationId: registrationIdB, sportId });
      if (!regB) {
        return res.status(400).json({ success: false, message: 'Participant B not found for this sport' });
      }
    }

    const match = await Match.create({
      sportId,
      sportName,
      sportCategory,
      participants: [
        { registrationId: registrationIdA || null, name: registrationIdA ? (await Registration.findOne({ registrationId: registrationIdA })).name : nameA },
        { registrationId: registrationIdB || null, name: registrationIdB ? (await Registration.findOne({ registrationId: registrationIdB })).name : nameB },
      ],
      status: 'scheduled',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    });

    return res.status(201).json({ success: true, data: match });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create match' });
  }
}

// PUT /api/matches/:id/result
// body: { winnerRegistrationId } or { winnerName }, scoreA, scoreB
async function setMatchResult(req, res) {
  try {
    const { id } = req.params;
    const { winnerRegistrationId, winnerName, scoreA, scoreB } = req.body;

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const participantIds = match.participants.map((p) => p.registrationId);
    const participantNames = match.participants.map((p) => p.name);

    let winnerId = winnerRegistrationId;
    if (!winnerId && winnerName) {
      const participant = match.participants.find((p) => p.name === winnerName);
      if (participant) {
        winnerId = participant.registrationId;
      }
    }

    if (!winnerId && !winnerName) {
      return res.status(400).json({
        success: false,
        message: 'winnerRegistrationId or winnerName must be provided',
      });
    }

    if (winnerId && !participantIds.includes(winnerId)) {
      return res.status(400).json({
        success: false,
        message: 'Winner must be one of the match participants',
      });
    }

    if (winnerName && !participantNames.includes(winnerName)) {
      return res.status(400).json({
        success: false,
        message: 'Winner name must match one of the match participants',
      });
    }

    const loserId = participantIds.find((pid) => pid !== winnerId) || null;
    const loserName = participantNames.find((name) => name !== winnerName) || null;

    match.winnerRegistrationId = winnerId;
    match.winnerName = winnerName;
    match.loserRegistrationId = loserId;
    match.scoreA = scoreA !== undefined ? scoreA : null;
    match.scoreB = scoreB !== undefined ? scoreB : null;
    match.status = 'finished';

    await match.save();

    return res.json({ success: true, data: match });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update match result' });
  }
}

// PUT /api/matches/:id/status
// body: { status: 'ongoing' | 'finished' }
async function updateMatchStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ongoing', 'finished'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    match.status = status;
    await match.save();

    return res.json({ success: true, data: match });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update match status' });
  }
}

module.exports = {
  getParticipants,
  listMatches,
  createMatch,
  setMatchResult,
  updateMatchStatus,
};

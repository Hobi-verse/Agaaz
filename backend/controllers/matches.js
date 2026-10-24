const Match = require('../models/Match');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { notifyMatchesChanged, streamMatches } = require('../services/matchStream');

const legacyPointSports = new Set([
  'cricket', 'football', 'volleyball', 'basketball', 'kho_kho', 'tug_of_war',
  'badminton_singles', 'badminton_doubles', 'badminton_mixed',
  'tt_singles', 'tt_doubles', 'tt_mixed', 'carrom', 'carrom_singles',
]);

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
    const {
      sportId,
      sportName: requestedSportName,
      sportCategory: requestedSportCategory,
      eventId,
      registrationIdA,
      nameA,
      registrationIdB,
      nameB,
      scheduledAt,
    } = req.body;

    if (!sportId) {
      return res.status(400).json({
        success: false,
        message: 'sportId is required',
      });
    }

    const cleanNameA = String(nameA || '').trim();
    const cleanNameB = String(nameB || '').trim();
    if ((!registrationIdA && !cleanNameA) || (!registrationIdB && !cleanNameB)) {
      return res.status(400).json({ success: false, message: 'Both participants are required' });
    }

    if (registrationIdA && registrationIdB && registrationIdA === registrationIdB) {
      return res.status(400).json({ success: false, message: 'Participants must be different' });
    }

    if (!registrationIdA && !registrationIdB && cleanNameA.toLowerCase() === cleanNameB.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Participants must be different' });
    }

    let selectedSport = null;
    let eventName = null;
    if (eventId) {
      const event = await Event.findOne({ eventId });
      selectedSport = event?.sports.find((sport) => sport.sportId === sportId);
      if (!event || !selectedSport) {
        return res.status(400).json({ success: false, message: 'Sport was not found in this event' });
      }
      eventName = event.eventName;
    }

    const resolvedSportName = selectedSport?.sportName || requestedSportName;
    const resolvedSportCategory = selectedSport?.sportCategory || requestedSportCategory;
    const scoringMode = selectedSport?.scoringMode || req.body.scoringMode ||
      (legacyPointSports.has(sportId) ? 'points' : 'result');
    if (!resolvedSportName || !['points', 'result'].includes(scoringMode)) {
      return res.status(400).json({ success: false, message: 'A valid sport and scoring mode are required' });
    }

    // Validate registered participants
    const registrationIds = [registrationIdA, registrationIdB].filter(Boolean);
    const registrations = registrationIds.length
      ? await Registration.find({ registrationId: { $in: registrationIds }, sportId }).select('registrationId name').lean()
      : [];
    const registrationsById = new Map(registrations.map((registration) => [registration.registrationId, registration]));
    if (registrationIdA && !registrationsById.has(registrationIdA)) {
      return res.status(400).json({ success: false, message: 'Participant A not found for this sport' });
    }
    if (registrationIdB && !registrationsById.has(registrationIdB)) {
      return res.status(400).json({ success: false, message: 'Participant B not found for this sport' });
    }

    const match = await Match.create({
      sportId,
      sportName: resolvedSportName,
      sportCategory: resolvedSportCategory,
      eventId: eventId || null,
      eventName,
      scoringMode,
      participants: [
        { registrationId: registrationIdA || null, name: registrationsById.get(registrationIdA)?.name || cleanNameA },
        { registrationId: registrationIdB || null, name: registrationsById.get(registrationIdB)?.name || cleanNameB },
      ],
      status: 'scheduled',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    });

    notifyMatchesChanged();
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

    if (winnerId && winnerName) {
      const winnerById = match.participants.find((participant) => participant.registrationId === winnerId);
      if (winnerById?.name !== winnerName) {
        return res.status(400).json({ success: false, message: 'Winner ID and name must refer to the same participant' });
      }
    }

    const winnerIndex = match.participants.findIndex((participant) =>
      winnerId ? participant.registrationId === winnerId : participant.name === winnerName,
    );
    const resolvedWinnerName = match.participants[winnerIndex]?.name || winnerName;
    const loserId = match.participants[1 - winnerIndex]?.registrationId || null;

    match.winnerRegistrationId = winnerId;
    match.winnerName = resolvedWinnerName;
    match.loserRegistrationId = loserId;
    match.scoreA = scoreA !== undefined ? scoreA : null;
    match.scoreB = scoreB !== undefined ? scoreB : null;
    match.liveScoreUpdatedAt = new Date();
    match.status = 'finished';

    await match.save();
    notifyMatchesChanged();

    return res.json({ success: true, data: match });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update match result' });
  }
}

// PUT /api/matches/:id/live-score
// body: { scoreA, scoreB }
async function updateLiveScore(req, res) {
  try {
    const { id } = req.params;
    const { scoreA, scoreB } = req.body;

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (match.status !== 'ongoing') {
      return res.status(400).json({
        success: false,
        message: 'Live score can only be updated for ongoing matches',
      });
    }

    if (match.scoringMode === 'result' ||
        (!match.scoringMode && !legacyPointSports.has(match.sportId))) {
      return res.status(400).json({ success: false, message: 'This event is configured as result-only' });
    }

    match.scoreA = scoreA !== undefined ? String(scoreA).trim() || null : match.scoreA;
    match.scoreB = scoreB !== undefined ? String(scoreB).trim() || null : match.scoreB;
    match.liveScoreUpdatedAt = new Date();

    await match.save();
    notifyMatchesChanged();

    return res.json({ success: true, data: match });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update live score' });
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
    notifyMatchesChanged();

    return res.json({ success: true, data: match });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update match status' });
  }
}

module.exports = {
  streamMatches,
  getParticipants,
  listMatches,
  createMatch,
  updateLiveScore,
  setMatchResult,
  updateMatchStatus,
};

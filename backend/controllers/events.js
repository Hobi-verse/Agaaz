const Event = require('../models/Event');

function toSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

async function listEvents(req, res) {
  try {
    const events = await Event.find()
      .select('eventId eventName description sports createdAt')
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
}

async function createEvent(req, res) {
  try {
    const eventName = String(req.body.eventName || '').trim();
    const description = String(req.body.description || '').trim();
    if (!eventName) {
      return res.status(400).json({ success: false, message: 'Event name is required' });
    }

    const slug = toSlug(eventName) || 'event';
    let eventId = slug;
    while (await Event.exists({ eventId })) {
      eventId = `${slug}-${Math.random().toString(36).slice(2, 7)}`;
    }

    const event = await Event.create({
      eventId,
      eventName,
      description,
      createdBy: req.user?.userId || null,
    });
    return res.status(201).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create event' });
  }
}

async function addEventSport(req, res) {
  try {
    const event = await Event.findOne({ eventId: req.params.eventId });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const sportName = String(req.body.sportName || '').trim();
    const sportCategory = String(req.body.sportCategory || '').trim();
    const scoringMode = req.body.scoringMode || 'points';
    if (!sportName) {
      return res.status(400).json({ success: false, message: 'Sport name is required' });
    }
    if (!['points', 'result'].includes(scoringMode)) {
      return res.status(400).json({ success: false, message: 'Scoring mode must be points or result' });
    }

    const slug = toSlug(sportName) || 'sport';
    let sportId = `${event.eventId}_${slug}`;
    let suffix = 2;
    while (event.sports.some((sport) => sport.sportId === sportId)) {
      sportId = `${event.eventId}_${slug}_${suffix}`;
      suffix += 1;
    }

    event.sports.push({ sportId, sportName, sportCategory, scoringMode });
    await event.save();
    return res.status(201).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add sport' });
  }
}

module.exports = { listEvents, createEvent, addEventSport };

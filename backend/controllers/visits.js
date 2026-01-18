// Visits Controller - Handles site-wide visit counter
const Visit = require('../models/Visit');

const COUNTER_KEY = 'site';

// Ensure the counter document exists
const ensureCounterDoc = async () => {
  const existing = await Visit.findOne({ key: COUNTER_KEY });
  if (existing) return existing;

  const created = new Visit({ key: COUNTER_KEY, count: 0 });
  await created.save();
  return created;
};

// GET /api/visits - Get current count
const getVisitCount = async (req, res) => {
  try {
    const doc = await ensureCounterDoc();
    return res.json({ success: true, count: doc.count });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch visit count' });
  }
};

// POST /api/visits - Increment and return updated count
const incrementVisitCount = async (req, res) => {
  try {
    const doc = await Visit.findOneAndUpdate(
      { key: COUNTER_KEY },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, count: doc.count });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update visit count' });
  }
};

module.exports = {
  getVisitCount,
  incrementVisitCount,
};

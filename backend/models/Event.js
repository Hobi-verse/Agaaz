const mongoose = require('mongoose');

const eventSportSchema = new mongoose.Schema(
  {
    sportId: { type: String, required: true },
    sportName: { type: String, required: true, trim: true, maxlength: 80 },
    sportCategory: { type: String, default: '', trim: true, maxlength: 60 },
    scoringMode: { type: String, enum: ['points', 'result'], default: 'points' },
  },
  { _id: false },
);

const eventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true },
    eventName: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    sports: { type: [eventSportSchema], default: [] },
    createdBy: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Event', eventSchema);

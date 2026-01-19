const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    registrationId: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false },
);

const matchSchema = new mongoose.Schema(
  {
    sportId: { type: String, required: true, index: true },
    sportName: { type: String, required: true },
    sportCategory: { type: String },

    participants: {
      type: [participantSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 2,
        message: 'Match must have exactly 2 participants',
      },
      required: true,
    },

    status: {
      type: String,
      enum: ['scheduled', 'completed'],
      default: 'scheduled',
      index: true,
    },

    winnerRegistrationId: { type: String, default: null },
    loserRegistrationId: { type: String, default: null },

    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

matchSchema.index({ sportId: 1, createdAt: -1 });

module.exports = mongoose.model('Match', matchSchema);

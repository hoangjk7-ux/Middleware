const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, required: true, enum: ['call', 'email', 'meeting', 'note'] },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
});

module.exports = mongoose.model('Interaction', interactionSchema);
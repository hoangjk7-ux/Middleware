const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  company: String,
  position: String,
  source: { 
    type: String, 
    enum: ['email', 'phone', 'website', 'referral', 'social', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
    default: 'new'
  },
  notes: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
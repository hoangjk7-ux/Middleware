const express = require('express');
const Interaction = require('../app/models/Interaction');
const auth = require('../app/middleware/auth');

const router = express.Router();

// Get all interactions
router.get('/', auth, async (req, res) => {
  try {
    const interactions = await Interaction.find().populate('customer');
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get interactions by customer
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    const interactions = await Interaction.find({ customer: req.params.customerId });
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create interaction
router.post('/', auth, async (req, res) => {
  try {
    const interaction = new Interaction(req.body);
    await interaction.save();
    res.status(201).json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update interaction
router.put('/:id', auth, async (req, res) => {
  try {
    const interaction = await Interaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    res.json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete interaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const interaction = await Interaction.findByIdAndDelete(req.params.id);
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    res.json({ message: 'Interaction deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
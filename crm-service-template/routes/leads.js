const express = require('express');
const Lead = require('../app/models/Lead');
const LeadService = require('../app/services/LeadService');
const auth = require('../app/middleware/auth');

const router = express.Router();

// Get all leads
router.get('/', auth, async (req, res) => {
  try {
    const leads = await LeadService.getAllLeads();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leads by status
router.get('/status/:status', auth, async (req, res) => {
  try {
    const leads = await LeadService.getLeadsByStatus(req.params.status);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leads assigned to user
router.get('/assigned/:userId', auth, async (req, res) => {
  try {
    const leads = await LeadService.getLeadsByAssignee(req.params.userId);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lead by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await LeadService.getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create lead
router.post('/', auth, async (req, res) => {
  try {
    const lead = await LeadService.createLead(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update lead
router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await LeadService.updateLead(req.params.id, req.body);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign lead to user
router.patch('/:id/assign/:userId', auth, async (req, res) => {
  try {
    const lead = await LeadService.assignLead(req.params.id, req.params.userId);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Convert lead to customer
router.patch('/:id/convert/:customerId', auth, async (req, res) => {
  try {
    const lead = await LeadService.convertLead(req.params.id, req.params.customerId);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get lead statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const stats = await LeadService.getLeadStatistics();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lead
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await LeadService.deleteLead(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
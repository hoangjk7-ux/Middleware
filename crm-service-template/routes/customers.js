const express = require('express');
const Customer = require('../app/models/Customer');
const auth = require('../app/middleware/auth');

const router = express.Router();

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create customer
router.post('/', auth, async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update customer
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete customer
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
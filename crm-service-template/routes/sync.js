const express = require('express');
const DataSyncService = require('../app/services/DataSyncService');
const auth = require('../app/middleware/auth');

const router = express.Router();

// Get sync status
router.get('/status', auth, async (req, res) => {
  try {
    const status = await DataSyncService.getSyncStatus();
    res.json({
      success: true,
      data: status,
      message: 'Sync status retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get sync status'
    });
  }
});

// Sync from MongoDB to Supabase
router.post('/mongo-to-supabase', auth, async (req, res) => {
  try {
    const result = await DataSyncService.syncAllToSupabase();
    res.json({
      success: true,
      data: result,
      message: 'Data sync from MongoDB to Supabase completed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Data sync failed'
    });
  }
});

// Sync from Supabase to MongoDB
router.post('/supabase-to-mongo', auth, async (req, res) => {
  try {
    const result = await DataSyncService.syncFromSupabaseToMongoDB();
    res.json({
      success: true,
      data: result,
      message: 'Data sync from Supabase to MongoDB completed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Data sync failed'
    });
  }
});

// Sync specific collection
router.post('/:collection/mongo-to-supabase', auth, async (req, res) => {
  try {
    const { collection } = req.params;
    let result;

    switch (collection) {
      case 'users':
        result = await DataSyncService.syncUsersToSupabase();
        break;
      case 'customers':
        result = await DataSyncService.syncCustomersToSupabase();
        break;
      case 'leads':
        result = await DataSyncService.syncLeadsToSupabase();
        break;
      case 'interactions':
        result = await DataSyncService.syncInteractionsToSupabase();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid collection. Use: users, customers, leads, or interactions'
        });
    }

    res.json({
      success: true,
      data: result,
      message: `${collection} sync completed`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: `${req.params.collection} sync failed`
    });
  }
});

module.exports = router;
#!/usr/bin/env node

/**
 * Data Synchronization Script
 * Sync data between MongoDB and Supabase
 *
 * Usage:
 * - npm run sync:mongo-to-supabase
 * - npm run sync:supabase-to-mongo
 * - npm run sync:status
 */

require('dotenv').config();
const DataSyncService = require('../app/services/DataSyncService');

const command = process.argv[2];

async function runSync() {
  try {
    console.log('🚀 Starting data synchronization...\n');

    switch (command) {
      case 'mongo-to-supabase':
        console.log('📤 Syncing from MongoDB to Supabase...');
        await DataSyncService.syncAllToSupabase();
        break;

      case 'supabase-to-mongo':
        console.log('📥 Syncing from Supabase to MongoDB...');
        await DataSyncService.syncFromSupabaseToMongoDB();
        break;

      case 'status':
        console.log('📊 Checking sync status...');
        const status = await DataSyncService.getSyncStatus();
        console.log('\n📈 Synchronization Status:');
        console.log('='.repeat(50));
        console.log('Collection'.padEnd(15), 'MongoDB'.padEnd(10), 'Supabase'.padEnd(10), 'Difference');
        console.log('-'.repeat(50));
        Object.keys(status.mongodb).forEach(key => {
          const mongo = status.mongodb[key];
          const supa = status.supabase[key];
          const diff = mongo - supa;
          console.log(
            key.padEnd(15),
            mongo.toString().padEnd(10),
            supa.toString().padEnd(10),
            (diff === 0 ? '✓' : diff.toString())
          );
        });
        break;

      default:
        console.log('❌ Invalid command. Use:');
        console.log('  mongo-to-supabase  - Sync from MongoDB to Supabase');
        console.log('  supabase-to-mongo   - Sync from Supabase to MongoDB');
        console.log('  status             - Check synchronization status');
        process.exit(1);
    }

    console.log('\n✅ Synchronization completed successfully!');
  } catch (error) {
    console.error('\n❌ Synchronization failed:', error.message);
    process.exit(1);
  }
}

runSync();
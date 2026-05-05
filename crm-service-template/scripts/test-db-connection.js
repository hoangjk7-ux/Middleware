#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests connection to either MongoDB or Supabase
 * 
 * Usage: node scripts/test-db-connection.js
 */

require('dotenv').config();

const dbType = process.env.DATABASE_TYPE || 'mongodb';

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  console.log(`Database Type: ${dbType}`);
  
  if (dbType === 'supabase') {
    await testSupabase();
  } else {
    await testMongoDB();
  }
}

async function testSupabase() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
    }

    console.log(`URL: ${supabaseUrl}`);
    console.log('Attempting connection...\n');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Auth session
    console.log('Test 1: Checking authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth check failed:', authError.message);
    } else {
      console.log('✅ Authentication successful');
    }

    // Test 2: Query users table
    console.log('\nTest 2: Querying users table...');
    const { data: usersData, error: usersError, status } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('❌ Query failed:', usersError.message);
    } else {
      console.log(`✅ Query successful (Status: ${status})`);
      console.log(`   Found ${usersData.length === 0 ? 'no' : usersData.length} user(s)`);
    }

    // Test 3: Check all tables
    console.log('\nTest 3: Checking table accessibility...');
    const tables = ['customers', 'leads', 'interactions'];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Accessible`);
      }
    }

    console.log('\n✅ Supabase connection test completed successfully!');

  } catch (error) {
    console.error('\n❌ Supabase connection test failed:');
    console.error(error.message);
    process.exit(1);
  }
}

async function testMongoDB() {
  try {
    const mongoose = require('mongoose');
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/crm-db';
    console.log(`URI: ${mongoUri}`);
    console.log('Attempting connection...\n');

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Connected to: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Status: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    // List collections
    console.log('\nAvailable Collections:');
    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('(No collections yet)');
    } else {
      collections.forEach(col => console.log(`  - ${col.name}`));
    }

    console.log('\n✅ MongoDB connection test completed successfully!');

    await mongoose.disconnect();

  } catch (error) {
    console.error('\n❌ MongoDB connection test failed:');
    console.error(error.message);
    process.exit(1);
  }
}

testConnection().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
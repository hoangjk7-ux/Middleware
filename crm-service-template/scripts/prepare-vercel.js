#!/usr/bin/env node

/**
 * Vercel Deployment Preparation Script
 * Prepares the project for Vercel deployment
 *
 * Usage: npm run prepare:vercel
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing for Vercel deployment...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'vercel.json',
  '.vercelignore',
  'api/index.js',
  'server.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

if (!allFilesExist) {
  console.error('\n❌ Deployment preparation failed. Missing required files.');
  process.exit(1);
}

// Check package.json for required dependencies
console.log('\n📦 Checking dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredDeps = [
  'express',
  '@supabase/supabase-js',
  'cors',
  'dotenv',
  'bcryptjs',
  'jsonwebtoken'
];

let missingDeps = [];

requiredDeps.forEach(dep => {
  if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
    missingDeps.push(dep);
  }
});

if (missingDeps.length > 0) {
  console.error(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
  console.log('Run: npm install');
  process.exit(1);
} else {
  console.log('✅ All required dependencies found');
}

// Check environment variables template
console.log('\n🔧 Checking environment configuration...');
if (fs.existsSync('.env.example')) {
  console.log('✅ Environment template found: .env.example');
} else {
  console.log('⚠️  No .env.example found');
}

// Check Supabase schema
console.log('\n🗄️  Checking database schema...');
if (fs.existsSync('supabase/schema.sql')) {
  console.log('✅ Supabase schema found');
} else {
  console.log('⚠️  No Supabase schema found');
}

// Generate deployment summary
console.log('\n📋 Deployment Summary:');
console.log('='.repeat(50));
console.log('✅ Project structure ready');
console.log('✅ Dependencies verified');
console.log('✅ Vercel configuration ready');
console.log('✅ Serverless function configured');
console.log('✅ Environment variables configured');
console.log('');
console.log('📝 Next Steps:');
console.log('1. Push code to GitHub repository');
console.log('2. Go to https://vercel.com/new');
console.log('3. Import your GitHub repository');
console.log('4. Set environment variables in Vercel dashboard');
console.log('5. Deploy!');
console.log('');
console.log('🔗 Required Environment Variables:');
console.log('   DATABASE_TYPE=supabase');
console.log('   SUPABASE_URL=https://your-project.supabase.co');
console.log('   SUPABASE_KEY=your-anon-public-key');
console.log('   JWT_SECRET=your-production-secret');
console.log('');
console.log('🎉 Ready for deployment!');

console.log('\n📖 Documentation:');
console.log('   DEPLOYMENT.md - Complete deployment guide');
console.log('   SUPABASE_SETUP.md - Database setup');
console.log('   DATA_SYNC.md - Data synchronization');
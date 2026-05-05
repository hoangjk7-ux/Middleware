const mongoose = require('mongoose');

const connectDB = async () => {
  const dbType = process.env.DATABASE_TYPE || 'mongodb';

  if (dbType === 'supabase') {
    return connectSupabase();
  } else {
    return connectMongoDB();
  }
};

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const connectSupabase = async () => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    console.log(`✅ Supabase Connected: ${supabaseUrl}`);
    return supabase;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    process.exit(1);
  }
};

const getDBType = () => {
  return process.env.DATABASE_TYPE || 'mongodb';
};

module.exports = connectDB;
module.exports.getDBType = getDBType;
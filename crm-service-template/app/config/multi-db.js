const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');

const dbType = process.env.DATABASE_TYPE || 'mongodb'; // 'mongodb' or 'supabase'

let mongoConnection = null;
let supabaseClient = null;

const connectDB = async () => {
  if (dbType === 'mongodb') {
    return connectMongoDB();
  } else if (dbType === 'supabase') {
    return connectSupabase();
  }
};

const connectMongoDB = async () => {
  if (mongoConnection) {
    console.log('MongoDB already connected');
    return mongoConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const connectSupabase = async () => {
  if (supabaseClient) {
    console.log('Supabase already connected');
    return supabaseClient;
  }

  try {
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    
    // Test the connection
    const { data, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      console.error('Supabase connection error:', error);
      process.exit(1);
    }
    
    console.log('Supabase Connected');
    return supabaseClient;
  } catch (error) {
    console.error('Supabase connection error:', error);
    process.exit(1);
  }
};

const getDBClient = () => {
  if (dbType === 'mongodb') {
    return mongoConnection;
  } else if (dbType === 'supabase') {
    return supabaseClient;
  }
};

module.exports = { connectDB, getDBClient, supabaseClient };
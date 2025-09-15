const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 URI Status:', process.env.MONGODB_URI ? 'URI provided' : '❌ No URI found');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔍 Check your MONGODB_URI environment variable');
    process.exit(1);
  }
};

module.exports = connectDB;
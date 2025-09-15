const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    const mongoUri = process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'ai_chatbot_saas'}`;
    console.log('📍 Connecting to:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully!');
    
    // Test basic operations
    const { User, Chat, Message } = require('./models');
    
    console.log('🔄 Testing models...');
    
    // Test User model
    const userCount = await User.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    // Test Chat model
    const chatCount = await Chat.countDocuments();
    console.log(`💬 Chats in database: ${chatCount}`);
    
    // Test Message model
    const messageCount = await Message.countDocuments();
    console.log(`📝 Messages in database: ${messageCount}`);
    
    console.log('✅ All models working correctly!');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
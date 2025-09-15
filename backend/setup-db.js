const mongoose = require('mongoose');
require('dotenv').config();

async function setupDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'ai_chatbot_saas'}`;
    
    await mongoose.connect(mongoUri);
    
    console.log(`MongoDB connected successfully to: ${process.env.DB_NAME || 'ai_chatbot_saas'}`);
    
    // Create indexes for better performance
    const User = require('./models/User');
    const Chat = require('./models/Chat');
    const Message = require('./models/Message');
    
    await User.createIndexes();
    await Chat.createIndexes();
    await Message.createIndexes();
    
    console.log('Database indexes created successfully');
    
    await mongoose.disconnect();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
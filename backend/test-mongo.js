const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('URI preview:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'Not found');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  });
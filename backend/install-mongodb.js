const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Installing MongoDB dependencies...');

try {
  // Install mongoose
  console.log('📦 Installing Mongoose...');
  execSync('npm install mongoose@^8.0.3', { stdio: 'inherit' });
  
  // Remove MySQL dependencies
  console.log('🗑️ Removing MySQL dependencies...');
  try {
    execSync('npm uninstall mysql2 sequelize', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ MySQL dependencies may not have been installed');
  }
  
  // Update .env file if it exists
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    console.log('📝 Updating .env file...');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Add MongoDB URI if not present
    if (!envContent.includes('MONGODB_URI')) {
      envContent += '\n# MongoDB Database\nMONGODB_URI=mongodb://localhost:27017/ai_chatbot_saas\n';
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Added MONGODB_URI to .env file');
    }
  }
  
  console.log('✅ MongoDB migration setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure MongoDB is running on your system');
  console.log('2. Update your .env file with the correct MONGODB_URI');
  console.log('3. Run: npm run setup (to create indexes)');
  console.log('4. Run: npm run dev (to start the server)');
  
} catch (error) {
  console.error('❌ Error during MongoDB setup:', error.message);
  process.exit(1);
}
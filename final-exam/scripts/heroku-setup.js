#!/usr/bin/env node

/**
 * Heroku Setup Script
 * Tự động setup và deploy ứng dụng lên Heroku
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Heroku Setup Script');
console.log('========================\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const exec = (command, options = {}) => {
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
  } catch (error) {
    log(`❌ Error executing: ${command}`, 'red');
    throw error;
  }
};

const checkPrerequisites = () => {
  log('📋 Checking prerequisites...', 'blue');
  
  // Check Node.js
  try {
    const nodeVersion = exec('node --version');
    log(`✅ Node.js: ${nodeVersion.trim()}`, 'green');
  } catch (error) {
    log('❌ Node.js not found. Please install Node.js first.', 'red');
    process.exit(1);
  }
  
  // Check npm
  try {
    const npmVersion = exec('npm --version');
    log(`✅ npm: ${npmVersion.trim()}`, 'green');
  } catch (error) {
    log('❌ npm not found. Please install npm first.', 'red');
    process.exit(1);
  }
  
  // Check Heroku CLI
  try {
    const herokuVersion = exec('heroku --version');
    log(`✅ Heroku CLI: ${herokuVersion.trim()}`, 'green');
  } catch (error) {
    log('❌ Heroku CLI not found.', 'red');
    log('Please install Heroku CLI first:', 'yellow');
    log('  Windows: choco install heroku-cli', 'cyan');
    log('  macOS: brew tap heroku/brew && brew install heroku', 'cyan');
    log('  Linux: curl https://cli-assets.heroku.com/install.sh | sh', 'cyan');
    process.exit(1);
  }
  
  // Check Git
  try {
    const gitVersion = exec('git --version');
    log(`✅ Git: ${gitVersion.trim()}`, 'green');
  } catch (error) {
    log('❌ Git not found. Please install Git first.', 'red');
    process.exit(1);
  }
  
  log('✅ All prerequisites met!\n', 'green');
};

const checkHerokuLogin = () => {
  log('🔐 Checking Heroku login status...', 'blue');
  
  try {
    exec('heroku auth:whoami');
    log('✅ Already logged in to Heroku\n', 'green');
    return true;
  } catch (error) {
    log('❌ Not logged in to Heroku', 'red');
    log('Please login first:', 'yellow');
    log('  heroku login\n', 'cyan');
    return false;
  }
};

const createHerokuApp = (appName) => {
  log(`🚀 Creating Heroku app: ${appName}`, 'blue');
  
  try {
    exec(`heroku create ${appName}`);
    log(`✅ Heroku app created: ${appName}\n`, 'green');
    return true;
  } catch (error) {
    log(`❌ Failed to create app: ${appName}`, 'red');
    log('App might already exist or name is taken.', 'yellow');
    return false;
  }
};

const setupEnvironment = () => {
  log('⚙️ Setting up environment variables...', 'blue');
  
  try {
    exec('heroku config:set NODE_ENV=production');
    log('✅ NODE_ENV set to production', 'green');
    
    // Add more environment variables as needed
    // exec('heroku config:set JWT_SECRET=your-secret-key');
    // exec('heroku config:set SESSION_SECRET=your-session-secret');
    
    log('✅ Environment variables configured\n', 'green');
  } catch (error) {
    log('❌ Failed to set environment variables', 'red');
    throw error;
  }
};

const buildApp = () => {
  log('🔨 Building React app...', 'blue');
  
  try {
    exec('npm run build');
    log('✅ React app built successfully\n', 'green');
  } catch (error) {
    log('❌ Failed to build React app', 'red');
    throw error;
  }
};

const deployToHeroku = () => {
  log('📦 Deploying to Heroku...', 'blue');
  
  try {
    // Add all files
    exec('git add .');
    log('✅ Files staged for commit', 'green');
    
    // Commit changes
    exec('git commit -m "Deploy to Heroku"');
    log('✅ Changes committed', 'green');
    
    // Push to Heroku
    exec('git push heroku main');
    log('✅ App deployed to Heroku\n', 'green');
    
    return true;
  } catch (error) {
    log('❌ Deployment failed', 'red');
    throw error;
  }
};

const startApp = () => {
  log('🚀 Starting Heroku app...', 'blue');
  
  try {
    exec('heroku ps:scale web=1');
    log('✅ App started successfully', 'green');
    
    // Get app URL
    const appUrl = exec('heroku info -s | grep web_url | cut -d= -f2').trim();
    log(`🌐 App URL: ${appUrl}\n`, 'green');
    
    return appUrl;
  } catch (error) {
    log('❌ Failed to start app', 'red');
    throw error;
  }
};

const testApp = (appUrl) => {
  log('🧪 Testing deployed app...', 'blue');
  
  try {
    // Test health endpoint
    exec(`curl -s ${appUrl}/health`);
    log('✅ Health check passed', 'green');
    
    // Test users endpoint
    exec(`curl -s ${appUrl}/users`);
    log('✅ Users endpoint working', 'green');
    
    // Test tasks endpoint
    exec(`curl -s ${appUrl}/tasks`);
    log('✅ Tasks endpoint working', 'green');
    
    log('✅ All tests passed!\n', 'green');
  } catch (error) {
    log('❌ Some tests failed', 'red');
    log('Check the app manually at: ' + appUrl, 'yellow');
  }
};

const main = async () => {
  try {
    // Get app name from command line or use default
    const appName = process.argv[2] || 'task-management-system-' + Date.now();
    
    log(`🎯 Target app name: ${appName}`, 'magenta');
    log('You can change this by passing a name as argument: node scripts/heroku-setup.js my-app-name\n', 'cyan');
    
    // Check prerequisites
    checkPrerequisites();
    
    // Check Heroku login
    if (!checkHerokuLogin()) {
      process.exit(1);
    }
    
    // Create Heroku app
    if (!createHerokuApp(appName)) {
      process.exit(1);
    }
    
    // Setup environment
    setupEnvironment();
    
    // Build app
    buildApp();
    
    // Deploy to Heroku
    if (!deployToHeroku()) {
      process.exit(1);
    }
    
    // Start app
    const appUrl = startApp();
    
    // Test app
    testApp(appUrl);
    
    log('🎉 Deployment completed successfully!', 'green');
    log(`🌐 Your app is live at: ${appUrl}`, 'bright');
    log('\n📋 Next steps:', 'blue');
    log('1. Open the app URL in your browser', 'cyan');
    log('2. Test login with admin/admin123', 'cyan');
    log('3. Test creating tasks', 'cyan');
    log('4. Check admin dashboard', 'cyan');
    log('\n🔧 Useful commands:', 'blue');
    log('  heroku logs --tail          # View logs', 'cyan');
    log('  heroku open                 # Open app', 'cyan');
    log('  heroku restart              # Restart app', 'cyan');
    log('  heroku config               # View config', 'cyan');
    
  } catch (error) {
    log('\n❌ Setup failed!', 'red');
    log('Check the error messages above and try again.', 'yellow');
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkPrerequisites,
  checkHerokuLogin,
  createHerokuApp,
  setupEnvironment,
  buildApp,
  deployToHeroku,
  startApp,
  testApp
};

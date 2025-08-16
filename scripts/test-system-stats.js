const fs = require('fs');
const path = require('path');

// Test system stats API
async function testSystemStats() {
  try {
    console.log('Testing system stats API...');
    
    // Check if system-stats.json exists
    const statsPath = path.join(__dirname, '../db/system-stats.json');
    if (fs.existsSync(statsPath)) {
      const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
      console.log('Current system stats:', stats);
    } else {
      console.log('system-stats.json not found');
    }
    
    // Test API endpoint
    const response = await fetch('http://localhost:3001/system-stats');
    if (response.ok) {
      const data = await response.json();
      console.log('API response:', data);
    } else {
      console.log('API error:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run test
testSystemStats();


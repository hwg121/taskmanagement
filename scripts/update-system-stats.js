const fs = require('fs');
const path = require('path');

// Function to get system stats (simulated for demo)
function getSystemStats() {
  // In a real application, you would use system monitoring libraries
  // like 'os-utils', 'systeminformation', or native Node.js modules
  
  // Generate more realistic and varied stats
  const cpuUsage = Math.floor(Math.random() * 50) + 15; // 15-65%
  const ramUsage = Math.floor(Math.random() * 60) + 20; // 20-80%
  const diskUsage = Math.floor(Math.random() * 40) + 40; // 40-80%
  const networkUsage = Math.floor(Math.random() * 80) + 5; // 5-85%

  return {
    cpuUsage,
    ramUsage,
    diskUsage,
    networkUsage,
    lastUpdated: new Date().toISOString()
  };
}

// Function to update system stats in db.json
function updateSystemStats() {
  const stats = getSystemStats();
  const dbPath = path.join(__dirname, '../db.json');
  
  try {
    // Read existing db.json
    let db = {};
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
    
    // Update system-stats
    db['system-stats'] = stats;
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log('System stats updated:', new Date().toISOString());
  } catch (error) {
    console.error('Error updating system stats:', error);
  }
}

// Update immediately
updateSystemStats();

// Update every 5 seconds
setInterval(updateSystemStats, 5000);

console.log('System stats updater started...');

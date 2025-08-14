const fs = require('fs');
const path = require('path');

// Force update system stats with fixed realistic values
function forceUpdateStats() {
  const dbPath = path.join(__dirname, '../db.json');
  
  const fixedStats = {
    cpuUsage: 47,
    ramUsage: 73,
    diskUsage: 68,
    networkUsage: 31,
    lastUpdated: new Date().toISOString()
  };
  
  try {
    // Read existing db.json
    let db = {};
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
    
    // Update system-stats
    db['system-stats'] = fixedStats;
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log('✅ System stats force updated to:', fixedStats);
    console.log('📊 CPU: 47%, RAM: 73%, Disk: 68%, Network: 31%');
  } catch (error) {
    console.error('❌ Error updating stats:', error);
  }
}

// Run force update
forceUpdateStats();

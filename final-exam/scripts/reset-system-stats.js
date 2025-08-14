const fs = require('fs');
const path = require('path');

// Reset system stats to realistic values
function resetSystemStats() {
  const statsPath = path.join(__dirname, '../db/system-stats.json');
  
  const realisticStats = {
    cpuUsage: Math.floor(Math.random() * 40) + 20, // 20-60%
    ramUsage: Math.floor(Math.random() * 50) + 30, // 30-80%
    diskUsage: Math.floor(Math.random() * 30) + 50, // 50-80%
    networkUsage: Math.floor(Math.random() * 60) + 10, // 10-70%
    lastUpdated: new Date().toISOString()
  };
  
  try {
    fs.writeFileSync(statsPath, JSON.stringify(realisticStats, null, 2));
    console.log('System stats reset to:', realisticStats);
  } catch (error) {
    console.error('Error resetting stats:', error);
  }
}

// Run reset
resetSystemStats();


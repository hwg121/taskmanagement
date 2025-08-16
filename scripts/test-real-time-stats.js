const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function testRealTimeStats() {
  console.log('🧪 Testing Real-time System Stats...\n');
  
  try {
    // Test health endpoint
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('📊 Database status:', healthResponse.data.database);
    console.log('');
    
    // Test system stats multiple times to see real-time updates
    console.log('2️⃣ Testing real-time system stats updates...');
    
    for (let i = 1; i <= 5; i++) {
      const statsResponse = await axios.get(`${BASE_URL}/system-stats`);
      const stats = statsResponse.data;
      
      console.log(`📊 Update #${i} at ${new Date().toLocaleTimeString('vi-VN')}:`);
      console.log(`   CPU: ${stats.cpuUsage}% | RAM: ${stats.ramUsage}% | Disk: ${stats.diskUsage}% | Network: ${stats.networkUsage}%`);
      console.log(`   Last Updated: ${stats.lastUpdated}`);
      
      if (i < 5) {
        console.log('   ⏳ Waiting 3 seconds for next update...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    console.log('✅ Real-time stats test completed successfully!');
    console.log('🎯 Dashboard should now show live updates every 2-3 seconds');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testRealTimeStats();

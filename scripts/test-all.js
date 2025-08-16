const fs = require('fs');
const path = require('path');

// Test all system components
async function testAll() {
  console.log('🧪 Testing all system components...\n');
  
  try {
    // 1. Test system stats
    console.log('1️⃣ Testing System Stats...');
    const dbPath = path.join(__dirname, '../db.json');
    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (db['system-stats']) {
        console.log('   ✅ Current stats:', db['system-stats']);
      } else {
        console.log('   ❌ system-stats not found in db.json');
      }
    } else {
      console.log('   ❌ db.json not found');
    }
    
    // 2. Test activities
    console.log('\n2️⃣ Testing Activities...');
    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (db.activities) {
        console.log(`   ✅ Found ${db.activities.length} activities`);
        console.log('   📅 Latest activity:', db.activities[0]);
      } else {
        console.log('   ❌ activities not found in db.json');
      }
    } else {
      console.log('   ❌ db.json not found');
    }
    
    // 3. Test users
    console.log('\n3️⃣ Testing Users...');
    const usersPath = path.join(__dirname, '../db.json');
    if (fs.existsSync(usersPath)) {
      const db = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      console.log(`   ✅ Found ${db.users.length} users`);
      db.users.forEach(user => {
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
        const now = new Date();
        const timeDiff = lastLogin ? (now - lastLogin) / (1000 * 60) : null;
        console.log(`   👤 ${user.username}: lastLogin=${user.lastLogin}, timeDiff=${timeDiff ? Math.round(timeDiff) : 'N/A'} minutes`);
      });
    } else {
      console.log('   ❌ db.json not found');
    }
    
    // 4. Test API endpoints
    console.log('\n4️⃣ Testing API Endpoints...');
    try {
      const response = await fetch('http://localhost:3001/system-stats');
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ /system-stats API working:', data);
      } else {
        console.log('   ❌ /system-stats API error:', response.status);
      }
    } catch (error) {
      console.log('   ❌ /system-stats API failed:', error.message);
    }
    
    console.log('\n🎯 Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test
testAll();

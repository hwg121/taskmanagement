const fs = require('fs');
const path = require('path');

// Test all API endpoints
async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');
  
  const baseURL = 'http://localhost:3001';
  
  try {
    // Test system-stats endpoint
    console.log('1️⃣ Testing /system-stats...');
    try {
      const response = await fetch(`${baseURL}/system-stats`);
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ /system-stats working:', data);
      } else {
        console.log('   ❌ /system-stats error:', response.status, response.statusText);
      }
    } catch (error) {
      console.log('   ❌ /system-stats failed:', error.message);
    }
    
    // Test users endpoint
    console.log('\n2️⃣ Testing /users...');
    try {
      const response = await fetch(`${baseURL}/users`);
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ /users working: ${data.length} users found`);
        data.forEach(user => {
          const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
          const now = new Date();
          const timeDiff = lastLogin ? (now - lastLogin) / (1000 * 60) : null;
          console.log(`   👤 ${user.username}: ${timeDiff ? Math.round(timeDiff) : 'N/A'} minutes ago`);
        });
      } else {
        console.log('   ❌ /users error:', response.status, response.statusText);
      }
    } catch (error) {
      console.log('   ❌ /users failed:', error.message);
    }
    
    // Test activities endpoint
    console.log('\n3️⃣ Testing /activities...');
    try {
      const response = await fetch(`${baseURL}/activities`);
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ /activities working: ${data.length} activities found`);
        console.log('   📅 Latest:', data[0]);
      } else {
        console.log('   ❌ /activities error:', response.status, response.statusText);
      }
    } catch (error) {
      console.log('   ❌ /activities failed:', error.message);
    }
    
    console.log('\n🎯 API test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test
testAPI();


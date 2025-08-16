const https = require('https');

const HEROKU_URL = 'https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com';

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'task-management-backend-2025-ebb92e46bb7f.herokuapp.com',
      port: 443,
      path: path,
      method: 'GET',
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testHerokuBackend() {
  console.log('🧪 Testing Heroku Backend...\n');
  
  try {
    // Test health endpoint
    console.log('1️⃣ Testing /health endpoint...');
    const health = await testEndpoint('/health');
    console.log('✅ Health endpoint:', health.status);
    console.log('📊 Response:', JSON.stringify(health.data, null, 2));
    console.log('');
    
    // Test system-stats endpoint
    console.log('2️⃣ Testing /system-stats endpoint...');
    const stats = await testEndpoint('/system-stats');
    console.log('✅ System stats endpoint:', stats.status);
    console.log('📊 Response:', JSON.stringify(stats.data, null, 2));
    console.log('');
    
    // Test root endpoint
    console.log('3️⃣ Testing / endpoint...');
    const root = await testEndpoint('/');
    console.log('✅ Root endpoint:', root.status);
    console.log('📊 Response:', JSON.stringify(root.data, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHerokuBackend();

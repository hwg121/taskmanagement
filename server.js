const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com', 'https://taskmanagement-three-gamma.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database file paths - use tmp directory on Heroku for writable files
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/db.json' 
  : path.join(__dirname, 'db.json');
const activitiesPath = process.env.NODE_ENV === 'production'
  ? '/tmp/activities.json'
  : path.join(__dirname, 'db', 'activities.json');
const systemStatsPath = process.env.NODE_ENV === 'production'
  ? '/tmp/system-stats.json'
  : path.join(__dirname, 'db', 'system-stats.json');

// Ensure database files exist
const ensureDbFiles = () => {
  const defaultDb = {
    users: [
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ip: "127.0.0.1"
      },
      {
        id: 2,
        username: "user1",
        email: "user1@example.com",
        password: "user123",
        role: "user",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ip: "127.0.0.1"
      }
    ],
    tasks: [
      {
        id: 1,
        title: "Chao mung den voi Task Manager",
        description: "Day la task mau dau tien cua ban",
        priority: "medium",
        status: "todo",
        category: "work",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        userId: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  };

  const defaultActivities = [
    {
      username: "admin",
      action: "Khoi tao he thong",
      type: "system"
    }
  ];

  const defaultSystemStats = {
    cpuUsage: 25,
    ramUsage: 45,
    diskUsage: 30,
    networkUsage: 15,
    lastUpdated: new Date().toISOString()
  };

  // Create main database if not exists
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
    console.log('Created default database');
  }

  // Create activities database if not exists
  if (!fs.existsSync(activitiesPath)) {
    if (process.env.NODE_ENV === 'production') {
      // On Heroku, just create the file directly in /tmp
      fs.writeFileSync(activitiesPath, JSON.stringify(defaultActivities, null, 2));
    } else {
      // On local, create directory structure
      const dbDir = path.dirname(activitiesPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(activitiesPath, JSON.stringify(defaultActivities, null, 2));
    }
    console.log('Created activities database');
  }

  // Create system stats database if not exists
  if (!fs.existsSync(systemStatsPath)) {
    if (process.env.NODE_ENV === 'production') {
      // On Heroku, just create the file directly in /tmp
      fs.writeFileSync(systemStatsPath, JSON.stringify(defaultSystemStats, null, 2));
    } else {
      // On local, create directory structure
      const dbDir = path.dirname(systemStatsPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      fs.writeFileSync(systemStatsPath, JSON.stringify(defaultSystemStats, null, 2));
    }
    console.log('Created system stats database');
  }
};

// Initialize database files
ensureDbFiles();

// Real-time system stats simulation
let currentSystemStats = {
  cpuUsage: 25,
  ramUsage: 45,
  diskUsage: 30,
  networkUsage: 15,
  lastUpdated: new Date().toISOString()
};

// Function to generate realistic system stats
const generateSystemStats = () => {
  const now = new Date();
  const timeOfDay = now.getHours();
  
  // Simulate realistic usage patterns based on time of day
  let baseCpu = 20;
  let baseRam = 40;
  let baseDisk = 30;
  let baseNetwork = 15;
  
  // Higher usage during work hours (9 AM - 6 PM)
  if (timeOfDay >= 9 && timeOfDay <= 18) {
    baseCpu = 35;
    baseRam = 55;
    baseNetwork = 25;
  }
  
  // Add some randomness and gradual changes
  const cpuVariation = Math.random() * 20 - 10; // -10 to +10
  const ramVariation = Math.random() * 15 - 7;  // -7 to +8
  const diskVariation = Math.random() * 10 - 5; // -5 to +5
  const networkVariation = Math.random() * 15 - 7; // -7 to +8
  
  // Ensure values stay within realistic bounds
  const newStats = {
    cpuUsage: Math.max(15, Math.min(85, Math.round(baseCpu + cpuVariation))),
    ramUsage: Math.max(25, Math.min(90, Math.round(baseRam + ramVariation))),
    diskUsage: Math.max(25, Math.min(85, Math.round(baseDisk + diskVariation))),
    networkUsage: Math.max(5, Math.min(80, Math.round(baseNetwork + networkVariation))),
    lastUpdated: now.toISOString()
  };
  
  // Gradually change from current values (smooth transitions)
  currentSystemStats = {
    cpuUsage: Math.round(currentSystemStats.cpuUsage * 0.7 + newStats.cpuUsage * 0.3),
    ramUsage: Math.round(currentSystemStats.ramUsage * 0.7 + newStats.ramUsage * 0.3),
    diskUsage: Math.round(currentSystemStats.diskUsage * 0.8 + newStats.diskUsage * 0.2),
    networkUsage: Math.round(currentSystemStats.networkUsage * 0.6 + newStats.networkUsage * 0.4),
    lastUpdated: now.toISOString()
  };
  
  return currentSystemStats;
};

// Update system stats every 2 seconds to match frontend polling
const updateSystemStatsInterval = setInterval(() => {
  const newStats = generateSystemStats();
  
  // Update the in-memory stats
  currentSystemStats = newStats;
  
  // Also update the file system (for persistence)
  if (process.env.NODE_ENV === 'production') {
    try {
      fs.writeFileSync(systemStatsPath, JSON.stringify(newStats, null, 2));
    } catch (error) {
      console.error('Error writing system stats to file:', error);
    }
  }
  
  console.log(`System stats updated: CPU: ${newStats.cpuUsage}%, RAM: ${newStats.ramUsage}%, Disk: ${newStats.diskUsage}%, Network: ${newStats.networkUsage}%`);
}, 2000);

// Helper function to read database
const readDb = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Helper function to write database
const writeDb = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// API Routes

// Health check endpoint
app.get('/health', (req, res) => {
  const dbExists = fs.existsSync(dbPath);
  const activitiesExists = fs.existsSync(activitiesPath);
  const statsExists = fs.existsSync(systemStatsPath);
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      main: dbExists,
      activities: activitiesExists,
      systemStats: statsExists
    },
    endpoints: [
      '/users',
      '/tasks',
      '/activities', 
      '/system-stats'
    ]
  });
});

// Users endpoints
app.get('/users', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  res.json(db.users || []);
});

app.get('/users/:id', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  
  const user = (db.users || []).find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  res.json(user);
});

app.post('/users', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  
  const newUser = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  
  db.users = db.users || [];
  db.users.push(newUser);
  
  if (writeDb(dbPath, db)) {
    res.status(201).json(newUser);
  } else {
    res.status(500).json({ error: 'Failed to save user' });
  }
});

app.patch('/users/:id', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  
  const userIndex = (db.users || []).findIndex(u => u.id == req.params.id);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  db.users[userIndex] = { ...db.users[userIndex], ...req.body, updatedAt: new Date().toISOString() };
  
  if (writeDb(dbPath, db)) {
    res.json(db.users[userIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/users/:id', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  
  const userIndex = (db.users || []).findIndex(u => u.id == req.params.id);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  const deletedUser = db.users[userIndex];
  db.users.splice(userIndex, 1);
  
  if (writeDb(dbPath, db)) {
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } else {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Tasks endpoints
app.get('/tasks', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  res.json(db.tasks || []);
});

app.get('/tasks/:id', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  
  const task = (db.tasks || []).find(t => t.id == req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  
  res.json(task);
});

app.post('/tasks', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  
  const newTask = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  db.tasks = db.tasks || [];
  db.tasks.push(newTask);
  
  if (writeDb(dbPath, db)) {
    res.status(201).json(newTask);
  } else {
    res.status(500).json({ error: 'Failed to save task' });
  }
});

app.patch('/tasks/:id', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  
  const taskIndex = (db.tasks || []).findIndex(t => t.id == req.params.id);
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });
  
  db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...req.body, updatedAt: new Date().toISOString() };
  
  if (writeDb(dbPath, db)) {
    res.json(db.tasks[taskIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const db = readDb(dbPath);
  if (!db) return res.status(500).json({ error: 'Database error' });
  
  const userIndex = (db.tasks || []).findIndex(t => t.id == req.params.id);
  if (userIndex === -1) return res.status(404).json({ error: 'Task not found' });
  
  const deletedTask = db.tasks[userIndex];
  db.tasks.splice(userIndex, 1);
  
  if (writeDb(dbPath, db)) {
    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } else {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Activities endpoints
app.get('/activities', (req, res) => {
  const activities = readDb(activitiesPath);
  if (!activities) return res.status(500).json({ error: 'Database error' });
  
  // Return activities with timestamp for proper sorting
  const safeActivities = (activities || []).map(activity => ({
    username: activity.username,
    action: activity.action,
    type: activity.type,
    timestamp: activity.timestamp
  }));
  
  res.json(safeActivities);
});

app.post('/activities', (req, res) => {
  const activities = readDb(activitiesPath) || [];
  
  const newActivity = {
    id: Date.now(),
    ...req.body,
    timestamp: new Date().toISOString()
  };
  
  activities.push(newActivity);
  
  if (writeDb(activitiesPath, activities)) {
    res.status(201).json({ 
      success: true, 
      message: 'Activity logged successfully' 
    });
  } else {
    res.status(500).json({ error: 'Failed to save activity' });
  }
});

// System stats endpoints
app.get('/system-stats', (req, res) => {
  // Return real-time stats from memory instead of file
  res.json(currentSystemStats || {});
});

app.post('/system-stats', (req, res) => {
  const stats = {
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  
  if (writeDb(systemStatsPath, stats)) {
    res.status(201).json(stats);
  } else {
    res.status(500).json({ error: 'Failed to save system stats' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // For now, just serve API endpoints without React build
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Task Management API is running!',
      endpoints: [
        '/users',
        '/tasks', 
        '/activities',
        '/system-stats'
      ]
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`System stats update interval: 2 seconds`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`Production mode enabled`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  clearInterval(updateSystemStatsInterval);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  clearInterval(updateSystemStatsInterval);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;

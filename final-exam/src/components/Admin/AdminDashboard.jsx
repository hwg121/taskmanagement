import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Key,
  Mail,
  UserPlus,
  Search
} from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 0,
    ramUsage: 0,
    diskUsage: 0,
    networkUsage: 0
  });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  // User management states
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [error, setError] = useState(null);

  // Fetch real system stats
  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/system-stats');
        if (response.ok) {
          const stats = await response.json();
          console.log('System stats received:', stats); // Debug log
          setSystemStats({
            cpuUsage: stats.cpuUsage || 0,
            ramUsage: stats.ramUsage || 0,
            diskUsage: stats.diskUsage || 0,
            networkUsage: stats.networkUsage || 0
          });
        } else {
          console.log('System stats response not ok:', response.status);
          throw new Error('Response not ok');
        }
      } catch (error) {
        console.error('Error fetching system stats:', error);
        // Không có dữ liệu ảo, chỉ hiển thị thông báo lỗi
        setSystemStats(null);
        setError('Không thể tải thống kê hệ thống. Vui lòng thử lại.');
      }
    };

    // Fetch immediately
    fetchSystemStats();
    
    // Update every 5 seconds
    const interval = setInterval(fetchSystemStats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch real online users data
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        if (response.ok) {
          const users = await response.json();
                     // Transform users data to include online status
           const usersWithStatus = users.map(user => {
             // Check if user is online (logged in within last 30 minutes)
             const lastLoginTime = user.lastLogin ? new Date(user.lastLogin) : null;
             const now = new Date();
             const timeDiff = lastLoginTime ? (now - lastLoginTime) / (1000 * 60) : null; // minutes
             
             let status = 'offline';
             if (timeDiff !== null) {
               if (timeDiff < 10) status = 'online';      // Online if logged in < 10 minutes ago
               else if (timeDiff < 60) status = 'idle';   // Idle if logged in < 1 hour ago
               else status = 'offline';                   // Offline if > 1 hour ago
             }
             
             console.log(`User ${user.username}: lastLogin=${user.lastLogin}, timeDiff=${timeDiff} minutes, status=${status}`);
             
             return {
               id: user.id,
               username: user.username,
               email: user.email,           // Thêm email
               password: user.password,     // Thêm password
               status: status,
               lastActivity: user.lastLogin ? formatTimeAgo(new Date(user.lastLogin)) : 'Chưa đăng nhập',
               ip: user.ip || 'N/A'
             };
           });
          setOnlineUsers(usersWithStatus);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
                          // Không có dữ liệu ảo, chỉ hiển thị thông báo lỗi
         setOnlineUsers([]);
         setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
      }
    };

    fetchOnlineUsers();
    // Refresh every 30 seconds
    const interval = setInterval(fetchOnlineUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real activity data
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('http://localhost:3001/activities');
        if (response.ok) {
          const activities = await response.json();
          // Transform activities data
          const transformedActivities = activities.map(activity => ({
            id: activity.id,
            user: activity.username,
            action: activity.action,
            time: formatTimeAgo(new Date(activity.timestamp)),
            type: activity.type
          }));
          setRecentActivity(transformedActivities);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Không có dữ liệu ảo, chỉ hiển thị thông báo lỗi
        setRecentActivity([]);
        setError('Không thể tải hoạt động gần đây. Vui lòng thử lại.');
      }
    };

    fetchActivity();
    // Refresh every 10 seconds
    const interval = setInterval(fetchActivity, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-400/10';
      case 'idle': return 'text-yellow-400 bg-yellow-400/10';
      case 'offline': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'update': return <Settings className="h-4 w-4 text-blue-400" />;
      case 'view': return <Eye className="h-4 w-4 text-purple-400" />;
      case 'login': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'logout': return <LogOut className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  const getUsageColor = (usage) => {
    if (usage < 50) return 'text-green-400';
    if (usage < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  // User management functions
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remove user from local state
        setOnlineUsers(prev => prev.filter(u => u.id !== userId));
        setShowDeleteConfirm(null);
        
        // Log activity
        await fetch('http://localhost:3001/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: Date.now(),
            username: 'admin',
            action: `Xóa user ID: ${userId}`,
            type: 'delete',
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        // Update user in local state
        setOnlineUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, ...updates } : u
        ));
        setEditingUser(null);
        
        // Log activity
        await fetch('http://localhost:3001/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: Date.now(),
            username: 'admin',
            action: `Cập nhật user: ${updates.username || 'N/A'}`,
            type: 'update',
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const filteredUsers = onlineUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Header */}
      <header className="relative bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-red-200 text-sm font-medium">Quản lý hệ thống</p>
                <p className="text-red-300 text-xs font-medium mt-1">Admin: {user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-red-200 text-sm font-medium">Xin chào,</p>
                <p className="text-white font-semibold text-lg">{user?.username}</p>
              </div>
              <button
                onClick={onLogout}
                className="px-6 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* CPU Usage */}
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 hover:border-blue-500/40 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-xl group-hover:from-blue-500/40 group-hover:to-indigo-500/40 transition-all duration-300">
                <Cpu className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs font-medium">CPU Usage</p>
                <p className={`text-2xl font-bold ${getUsageColor(systemStats.cpuUsage)}`}>
                  {systemStats.cpuUsage}%
                </p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  systemStats.cpuUsage < 50 ? 'bg-green-400' : 
                  systemStats.cpuUsage < 80 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${systemStats.cpuUsage}%` }}
              ></div>
            </div>
          </div>

          {/* RAM Usage */}
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 hover:border-green-500/40 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl group-hover:from-green-500/40 group-hover:to-emerald-500/40 transition-all duration-300">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-green-200 text-xs font-medium">RAM Usage</p>
                <p className={`text-2xl font-bold ${getUsageColor(systemStats.ramUsage)}`}>
                  {systemStats.ramUsage}%
                </p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  systemStats.ramUsage < 50 ? 'bg-green-400' : 
                  systemStats.ramUsage < 80 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${systemStats.ramUsage}%` }}
              ></div>
            </div>
          </div>

          {/* Disk Usage */}
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 hover:border-purple-500/40 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl group-hover:from-purple-500/40 group-hover:to-pink-500/40 transition-all duration-300">
                <HardDrive className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-right">
                <p className="text-purple-200 text-xs font-medium">Disk Usage</p>
                <p className={`text-2xl font-bold ${getUsageColor(systemStats.diskUsage)}`}>
                  {systemStats.diskUsage}%
                </p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  systemStats.diskUsage < 50 ? 'bg-green-400' : 
                  systemStats.diskUsage < 80 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${systemStats.diskUsage}%` }}
              ></div>
            </div>
          </div>

          {/* Network Usage */}
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 hover:border-cyan-500/40 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl group-hover:from-cyan-500/40 group-hover:to-blue-500/40 transition-all duration-300">
                <Wifi className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-right">
                <p className="text-cyan-200 text-xs font-medium">Network</p>
                <p className={`text-2xl font-bold ${getUsageColor(systemStats.networkUsage)}`}>
                  {systemStats.networkUsage}%
                </p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  systemStats.networkUsage < 50 ? 'bg-green-400' : 
                  systemStats.networkUsage < 80 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${systemStats.networkUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="lg:col-span-3 mb-8 bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
              <p className="text-red-200 text-lg font-medium">{error}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setError(null)}
                className="px-6 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-200 rounded-xl font-medium transition-all duration-300 border border-red-500/30"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Online Users */}
           <div className="lg:col-span-1">
             <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 shadow-lg">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-white flex items-center">
                   <Users className="h-6 w-6 mr-3 text-blue-400" />
                   Người dùng online
                 </h2>
                 <div className="flex items-center space-x-2">
                   <button
                     onClick={() => setShowUserManagement(!showUserManagement)}
                     className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all duration-300"
                     title="Quản lý user"
                   >
                     <Settings className="h-4 w-4" />
                   </button>
                   <button
                     onClick={() => setShowSensitiveData(!showSensitiveData)}
                     className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all duration-300"
                   >
                     {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                   <span className="px-3 py-1 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 text-blue-300 text-sm rounded-full border border-blue-500/30">
                     {onlineUsers.filter(u => u.status === 'online').length} online
                   </span>
                 </div>
               </div>

                             <div className="space-y-3 max-h-96 overflow-y-auto">
                 {filteredUsers.map((user) => (
                   <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                     <div className="flex items-center space-x-3">
                       <div className={`w-3 h-3 rounded-full ${
                         user.status === 'online' ? 'bg-green-400 animate-pulse' :
                         user.status === 'idle' ? 'bg-yellow-400' : 'bg-gray-400'
                       }`}></div>
                       <div>
                         <p className="text-white font-medium">{user.username}</p>
                         <p className="text-white/60 text-xs">{user.lastActivity}</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       {showSensitiveData && (
                         <div className="text-right mr-2">
                           <p className="text-white/80 text-xs font-mono">{user.ip}</p>
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                             {user.status}
                           </span>
                         </div>
                       )}
                       {showUserManagement && (
                         <div className="flex items-center space-x-1">
                           <button
                             onClick={() => setEditingUser(user)}
                             className="p-1.5 hover:bg-blue-500/20 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-300"
                             title="Sửa user"
                           >
                             <Edit3 className="h-3.5 w-3.5" />
                           </button>
                           <button
                             onClick={() => setShowDeleteConfirm(user.id)}
                             className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300"
                             title="Xóa user"
                           >
                             <Trash2 className="h-3.5 w-3.5" />
                           </button>
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
               
               {/* Search Bar */}
               {showUserManagement && (
                 <div className="mt-4">
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                     <input
                       type="text"
                       placeholder="Tìm kiếm user..."
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                     />
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3 text-green-400" />
                  Hoạt động gần đây
                </h2>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-white/60" />
                  <span className="text-white/60 text-sm">Cập nhật real-time</span>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.user}</p>
                      <p className="text-white/70 text-sm">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="mt-8">
          <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-yellow-400" />
                Cảnh báo hệ thống
              </h2>
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-300 text-sm rounded-full border border-yellow-500/30">
                2 cảnh báo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">RAM Usage cao</p>
                    <p className="text-white/70 text-sm">RAM usage đang ở mức {systemStats.ramUsage}%</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-white font-medium">Disk space thấp</p>
                    <p className="text-white/70 text-sm">Disk usage đang ở mức {systemStats.diskUsage}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
                 </div>
       </div>

       {/* Edit User Modal */}
       {editingUser && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
           <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-md mx-4">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-white flex items-center">
                 <Edit3 className="h-5 w-5 mr-2 text-blue-400" />
                 Chỉnh sửa User
               </h3>
               <button
                 onClick={() => setEditingUser(null)}
                 className="text-white/60 hover:text-white transition-colors"
               >
                 ✕
               </button>
             </div>
             
             <form onSubmit={(e) => {
               e.preventDefault();
               const formData = new FormData(e.target);
               handleUpdateUser(editingUser.id, {
                 username: formData.get('username'),
                 email: formData.get('email'),
                 password: formData.get('password') || undefined
               });
             }}>
               <div className="space-y-4">
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">
                     Username
                   </label>
                   <input
                     type="text"
                     name="username"
                     defaultValue={editingUser.username}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                     required
                   />
                 </div>
                 
                 <div>
                   <label className="block text-white/80 text-sm font-medium mb-2">
                     Email
                   </label>
                   <input
                     type="email"
                     name="email"
                     defaultValue={editingUser.email}
                     className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                     required
                   />
                 </div>
                 
                                   <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Password hiện tại
                    </label>
                    <input
                      type="text"
                      value={editingUser.password || 'N/A'}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Password mới (để trống nếu không đổi)
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                    />
                  </div>
               </div>
               
               <div className="flex space-x-3 mt-6">
                 <button
                   type="button"
                   onClick={() => setEditingUser(null)}
                   className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                 >
                   Hủy
                 </button>
                 <button
                   type="submit"
                   className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-medium transition-all duration-300"
                 >
                   Cập nhật
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}

       {/* Delete Confirmation Modal */}
       {showDeleteConfirm && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
           <div className="bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 rounded-2xl border border-red-500/20 p-6 w-full max-w-md mx-4">
             <div className="flex items-center justify-center mb-6">
               <div className="p-3 bg-red-500/20 rounded-full">
                 <Trash2 className="h-8 w-8 text-red-400" />
               </div>
             </div>
             
             <h3 className="text-xl font-bold text-white text-center mb-2">
               Xác nhận xóa User
             </h3>
             <p className="text-white/70 text-center mb-6">
               Bạn có chắc chắn muốn xóa user này? Hành động này không thể hoàn tác.
             </p>
             
             <div className="flex space-x-3">
               <button
                 onClick={() => setShowDeleteConfirm(null)}
                 className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
               >
                 Hủy
               </button>
               <button
                 onClick={() => handleDeleteUser(showDeleteConfirm)}
                 className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300"
               >
                 Xóa
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default AdminDashboard;

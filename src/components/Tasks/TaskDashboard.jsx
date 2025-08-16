import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit3, 
  AlertCircle,
  CheckCircle,
  Target,
  TrendingUp,
  Flag,
  Calendar,
  BarChart3,
  Filter,
  Key,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import CalendarComponent from '../UI/Calendar';
import CircularChart from '../UI/CircularChart';
import SkeletonLoading from '../UI/SkeletonLoading';
import PullToRefreshIndicator from '../UI/PullToRefreshIndicator';
import apiService from '../../services/api';
import useDebounce from '../../hooks/useDebounce';
import usePullToRefresh from '../../hooks/usePullToRefresh';

// Sử dụng apiService thay vì fetchWithTimeout

const TaskDashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Sorting states
  const [sortField, setSortField] = useState('dueDate'); // title, priority, status, dueDate, category
  const [sortDirection, setSortDirection] = useState('asc'); // asc, desc
  const [editingTask, setEditingTask] = useState(null);
  
  // Pull to refresh - will be defined after loadTasks
  const [pullToRefreshCallback, setPullToRefreshCallback] = useState(null);
  
  // Debounced search - delay 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo',
    category: 'work'
  });

  // Change password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update form when editing task
  useEffect(() => {
    if (editingTask) {
      setNewTask({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
        status: editingTask.status,
        category: editingTask.category
      });
    } else {
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        status: 'todo',
        category: 'work'
      });
    }
  }, [editingTask]);

  // Load tasks from JSON server
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const tasksData = await apiService.getTasks(user.id);
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err.message || 'Không thể tải danh sách task. Vui lòng thử lại.');
      setTasks([]); // Không có task nào thay vì mock data
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  
  // Set up pull to refresh callback after loadTasks is defined
  useEffect(() => {
    setPullToRefreshCallback(() => loadTasks);
  }, [loadTasks]);
  
  // Initialize pull to refresh
  const { isRefreshing, pullProgress } = usePullToRefresh(pullToRefreshCallback || (() => Promise.resolve()));

  // Create new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    // Validation: Check required fields
    if (!newTask.title.trim()) {
      setError('Tiêu đề task không được để trống.');
      return;
    }
    
    if (!newTask.description.trim()) {
      setError('Mô tả task không được để trống.');
      return;
    }
    
    // Validation: Check if due date is from today onwards
    if (newTask.dueDate) {
      const selectedDate = new Date(newTask.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      if (selectedDate < today) {
        setError('Ngày hết hạn phải từ hôm nay trở đi.');
        return;
      }
    }
    
    try {
      if (editingTask) {
        // Update existing task - đảm bảo chỉ update task của user hiện tại
        if (editingTask.userId !== user.id) {
          setError('Bạn không có quyền chỉnh sửa task này.');
          return;
        }

        const updatedTaskData = {
          ...editingTask,
          ...newTask,
          userId: user.id, // Đảm bảo userId không bị thay đổi
          updatedAt: new Date().toISOString()
        };

        // Update task using API service
        try {
          const savedTask = await apiService.updateTask(editingTask.id, newTask, user.id);
          setTasks(prev => prev.map(t => t.id === editingTask.id ? savedTask : t));
        } catch (serverError) {
          console.error('Error updating task:', serverError);
          setError(serverError.message || 'Không thể cập nhật task. Vui lòng thử lại.');
          return;
        }

        setEditingTask(null);
      } else {
        // Create new task - đảm bảo gán đúng userId
        const taskData = {
          ...newTask,
          userId: user.id, // Gán userId cho task mới
          id: Date.now(), // Simple ID generation for demo
          createdAt: new Date().toISOString()
        };

        // Create task using API service
        try {
          const savedTask = await apiService.createTask(newTask, user.id);
          setTasks(prev => [savedTask, ...prev]);
        } catch (serverError) {
          console.error('Error creating task:', serverError);
          setError(serverError.message || 'Không thể tạo task mới. Vui lòng thử lại.');
          return;
        }
      }

      setError(null);
      setSuccess(editingTask ? 'Cập nhật task thành công!' : 'Tạo task mới thành công!');
      
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        status: 'todo',
        category: 'work'
      });
      
      // Auto-hide success message and close modal after 2 seconds
      setTimeout(() => {
        setSuccess(null);
        setShowCreateModal(false);
        setEditingTask(null);
      }, 2000);
    } catch (err) {
      console.error('Error creating/updating task:', err);
      setError(editingTask ? 'Không thể cập nhật task. Vui lòng thử lại.' : 'Không thể tạo task mới. Vui lòng thử lại.');
    }
  };

  // Update task status
  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      // Đảm bảo chỉ update task của user hiện tại
      if (!task || task.userId !== user.id) {
        setError('Bạn không có quyền thay đổi task này.');
        return;
      }

      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      
      // Update local state immediately
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      ));

              // Update task status using API service
        try {
          await apiService.updateTask(taskId, { status: newStatus }, user.id);
          setSuccess(`Task đã được ${newStatus === 'completed' ? 'hoàn thành' : 'chuyển về todo'}!`);
          setTimeout(() => setSuccess(null), 2000);
        } catch (serverError) {
          console.error('Error updating task status:', serverError);
          // Revert local state if server update fails
          setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, status: task.status } : t
          ));
          setError(serverError.message || 'Không thể cập nhật trạng thái task. Vui lòng thử lại.');
        }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      // Đảm bảo chỉ delete task của user hiện tại
      if (!task || task.userId !== user.id) {
        setError('Bạn không có quyền xóa task này.');
        return;
      }

      // Update local state immediately
      setTasks(prev => prev.filter(t => t.id !== taskId));

              // Delete task using API service
        try {
          await apiService.deleteTask(taskId, user.id);
          setSuccess('Task đã được xóa thành công!');
          setTimeout(() => setSuccess(null), 2000);
        } catch (serverError) {
          console.error('Error deleting task:', serverError);
          // Revert local state if server delete fails
          setTasks(prev => [...prev, task]);
          setError(serverError.message || 'Không thể xóa task. Vui lòng thử lại.');
        }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Filter and sort tasks - chỉ lọc task của user hiện tại
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      // Đảm bảo chỉ hiển thị task của user hiện tại
      if (task.userId !== user.id) {
        return false;
      }
      
      const matchesSearch = debouncedSearchTerm ? (
        task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ) : true;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'status':
          const statusOrder = { 'todo': 1, 'in-progress': 2, 'completed': 3 };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate || '9999-12-31');
          bValue = new Date(b.dueDate || '9999-12-31');
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          aValue = new Date(a.dueDate || '9999-12-31');
          bValue = new Date(b.dueDate || '9999-12-31');
      }
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [tasks, user.id, debouncedSearchTerm, filterStatus, filterPriority, sortField, sortDirection]);

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    overdue: tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      return dueDate < today && t.status !== 'completed';
    }).length
  };

  // Get dynamic title based on current filter
  const getTaskListTitle = () => {
    // Filter by priority
    if (filterPriority !== 'all') {
      if (filterPriority === 'high') {
        return `Hiện đang có ${filteredTasks.length} task độ ưu tiên cao`;
      } else if (filterPriority === 'medium') {
        return `Hiện đang có ${filteredTasks.length} task độ ưu tiên trung bình`;
      } else if (filterPriority === 'low') {
        return `Hiện đang có ${filteredTasks.length} task độ ưu tiên thấp`;
      }
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'todo') {
        return `Hiện đang có ${filteredTasks.length} task chưa làm`;
      } else if (filterStatus === 'in-progress') {
        return `Hiện đang có ${filteredTasks.length} task đang làm`;
      } else if (filterStatus === 'completed') {
        return `Hiện đang có ${filteredTasks.length} task đã hoàn thành`;
      }
    }
    
    // Default title
    return 'Danh sách công việc';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'todo': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Kiểm tra quyền truy cập task
  const canAccessTask = (task) => {
    return task && task.userId === user.id;
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    try {
      // Đổi mật khẩu sử dụng API service
      await apiService.changePassword(user.id, passwordForm.currentPassword, passwordForm.newPassword, passwordForm.confirmPassword);

      // Reset form and close modal
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError(null);
      setSuccess('Đổi mật khẩu thành công!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setShowChangePasswordModal(false);
      }, 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');
    }
  };

     if (loading) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
         {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden">
           <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
         </div>
         
         <div className="text-center relative z-10">
           <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-400/30 border-t-blue-400 mx-auto mb-6 shadow-2xl"></div>
           <p className="text-blue-200 text-xl font-medium">Đang tải dashboard...</p>
         </div>
       </div>
     );
   }

       return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Pull to Refresh Indicator */}
      <PullToRefreshIndicator 
        pullProgress={pullProgress}
        isRefreshing={isRefreshing}
        threshold={80}
      />
       {/* Animated Background Elements */}
       <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
       </div>
       
       {/* Header */}
       <header className="relative bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border-b border-white/20 shadow-2xl">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
           <div className="flex justify-between items-center">
             <div className="flex items-center space-x-4">
               <div className="p-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                 <CheckSquare className="h-8 w-8 text-white" />
               </div>
                               <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Task Manager
                  </h1>
                  <p className="text-blue-200 text-sm font-medium">Quản lý công việc hiệu quả</p>
                  <p className="text-blue-300 text-xs font-medium mt-1">User ID: {user.id}</p>
                </div>
             </div>
             <div className="flex items-center space-x-6">
               <div className="text-right">
                 <p className="text-blue-200 text-sm font-medium">Xin chào,</p>
                 <p className="text-white font-semibold text-lg">{user?.username}</p>
               </div>
               <button
                 onClick={() => setShowChangePasswordModal(true)}
                 className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
               >
                 Đổi mật khẩu
               </button>
               <button
                 onClick={onLogout}
                 className="px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
               >
                 Đăng xuất
               </button>
             </div>
           </div>
         </div>
       </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                 {/* Error Display - Only show critical errors that need user action */}
         {error && error.includes('quyền') && (
           <div className="mb-8 bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-6 shadow-2xl">
             <div className="flex items-center">
               <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
               <p className="text-red-200 text-lg font-medium">{error}</p>
             </div>
             <div className="mt-4 flex justify-end">
               <button
                 onClick={() => {
                   setError(null);
                   loadTasks();
                 }}
                 className="px-4 sm:px-6 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-200 rounded-xl font-medium transition-all duration-300 border border-red-500/30"
               >
                 Thử lại
               </button>
             </div>
           </div>
         )}

        {/* Main Layout - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
                     {/* Left Column - Summary & Controls */}
           <div className="lg:col-span-3 space-y-4 sm:space-y-6">
             {/* Summary Chart */}
             <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 shadow-lg">
               <h3 className="text-white font-semibold mb-4 flex items-center">
                 <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                 Tổng quan
               </h3>
               <div className="flex justify-center mb-6">
                 <CircularChart 
                   data={[
                     { value: stats.completed, color: '#10b981' },
                     { value: stats.inProgress, color: '#3b82f6' },
                     { value: stats.todo, color: '#6b7280' }
                   ]} 
                   size={120}
                 />
               </div>
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center">
                     <div className="w-3 h-3 bg-green-400 rounded-full mr-3 shadow-sm"></div>
                     <span className="text-white/80">Đã hoàn thành</span>
                   </div>
                   <span className="text-white font-semibold">{stats.completed}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center">
                     <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 shadow-sm"></div>
                     <span className="text-white/80">Đang thực hiện</span>
                   </div>
                   <span className="text-white font-semibold">{stats.inProgress}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center">
                     <div className="w-3 h-3 bg-gray-400 rounded-full mr-3 shadow-sm"></div>
                     <span className="text-white/80">Chưa bắt đầu</span>
                   </div>
                   <span className="text-white font-semibold">{stats.todo}</span>
                 </div>
               </div>
             </div>

                         {/* Search & Filter Section */}
             <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/20 shadow-lg">
               <h3 className="text-white font-semibold mb-4 flex items-center">
                 <Filter className="h-5 w-5 mr-2 text-blue-400" />
                 Tìm kiếm & Lọc
               </h3>
               
               <div className="space-y-4">
                 <div className="relative">
                   <input
                     type="text"
                     placeholder="Tìm kiếm task..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-12 pr-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                   />
                   <Search className="h-5 w-5 text-white/50 absolute left-4 top-3.5" />
                 </div>
                 
                 <select
                   value={filterStatus}
                   onChange={(e) => setFilterStatus(e.target.value)}
                   className="w-full pl-4 pr-8 py-3 bg-white/15 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                 >
                   <option value="all" className="bg-slate-800 text-white">Tất cả trạng thái</option>
                   <option value="todo" className="bg-slate-800 text-white">Chưa bắt đầu</option>
                   <option value="in-progress" className="bg-slate-800 text-white">Đang thực hiện</option>
                   <option value="completed" className="bg-slate-800 text-white">Đã hoàn thành</option>
                 </select>
                 
                 <select
                   value={filterPriority}
                   onChange={(e) => setFilterPriority(e.target.value)}
                   className="w-full pl-4 pr-8 py-3 bg-white/15 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                 >
                   <option value="all" className="bg-slate-800 text-white">Tất cả độ ưu tiên</option>
                   <option value="high" className="bg-slate-800 text-white">Cao</option>
                   <option value="medium" className="bg-slate-800 text-white">Trung bình</option>
                   <option value="low" className="bg-slate-800 text-white">Thấp</option>
                 </select>
               </div>
             </div>
          </div>

          {/* Middle Column - Tasks List */}
          <div className="lg:col-span-6">
                         {/* Create Task Button */}
             <div className="mb-6 text-center">
               <button
                 onClick={() => setShowCreateModal(true)}
                 className="px-8 py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-2xl font-semibold text-lg flex items-center justify-center mx-auto transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 border border-white/20"
               >
                 <Plus className="h-6 w-6 mr-3" />
                 Tạo Task Mới
               </button>
             </div>

                         {/* Tasks List */}
             <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
               <div className="p-6 border-b border-white/20">
                                   <h2 className="text-xl font-bold text-white flex items-center">
                    <CheckSquare className="h-6 w-6 mr-3 text-blue-400" />
                    {getTaskListTitle()}
                    {filterStatus === 'all' && filterPriority === 'all' && (
                      <span className="ml-3 px-3 py-1 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 text-blue-300 text-sm rounded-full border border-blue-500/30">
                        {filteredTasks.length} tasks
                      </span>
                    )}
                  </h2>
                  <p className="text-white/60 text-sm mt-1">Hiển thị task của {user.username} (ID: {user.id})</p>
               </div>

                             {loading ? (
                <SkeletonLoading type="task" count={3} />
              ) : filteredTasks.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                    <Square className="h-10 w-10 text-white/50" />
                  </div>
                  <h3 className="text-xl font-medium text-white/70 mb-2">Không có task nào</h3>
                  <p className="text-white/50">Bắt đầu bằng cách tạo task mới</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                                     {filteredTasks.map(task => (
                     <div key={task.id} className="p-6 hover:bg-white/10 transition-all duration-300 group border-l-4 border-transparent hover:border-blue-500/30">
                       <div className="flex items-start justify-between">
                         <div className="flex items-start space-x-4 flex-1">
                           <button
                             onClick={() => handleToggleTask(task.id)}
                             className="mt-1 focus:outline-none transform hover:scale-110 transition-transform duration-200"
                           >
                             {task.status === 'completed' ? (
                               <CheckSquare className="h-6 w-6 text-green-400" />
                             ) : (
                               <Square className="h-6 w-6 text-white/50 group-hover:text-white/70 transition-colors" />
                             )}
                           </button>
                           
                           <div className="flex-1 min-w-0">
                             <h3 className={`text-lg font-semibold mb-2 ${
                               task.status === 'completed' ? 'line-through text-white/50' : 'text-white'
                             }`}>
                               {task.title}
                             </h3>
                             <p className="text-white/70 text-sm mb-3 leading-relaxed">{task.description}</p>
                             
                             <div className="flex items-center space-x-4 text-sm">
                               <div className="flex items-center space-x-2">
                                 <Clock className="h-4 w-4 text-blue-400" />
                                 <span className="text-white/80">Hạn: {new Date(task.dueDate).toLocaleDateString()}</span>
                               </div>
                               <div className="flex items-center space-x-2">
                                 <Calendar className="h-4 w-4 text-blue-400" />
                                 <span className="text-white/80">Tạo: {new Date(task.createdAt).toLocaleDateString()}</span>
                               </div>
                             </div>
                           </div>
                         </div>
                         
                         <div className="flex flex-col items-end space-y-3 ml-4">
                           <div className="flex items-center space-x-2">
                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                               {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung Bình' : 'Thấp'}
                             </span>
                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                               {task.status === 'completed' ? 'Hoàn thành' : task.status === 'in-progress' ? 'Đang làm' : 'Chưa làm'}
                             </span>
                           </div>
                           
                           <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <button
                               onClick={() => setEditingTask(task)}
                               className="p-2 bg-gradient-to-br from-white/15 to-white/10 hover:from-white/25 hover:to-white/15 rounded-lg text-white/70 hover:text-white transition-all duration-200 border border-white/20"
                             >
                               <Edit3 className="h-4 w-4" />
                             </button>
                             <button
                               onClick={() => handleDeleteTask(task.id)}
                               className="p-2 bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/30"
                             >
                               <Trash2 className="h-4 w-4" />
                             </button>
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </div>

                                           {/* Right Column - Calendar */}
            <div className="lg:col-span-3 space-y-6">
              {/* Calendar */}
              <CalendarComponent tasks={tasks} />
            </div>
        </div>
      </div>

             {/* Create/Edit Task Modal */}
       {(showCreateModal || editingTask) && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
           <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-white/20">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-white">
                 {editingTask ? 'Chỉnh sửa Task' : 'Tạo Task Mới'}
               </h2>
               <button
                 onClick={() => {
                   setShowCreateModal(false);
                   setEditingTask(null);
                 }}
                 className="p-2 hover:bg-white/15 rounded-lg text-white/60 hover:text-white transition-all duration-300 border border-white/20"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
            
            {/* Error Display - Inside Modal */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}
            
            {/* Success Display - Inside Modal */}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-green-200 text-sm">{success}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Tiêu đề
                  </label>
                                     <input
                     type="text"
                     value={newTask.title}
                     onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                     className="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                     placeholder="Nhập tiêu đề task..."
                     required
                   />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Danh mục
                  </label>
                                     <select
                     value={newTask.category}
                     onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                     className="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                   >
                    <option value="work" className="bg-slate-800 text-white">Công việc</option>
                    <option value="personal" className="bg-slate-800 text-white">Cá nhân</option>
                    <option value="shopping" className="bg-slate-800 text-white">Mua sắm</option>
                    <option value="health" className="bg-slate-800 text-white">Sức khỏe</option>
                    <option value="meeting" className="bg-slate-800 text-white">Họp</option>
                    <option value="other" className="bg-slate-800 text-white">Khác</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Mô tả
                </label>
                                 <textarea
                   value={newTask.description}
                   onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                   className="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                   rows={3}
                   placeholder="Mô tả chi tiết về task..."
                 />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Độ ưu tiên
                  </label>
                                     <select
                     value={newTask.priority}
                     onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                     className="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                   >
                    <option value="high" className="bg-slate-800 text-white">Cao</option>
                    <option value="medium" className="bg-slate-800 text-white">Trung bình</option>
                    <option value="low" className="bg-slate-800 text-white">Thấp</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Trạng thái
                  </label>
                                     <select
                     value={newTask.status}
                     onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                     className="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                   >
                    <option value="todo" className="bg-slate-800 text-white">Chưa bắt đầu</option>
                    <option value="in-progress" className="bg-slate-800 text-white">Đang thực hiện</option>
                    <option value="completed" className="bg-slate-800 text-white">Đã hoàn thành</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Ngày hết hạn
                  </label>
                                     <input
                     type="date"
                     value={newTask.dueDate}
                     onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                     className="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                     required
                   />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTask(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-br from-white/15 to-white/10 hover:from-white/25 hover:to-white/15 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
                >
                  {editingTask ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-2xl border border-white/20 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Key className="h-5 w-5 mr-2 text-blue-400" />
                Đổi mật khẩu
              </h3>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Error Display - Inside Modal */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}
            
            {/* Success Display - Inside Modal */}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-green-200 text-sm">{success}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-500/50 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
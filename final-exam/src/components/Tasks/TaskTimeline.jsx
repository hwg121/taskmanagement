import React, { useState, useMemo } from 'react';
import { Clock, Users, MoreVertical, Calendar, Plus } from 'lucide-react';

const TaskTimeline = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  // Chuyển đổi tasks thực tế thành timeline data
  const timelineData = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      // Trả về dữ liệu mẫu nếu không có task
      return [
        {
          id: 1,
          title: 'Research',
          time: '10:00 AM',
          duration: '45 min',
          participants: 3,
          color: 'from-purple-500 to-purple-600',
          borderColor: 'border-purple-400',
          bgColor: 'bg-purple-500/10',
          category: 'Research',
          description: 'Nghiên cứu thị trường và phân tích đối thủ cạnh tranh'
        },
        {
          id: 2,
          title: 'Landing Page',
          time: '11:00 AM',
          duration: '45 min',
          participants: 2,
          color: 'from-red-500 to-red-600',
          borderColor: 'border-red-400',
          bgColor: 'bg-red-500/10',
          category: 'Design',
          description: 'Thiết kế giao diện landing page cho sản phẩm mới'
        },
        {
          id: 3,
          title: 'Dashboard',
          time: '12:00 PM',
          duration: '45 min',
          participants: 4,
          color: 'from-blue-500 to-blue-600',
          borderColor: 'border-blue-400',
          bgColor: 'bg-blue-500/10',
          category: 'Development',
          description: 'Thiết kế dashboard quản lý với các biểu đồ và thống kê'
        },
        {
          id: 4,
          title: 'Design Theory',
          time: '1:00 PM',
          duration: '45 min',
          participants: 1,
          color: 'from-green-500 to-green-600',
          borderColor: 'border-green-400',
          bgColor: 'bg-green-500/10',
          category: 'Learning',
          description: 'Học về các nguyên tắc thiết kế và UX/UI best practices'
        }
      ];
    }

    // Lấy 4 task đầu tiên để hiển thị
    const displayTasks = tasks.slice(0, 4);
    
    // Màu sắc cho các category khác nhau
    const colorMap = {
      'work': { color: 'from-blue-500 to-blue-600', borderColor: 'border-blue-400' },
      'personal': { color: 'from-green-500 to-green-600', borderColor: 'border-green-400' },
      'shopping': { color: 'from-orange-500 to-orange-600', borderColor: 'border-orange-400' },
      'health': { color: 'from-red-500 to-red-600', borderColor: 'border-red-400' },
      'meeting': { color: 'from-purple-500 to-purple-600', borderColor: 'border-purple-400' },
      'documentation': { color: 'from-indigo-500 to-indigo-600', borderColor: 'border-indigo-400' },
      'other': { color: 'from-gray-500 to-gray-600', borderColor: 'border-gray-400' }
    };

    // Thời gian mẫu cho timeline
    const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM'];

    return displayTasks.map((task, index) => {
      const colors = colorMap[task.category] || colorMap['other'];
      const dueDate = new Date(task.dueDate);
      const timeString = dueDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

      return {
        id: task.id,
        title: task.title.length > 12 ? task.title.substring(0, 12) + '...' : task.title,
        time: timeString,
        duration: '45 min', // Có thể tính toán dựa trên priority hoặc category
        participants: Math.floor(Math.random() * 5) + 1, // Random cho demo
        color: colors.color,
        borderColor: colors.borderColor,
        bgColor: colors.borderColor.replace('border-', 'bg-').replace('-400', '-500/10'),
        category: task.category,
        description: task.description || 'Không có mô tả',
        originalTask: task
      };
    });
  }, [tasks]);

  // Tính toán category stats từ dữ liệu thực tế
  const categoryStats = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return [
        { category: 'work', count: 0, color: 'bg-blue-400' },
        { category: 'personal', count: 0, color: 'bg-green-400' },
        { category: 'meeting', count: 0, color: 'bg-purple-400' }
      ];
    }

    // Đếm số lượng task theo category
    const categoryCount = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    // Map màu sắc cho từng category
    const colorMap = {
      'work': 'bg-blue-400',
      'personal': 'bg-green-400',
      'shopping': 'bg-orange-400',
      'health': 'bg-red-400',
      'meeting': 'bg-purple-400',
      'documentation': 'bg-indigo-400',
      'other': 'bg-gray-400'
    };

    // Chuyển đổi thành array và sắp xếp theo số lượng
    return Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        color: colorMap[category] || colorMap['other']
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Chỉ hiển thị 3 category có nhiều task nhất
  }, [tasks]);

  // Lấy ngày hiện tại
  const currentDate = new Date();
  const options = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  const formattedDate = currentDate.toLocaleDateString('vi-VN', options);

  const handleTaskClick = (task) => {
    setSelectedTask(selectedTask?.id === task.id ? null : task);
  };

  // Hàm format category name
  const formatCategoryName = (category) => {
    const nameMap = {
      'work': 'Work',
      'personal': 'Personal',
      'shopping': 'Shopping',
      'health': 'Health',
      'meeting': 'Meeting',
      'documentation': 'Documentation',
      'other': 'Other'
    };
    return nameMap[category] || category;
  };

  return (
    <div className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-500/25 to-indigo-500/25 backdrop-blur-md rounded-lg border border-blue-400/30">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">Upcoming</h3>
            <p className="text-white/70 text-xs md:text-sm">{formattedDate}</p>
          </div>
        </div>
        <button className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all duration-300 group">
          <MoreVertical className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Time Labels */}
        <div className="flex justify-between mb-4 md:mb-6">
          {['10 AM', '11 AM', '12 PM', '1 PM'].map((time, index) => (
            <div key={index} className="text-center relative flex-1">
              <div className="text-white/80 text-xs md:text-sm font-medium mb-2">{time}</div>
              <div className="w-px h-8 md:h-12 bg-gradient-to-b from-white/30 to-white/10 mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 relative">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-r border-white/10 last:border-r-0"></div>
            ))}
          </div>

          {/* Task Cards */}
          {timelineData.map((task, index) => (
            <div key={task.id} className="relative z-10 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div 
                className={`
                  bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-3 shadow-lg border-l-4 ${task.borderColor}
                  hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer
                  group transform hover:-translate-y-1 min-h-[100px] md:min-h-[120px] flex flex-col
                  ${selectedTask?.id === task.id ? 'ring-2 ring-blue-400/50 scale-105' : ''}
                `}
                onClick={() => handleTaskClick(task)}
              >
                {/* Task Header */}
                <div className="flex items-start justify-between mb-1 md:mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-xs mb-1 group-hover:text-gray-900 transition-colors truncate">
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{task.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600 ml-1 md:ml-2 flex-shrink-0">
                    <Users className="h-3 w-3" />
                    <span>{task.participants.toString().padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Task Time */}
                <div className="text-xs text-gray-500 font-medium mt-auto">
                  {task.time}
                </div>

                {/* Hover Effect */}
                <div className={`
                  absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r ${task.color} opacity-0 
                  group-hover:opacity-10 transition-opacity duration-300 pointer-events-none
                `}></div>

                {/* Glow Effect */}
                <div className={`
                  absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r ${task.color} opacity-0 
                  group-hover:opacity-20 blur-xl transition-opacity duration-300 pointer-events-none
                `}></div>
              </div>

              {/* Task Details Popup */}
              {selectedTask?.id === task.id && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 shadow-xl border border-white/20 z-20 animate-fade-in">
                  <h5 className="font-semibold text-gray-800 text-sm mb-2">{task.originalTask?.title || task.title}</h5>
                  <p className="text-gray-600 text-xs mb-3">{task.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Category: {formatCategoryName(task.category)}</span>
                    <span>Priority: {task.originalTask?.priority || 'Medium'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>Status: {task.originalTask?.status || 'Todo'}</span>
                    <span>Due: {task.originalTask?.dueDate ? new Date(task.originalTask.dueDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Spacing */}
        <div className="h-4"></div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 text-xs md:text-sm">
          <div className="flex items-center space-x-2 md:space-x-4">
            {categoryStats.map((stat, index) => (
              <div key={stat.category} className="flex items-center space-x-1 md:space-x-2">
                <div 
                  className={`w-2 h-2 md:w-3 md:h-3 ${stat.color} rounded-full animate-pulse`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                ></div>
                <span className="text-white/70">{formatCategoryName(stat.category)}</span>
              </div>
            ))}
          </div>
          <div className="text-white/60 font-medium">
            {tasks?.length || 0} tasks total
          </div>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="mt-3 md:mt-4">
        <button className="w-full py-2.5 md:py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-500/30 text-blue-300 rounded-lg md:rounded-xl font-medium transition-all duration-300 hover:scale-105 group text-sm md:text-base">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Plus className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
            </div>
            <span>Add New Task</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TaskTimeline;

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Calendar = ({ tasks = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const getTasksForDate = (date) => {
    const dateStr = new Date(year, month, date).toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
    setSelectedDate(null);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'in-progress': return <AlertCircle className="h-3 w-3 text-yellow-400" />;
      default: return null;
    }
  };

  const handleDateClick = (date) => {
    const tasksForDate = getTasksForDate(date);
    if (tasksForDate.length > 0) {
      setSelectedDate(selectedDate === date ? null : date);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/10 p-4 shadow-lg">
      {/* Current Time */}
      <div className="text-center mb-4 p-3 backdrop-blur-xl bg-white/10 rounded-lg border border-white/20">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-4 w-4 text-white/70 mr-2" />
          <span className="text-white/70 text-sm">Thời gian hiện tại</span>
        </div>
        <div className="text-xl font-bold text-white mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-white/80">
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </button>
        
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 text-white/70 mr-2" />
          <h3 className="text-white font-semibold">
            {monthNames[month]} {year}
          </h3>
        </div>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-white/60 font-medium p-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 relative">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayWeekday }, (_, i) => (
          <div key={`empty-${i}`} className="h-12"></div>
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = i + 1;
          const isToday = today.getDate() === date && 
                         today.getMonth() === month && 
                         today.getFullYear() === year;
          const tasksForDate = getTasksForDate(date);
          const hasOverdueTasks = tasksForDate.some(task => 
            new Date(task.dueDate) < today && task.status !== 'completed'
          );
          const hasCompletedTasks = tasksForDate.some(task => task.status === 'completed');
          const hasInProgressTasks = tasksForDate.some(task => task.status === 'in-progress');
          const hasTodoTasks = tasksForDate.some(task => task.status === 'todo');
          
          return (
            <div key={date} className="relative">
              <div
                onClick={() => handleDateClick(date)}
                className={`
                  h-12 flex flex-col items-center justify-center text-xs relative rounded
                  ${isToday 
                    ? 'bg-white/30 text-white font-bold' 
                    : 'text-white/80 hover:bg-white/10'
                  }
                  ${tasksForDate.length > 0 ? 'cursor-pointer' : ''}
                  transition-colors
                `}
              >
                <span>{date}</span>
                
                {/* Task indicators */}
                {tasksForDate.length > 0 && (
                  <div className="flex items-center justify-center mt-1 space-x-0.5">
                    {hasOverdueTasks && (
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    )}
                    {hasInProgressTasks && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    )}
                    {hasCompletedTasks && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    )}
                    {/* Task todo */}
                    {hasTodoTasks && !hasOverdueTasks && !hasInProgressTasks && !hasCompletedTasks && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                )}
              </div>

              {/* Task details popup */}
              {selectedDate === date && tasksForDate.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-xl border border-white/20 z-20 min-w-[200px]">
                  <div className="text-xs text-gray-600 font-medium mb-2">
                    {new Date(year, month, date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {tasksForDate.map((task, index) => (
                      <div key={task.id} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getPriorityColor(task.priority)}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(task.status)}
                            <span className="text-xs font-medium text-gray-800 truncate">
                              {task.title}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Quá hạn</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Đang làm</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Hoàn thành</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Chưa làm</span>
            </div>
          </div>
          <div className="text-right">
            <span>{tasks.length} tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
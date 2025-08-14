import React from 'react';
import { 
  CheckSquare, 
  Square, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock 
} from 'lucide-react';

const TaskItem = ({ task, onToggleTask, onDeleteTask, onEditTask }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-100 bg-red-500/20 border-red-400/30';
      case 'medium': return 'text-orange-100 bg-orange-500/20 border-orange-400/30';
      case 'low': return 'text-green-100 bg-green-500/20 border-green-400/30';
      default: return 'text-white/80 bg-white/20 border-white/30';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'TB';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  return (
    <div className="p-8 hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 rounded-[1.5rem] mx-4 my-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onToggleTask(task.id)}
            className="focus:outline-none hover:scale-110 transition-transform duration-200 p-1"
          >
            {task.status === 'completed' ? (
              <div className="p-2 backdrop-blur-2xl bg-gradient-to-r from-green-500/25 to-emerald-500/25 border border-green-400/30 rounded-[1rem]">
                <CheckSquare className="h-7 w-7 text-green-200" />
              </div>
            ) : (
              <div className="p-2 backdrop-blur-2xl bg-white/15 border border-white/30 rounded-[1rem] hover:bg-white/25 transition-colors">
                <Square className="h-7 w-7 text-white/60" />
              </div>
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={`text-xl font-semibold mb-2 ${
              task.status === 'completed' ? 'line-through text-white/50' : 'text-white'
            }`}>
              {task.title}
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">{task.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <span className={`px-4 py-2 rounded-[1.5rem] text-sm font-semibold backdrop-blur-2xl border ${getPriorityColor(task.priority)} shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]`}>
            {getPriorityText(task.priority)}
          </span>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onEditTask(task)}
              className="p-3 hover:bg-white/25 rounded-[1.5rem] transition-all duration-200 backdrop-blur-2xl bg-white/15 border border-white/25 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            >
              <Edit3 className="h-5 w-5 text-white/80" />
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-3 hover:bg-red-500/30 rounded-[1.5rem] transition-all duration-200 backdrop-blur-2xl bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-400/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            >
              <Trash2 className="h-5 w-5 text-red-300" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center space-x-8 text-white/60">
        <div className="flex items-center backdrop-blur-2xl bg-white/15 border border-white/25 rounded-[1rem] px-4 py-2">
          <Calendar className="h-5 w-5 mr-2" />
          <span className="font-medium">{new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="flex items-center backdrop-blur-2xl bg-white/15 border border-white/25 rounded-[1rem] px-4 py-2">
          <Clock className="h-5 w-5 mr-2" />
          <span className="font-medium">{new Date(task.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
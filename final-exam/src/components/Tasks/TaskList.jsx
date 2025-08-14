import React from 'react';
import { Square } from 'lucide-react';
import TaskItem from './TaskItem.jsx';

const TaskList = ({ tasks, onToggleTask, onDeleteTask, onEditTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-xl border border-white/20 dark:border-white/10 shadow-lg">
        <div className="p-8 text-center">
          <div className="w-16 h-16 backdrop-blur-xl bg-white/20 border border-white/30 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Square className="h-8 w-8 text-white/60" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Không có task nào</h3>
          <p className="text-white/70">Bắt đầu bằng cách tạo task mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-xl border border-white/20 dark:border-white/10 shadow-lg overflow-hidden">
      <div className="divide-y divide-white/15">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
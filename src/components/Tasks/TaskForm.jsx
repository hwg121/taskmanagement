import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskForm = ({ 
  showModal, 
  editingTask, 
  onSubmit, 
  onClose,
  theme,
  initialData = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo',
    category: 'work'
  }
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (editingTask) {
      setFormData(editingTask);
    } else {
      setFormData(initialData);
    }
  }, [editingTask, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {editingTask ? 'Chỉnh sửa Task' : 'Tạo Task Mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-xl bg-white/10 border border-white/20"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Tiêu đề
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-3 backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 shadow-lg"
                placeholder="Nhập tiêu đề task..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full p-3 backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 resize-none shadow-lg"
                rows={3}
                placeholder="Nhập mô tả chi tiết..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Độ ưu tiên
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full p-3 backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg"
                >
                  <option value="high">Cao</option>
                  <option value="medium">Trung bình</option>
                  <option value="low">Thấp</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full p-3 backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg"
                >
                  <option value="todo">Chưa bắt đầu</option>
                  <option value="in-progress">Đang thực hiện</option>
                  <option value="completed">Đã hoàn thành</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Ngày hết hạn
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="w-full p-3 backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Danh mục
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full p-3 backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg"
              >
                <option value="work">Công việc</option>
                <option value="personal">Cá nhân</option>
                <option value="shopping">Mua sắm</option>
                <option value="health">Sức khỏe</option>
                <option value="meeting">Họp</option>
                <option value="documentation">Tài liệu</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200 backdrop-blur-xl border border-white/20 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`px-4 py-2 backdrop-blur-xl bg-gradient-to-r ${theme?.primary || 'from-emerald-500 to-green-600'} hover:${theme?.primaryHover || 'from-emerald-600 to-green-700'} text-white rounded-lg transition-all duration-200 border ${theme?.primaryBorder || 'border-emerald-400/30'} shadow-lg font-medium`}
            >
              {editingTask ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
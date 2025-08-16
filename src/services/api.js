import { 
  validateEmail, 
  validatePassword, 
  validateUsername,
  validateTaskTitle,
  validateTaskDescription,
  validateDate,
  validatePriority,
  validateStatus,
  validateCategory,
  sanitizeInput,
  AppError,
  errorHandler
} from '../utils/validation.js';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com'
  : 'http://localhost:3001';
const FETCH_TIMEOUT = 10000; // Tăng timeout lên 10s

class ApiService {
  constructor() {
    this.rateLimiters = new Map();
  }

  // Rate limiting cho từng endpoint
  checkRateLimit(endpoint, identifier) {
    if (!this.rateLimiters.has(endpoint)) {
      this.rateLimiters.set(endpoint, new Map());
    }
    
    const limiter = this.rateLimiters.get(endpoint);
    if (!limiter.has(identifier)) {
      limiter.set(identifier, { count: 0, resetTime: Date.now() + 60000 });
    }
    
    const userLimit = limiter.get(identifier);
    if (Date.now() > userLimit.resetTime) {
      userLimit.count = 0;
      userLimit.resetTime = Date.now() + 60000;
    }
    
    if (userLimit.count >= 10) { // 10 requests per minute
      throw new AppError('Quá nhiều yêu cầu. Vui lòng thử lại sau.', 'RATE_LIMIT_EXCEEDED', 429);
    }
    
    userLimit.count++;
    return true;
  }

  // Fetch với timeout và retry
  async fetchWithRetry(url, options = {}, retries = 3) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      clearTimeout(timeout);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.code || 'HTTP_ERROR',
          response.status
        );
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeout);
      
      if (error.name === 'AbortError') {
        throw new AppError('Request timeout', 'TIMEOUT_ERROR', 408);
      }
      
      if (retries > 0 && !error.statusCode) {
        // Retry logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      
      throw error;
    }
  }

  // User authentication
  async login(username, password) {
    try {
      // Validation
      if (!username || !password) {
        throw new AppError('Username và password không được để trống', 'VALIDATION_ERROR');
      }
      
      if (!validateUsername(username)) {
        throw new AppError('Username không hợp lệ (3-20 ký tự, chỉ cho phép chữ cái, số, dấu gạch dưới)', 'VALIDATION_ERROR');
      }
      
      if (password.length < 6) {
        throw new AppError('Password phải có ít nhất 6 ký tự', 'VALIDATION_ERROR');
      }

      // Rate limiting
      this.checkRateLimit('login', username);

      const response = await this.fetchWithRetry(`${API_BASE_URL}/users?username=${encodeURIComponent(username)}`);
      const users = await response.json();
      
      const user = users.find(u => u.username === username && u.password === password);
      
      if (!user) {
        throw new AppError('Username hoặc password không đúng', 'AUTH_ERROR', 401);
      }
      
      // Cập nhật lastLogin
      await this.updateUserLastLogin(user.id);
      
      return user;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async register(username, email, password, confirmPassword) {
    try {
      // Validation
      if (!username || !email || !password || !confirmPassword) {
        throw new AppError('Tất cả các trường đều bắt buộc', 'VALIDATION_ERROR');
      }
      
      if (!validateUsername(username)) {
        throw new AppError('Username không hợp lệ (3-20 ký tự, chỉ cho phép chữ cái, số, dấu gạch dưới)', 'VALIDATION_ERROR');
      }
      
      if (!validateEmail(email)) {
        throw new AppError('Email không hợp lệ', 'VALIDATION_ERROR');
      }
      
      if (password !== confirmPassword) {
        throw new AppError('Password và xác nhận password không khớp', 'VALIDATION_ERROR');
      }
      
      if (!validatePassword(password)) {
        throw new AppError('Password phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt', 'VALIDATION_ERROR');
      }

      // Rate limiting
      this.checkRateLimit('register', username);

      // Kiểm tra username và email đã tồn tại
      const response = await this.fetchWithRetry(`${API_BASE_URL}/users`);
      const users = await response.json();
      
      if (users.some(u => u.username === username)) {
        throw new AppError('Username đã tồn tại', 'DUPLICATE_ERROR');
      }
      
      if (users.some(u => u.email === email)) {
        throw new AppError('Email đã tồn tại', 'DUPLICATE_ERROR');
      }

      // Tạo user mới
      const newUser = {
        username: sanitizeInput(username),
        email: sanitizeInput(email),
        password: password, // Trong thực tế nên hash password
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ip: null
      };

      const createResponse = await this.fetchWithRetry(`${API_BASE_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(newUser)
      });
      
      const createdUser = await createResponse.json();
      
      // Log activity
      await this.logActivity(createdUser.username, 'Đăng ký tài khoản mới', 'register');
      
      return createdUser;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async changePassword(userId, currentPassword, newPassword, confirmPassword) {
    try {
      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new AppError('Tất cả các trường đều bắt buộc', 'VALIDATION_ERROR');
      }
      
      if (newPassword !== confirmPassword) {
        throw new AppError('Password mới và xác nhận password không khớp', 'VALIDATION_ERROR');
      }
      
      if (!validatePassword(newPassword)) {
        throw new AppError('Password mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt', 'VALIDATION_ERROR');
      }

      // Rate limiting
      this.checkRateLimit('changePassword', userId.toString());

      // Kiểm tra mật khẩu hiện tại
      const userResponse = await this.fetchWithRetry(`${API_BASE_URL}/users/${userId}`);
      const user = await userResponse.json();
      
      if (user.password !== currentPassword) {
        throw new AppError('Mật khẩu hiện tại không đúng', 'AUTH_ERROR', 401);
      }

      // Cập nhật mật khẩu
      const updateResponse = await this.fetchWithRetry(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ password: newPassword })
      });
      
      if (!updateResponse.ok) {
        throw new AppError('Không thể cập nhật mật khẩu', 'UPDATE_ERROR');
      }

      // Log activity
      await this.logActivity(user.username, 'Đổi mật khẩu', 'update');
      
      return { success: true };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // Task management
  async createTask(taskData, userId) {
    try {
      // Validation
      if (!validateTaskTitle(taskData.title)) {
        throw new AppError('Tiêu đề task phải từ 3-100 ký tự', 'VALIDATION_ERROR');
      }
      
      if (!validateTaskDescription(taskData.description)) {
        throw new AppError('Mô tả task không được quá 500 ký tự', 'VALIDATION_ERROR');
      }
      
      if (!validatePriority(taskData.priority)) {
        throw new AppError('Độ ưu tiên không hợp lệ', 'VALIDATION_ERROR');
      }
      
      if (!validateStatus(taskData.status)) {
        throw new AppError('Trạng thái không hợp lệ', 'VALIDATION_ERROR');
      }
      
      if (!validateCategory(taskData.category)) {
        throw new AppError('Danh mục không hợp lệ', 'VALIDATION_ERROR');
      }
      
      if (!validateDate(taskData.dueDate)) {
        throw new AppError('Ngày hết hạn phải từ hôm nay trở đi', 'VALIDATION_ERROR');
      }

      // Rate limiting
      this.checkRateLimit('createTask', userId.toString());

      const sanitizedTask = {
        ...taskData,
        title: sanitizeInput(taskData.title),
        description: sanitizeInput(taskData.description),
        userId: parseInt(userId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await this.fetchWithRetry(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        body: JSON.stringify(sanitizedTask)
      });
      
      const createdTask = await response.json();
      
      // Log activity
      await this.logActivity(userId.toString(), `Tạo task mới: ${sanitizedTask.title}`, 'create');
      
      return createdTask;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateTask(taskId, taskData, userId) {
    try {
      // Validation
      if (taskData.title && !validateTaskTitle(taskData.title)) {
        throw new AppError('Tiêu đề task phải từ 3-100 ký tự', 'VALIDATION_ERROR');
      }
      
      if (taskData.description && !validateTaskDescription(taskData.description)) {
        throw new AppError('Mô tả task không được quá 500 ký tự', 'VALIDATION_ERROR');
      }
      
      if (taskData.priority && !validatePriority(taskData.priority)) {
        throw new AppError('Độ ưu tiên không hợp lệ', 'VALIDATION_ERROR');
      }
      
      if (taskData.status && !validateStatus(taskData.status)) {
        throw new AppError('Trạng thái không hợp lệ', 'VALIDATION_ERROR');
      }
      
      if (taskData.category && !validateCategory(taskData.category)) {
        throw new AppError('Danh mục không hợp lệ', 'VALIDATION_ERROR');
      }
      
      if (taskData.dueDate && !validateDate(taskData.dueDate)) {
        throw new AppError('Ngày hết hạn phải từ hôm nay trở đi', 'VALIDATION_ERROR');
      }

      // Rate limiting
      this.checkRateLimit('updateTask', userId.toString());

      // Kiểm tra quyền sở hữu task
      const taskResponse = await this.fetchWithRetry(`${API_BASE_URL}/tasks/${taskId}`);
      const existingTask = await taskResponse.json();
      
      if (existingTask.userId !== parseInt(userId)) {
        throw new AppError('Bạn không có quyền chỉnh sửa task này', 'PERMISSION_ERROR', 403);
      }

      const sanitizedUpdates = {};
      Object.keys(taskData).forEach(key => {
        if (taskData[key] !== undefined) {
          if (key === 'title' || key === 'description') {
            sanitizedUpdates[key] = sanitizeInput(taskData[key]);
          } else {
            sanitizedUpdates[key] = taskData[key];
          }
        }
      });
      
      sanitizedUpdates.updatedAt = new Date().toISOString();

      const response = await this.fetchWithRetry(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(sanitizedUpdates)
      });
      
      const updatedTask = await response.json();
      
      // Log activity
      await this.logActivity(userId.toString(), `Cập nhật task: ${updatedTask.title}`, 'update');
      
      return updatedTask;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async deleteTask(taskId, userId) {
    try {
      // Rate limiting
      this.checkRateLimit('deleteTask', userId.toString());

      // Kiểm tra quyền sở hữu task
      const taskResponse = await this.fetchWithRetry(`${API_BASE_URL}/tasks/${taskId}`);
      const task = await taskResponse.json();
      
      if (task.userId !== parseInt(userId)) {
        throw new AppError('Bạn không có quyền xóa task này', 'PERMISSION_ERROR', 403);
      }

      const response = await this.fetchWithRetry(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new AppError('Không thể xóa task', 'DELETE_ERROR');
      }

      // Log activity
      await this.logActivity(userId.toString(), `Xóa task: ${task.title}`, 'delete');
      
      return { success: true };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getTasks(userId, filters = {}) {
    try {
      // Rate limiting
      this.checkRateLimit('getTasks', userId.toString());

      let url = `${API_BASE_URL}/tasks?userId=${userId}`;
      
      // Thêm filters
      if (filters.status && filters.status !== 'all') {
        url += `&status=${filters.status}`;
      }
      
      if (filters.priority && filters.priority !== 'all') {
        url += `&priority=${filters.priority}`;
      }
      
      if (filters.search) {
        url += `&q=${encodeURIComponent(filters.search)}`;
      }

      const response = await this.fetchWithRetry(url);
      const tasks = await response.json();
      
      // Filter thêm ở client side để đảm bảo an toàn
      return tasks.filter(task => task.userId === parseInt(userId));
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // Admin functions
  async getUsers() {
    try {
      // Rate limiting
      this.checkRateLimit('getUsers', 'admin');

      const response = await this.fetchWithRetry(`${API_BASE_URL}/users`);
      return await response.json();
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async updateUser(userId, updates) {
    try {
      // Validation
      if (updates.username && !validateUsername(updates.username)) {
        throw new AppError('Username không hợp lệ', 'VALIDATION_ERROR');
      }
      
      if (updates.email && !validateEmail(updates.email)) {
        throw new AppError('Email không hợp lệ', 'VALIDATION_ERROR');
      }
      
      if (updates.password && !validatePassword(updates.password)) {
        throw new AppError('Password không hợp lệ', 'VALIDATION_ERROR');
      }

      // Rate limiting
      this.checkRateLimit('updateUser', 'admin');

      const sanitizedUpdates = {};
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          if (key === 'username' || key === 'email') {
            sanitizedUpdates[key] = sanitizeInput(updates[key]);
          } else {
            sanitizedUpdates[key] = updates[key];
          }
        }
      });

      const response = await this.fetchWithRetry(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(sanitizedUpdates)
      });
      
      const updatedUser = await response.json();
      
      // Log activity
      await this.logActivity('admin', `Cập nhật user: ${updatedUser.username}`, 'update');
      
      return updatedUser;
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async deleteUser(userId) {
    try {
      // Rate limiting
      this.checkRateLimit('deleteUser', 'admin');

      // Kiểm tra không xóa admin
      const userResponse = await this.fetchWithRetry(`${API_BASE_URL}/users/${userId}`);
      const user = await userResponse.json();
      
      if (user.username === 'admin') {
        throw new AppError('Không thể xóa tài khoản admin', 'PERMISSION_ERROR', 403);
      }

      const response = await this.fetchWithRetry(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new AppError('Không thể xóa user', 'DELETE_ERROR');
      }

      // Log activity
      await this.logActivity('admin', `Xóa user ID: ${userId}`, 'delete');
      
      return { success: true };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  // Utility functions
  async updateUserLastLogin(userId) {
    try {
      await this.fetchWithRetry(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          lastLogin: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  async logActivity(username, action, type) {
    try {
      // Gửi data đơn giản để tránh React Error #31
      await this.fetchWithRetry(`${API_BASE_URL}/activities`, {
        method: 'POST',
        body: JSON.stringify({
          username: username,
          action: action,
          type: type
        })
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  async getSystemStats() {
    try {
      const response = await this.fetchWithRetry(`${API_BASE_URL}/system-stats`);
      return await response.json();
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getActivities() {
    try {
      const response = await this.fetchWithRetry(`${API_BASE_URL}/activities`);
      return await response.json();
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async verifySession(userId, token) {
    try {
      // Simple session verification - check if user exists and token is valid
      const response = await this.fetchWithRetry(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) {
        return false;
      }
      
      const user = await response.json();
      // For demo purposes, consider any existing user as valid session
      // In production, you would verify the JWT token
      return !!user && user.id === userId;
    } catch (error) {
      console.error('Session verification error:', error);
      return false;
    }
  }
}

const apiService = new ApiService();
export default apiService;



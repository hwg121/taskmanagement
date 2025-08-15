// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username) => {
  // 3-20 ký tự, chỉ cho phép chữ cái, số, dấu gạch dưới
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateTaskTitle = (title) => {
  return title.trim().length >= 3 && title.trim().length <= 100;
};

export const validateTaskDescription = (description) => {
  return description.trim().length <= 500;
};

export const validateDate = (date) => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

export const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

export const validatePriority = (priority) => {
  return ['low', 'medium', 'high'].includes(priority);
};

export const validateStatus = (status) => {
  return ['todo', 'in-progress', 'completed'].includes(status);
};

export const validateCategory = (category) => {
  return ['work', 'personal', 'shopping', 'health', 'meeting', 'other'].includes(category);
};

// Security utilities
export const hashPassword = async (password) => {
  // Trong thực tế, sử dụng bcrypt hoặc argon2
  // Đây chỉ là demo đơn giản
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateSecureToken = () => {
  return crypto.randomUUID();
};

export const validateToken = (token) => {
  // Kiểm tra format UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(token);
};

// Rate limiting utilities
export class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Lọc các request cũ
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Thêm request mới
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }

  reset(identifier) {
    this.requests.delete(identifier);
  }
}

// Session management
export class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = 30 * 60 * 1000; // 30 phút
  }

  createSession(userId, username) {
    const sessionId = generateSecureToken();
    const session = {
      id: sessionId,
      userId,
      username,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ip: null
    };
    
    this.sessions.set(sessionId, session);
    return sessionId;
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    // Kiểm tra session timeout
    if (Date.now() - session.lastActivity > this.sessionTimeout) {
      this.sessions.delete(sessionId);
      return null;
    }
    
    // Cập nhật lastActivity
    session.lastActivity = Date.now();
    return session;
  }

  updateSessionIP(sessionId, ip) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.ip = ip;
    }
  }

  destroySession(sessionId) {
    this.sessions.delete(sessionId);
  }

  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.sessionTimeout) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Error handling
export class AppError extends Error {
  constructor(message, code, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const errorHandler = (error) => {
  if (error instanceof AppError) {
    return {
      error: true,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    };
  }
  
  console.error('Unexpected error:', error);
  return {
    error: true,
    message: 'Đã xảy ra lỗi không mong muốn',
    code: 'INTERNAL_ERROR',
    statusCode: 500
  };
};



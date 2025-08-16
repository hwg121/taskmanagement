import React, { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Target, BarChart3, Search, User, Lock, LogIn, Sparkles, Moon, Sun, Star, Zap, Shield, Clock, Eye, EyeOff, Mail } from 'lucide-react';
import TaskManagement from './components/Tasks/TaskManagement';
import AdminManagement from './components/Admin/AdminManagement';
import { useDarkMode } from './hooks/useDarkMode';
import { useTheme } from './hooks/useTheme';
import apiService from './services/api';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { theme } = useTheme();
  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  
  // View state - 'login' or 'register'
  const [currentView, setCurrentView] = useState('login');
  
  // Login form state
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Clear authentication data (không lưu password)
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('taskapp_user');
    localStorage.removeItem('taskapp_token');
    setUser(null);
    setIsLoggedIn(false);
    setLoginData({ username: '', password: '' });
    setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
  }, []);

  // Verify session với server (tách ra service, kiểm tra đầu vào)
  const verifySession = useCallback(async (userId, token) => {
    if (!userId || !token) return false;
    try {
      return await apiService.verifySession(userId, token);
    } catch (error) {
      console.error('Session verification error:', error);
      return false;
    }
  }, []);

  // Check localStorage cho existing session
  const checkExistingAuth = useCallback(async () => {
    setAuthLoading(true);
    try {
      const savedUser = localStorage.getItem('taskapp_user');
      const savedToken = localStorage.getItem('taskapp_token');

      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);
        const isValidSession = await verifySession(userData.id, savedToken);

        if (isValidSession) {
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuthData();
    } finally {
      setAuthLoading(false);
    }
  }, [clearAuthData, verifySession]);

  // Check for existing authentication khi app load
  useEffect(() => {
    checkExistingAuth();
  }, [checkExistingAuth]);

  // Handle login (validate đầu vào, không lưu password)
  const handleLogin = useCallback(async (credentials) => {
    if (!credentials.username || !credentials.password) {
      throw new Error('Vui lòng nhập đầy đủ thông tin đăng nhập');
    }
    try {
      const foundUser = await apiService.login(credentials.username, credentials.password);
      if (!foundUser) throw new Error('Tài khoản không tồn tại hoặc mật khẩu sai');
      const userData = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email
      };
      const token = `token_${userData.id}_${Date.now()}`;
      localStorage.setItem('taskapp_user', JSON.stringify(userData));
      localStorage.setItem('taskapp_token', token);
      setUser(userData);
      setIsLoggedIn(true);
      setGlobalError(null);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      // Log logout activity if user is logged in
      if (user) {
        try {
          await apiService.logActivity(user.username, 'Đăng xuất khỏi hệ thống', 'logout');
        } catch (error) {
          console.error('Error logging logout activity:', error);
        }
      }

      clearAuthData();
      setGlobalError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setGlobalError('Có lỗi khi đăng xuất. Vui lòng thử lại.');
    }
  }, [clearAuthData, user]);

  // Handle registration (validate đầu vào, không lưu password)
  const handleRegister = useCallback(async (userData) => {
    if (!userData.username || !userData.email || !userData.password || !userData.confirmPassword) {
      throw new Error('Vui lòng điền đầy đủ thông tin');
    }
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Mật khẩu xác nhận không khớp');
    }
    if (userData.password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Email không hợp lệ');
    }
    try {
      const createdUser = await apiService.register(userData.username, userData.email, userData.password, userData.confirmPassword);
      setRegisterSuccess(true);
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        setCurrentView('login');
        setRegisterSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  // Handle network errors globally
  useEffect(() => {
    const handleOnline = () => globalError?.includes('mạng') && setGlobalError(null);
    const handleOffline = () => setGlobalError('Mất kết nối mạng. Vui lòng kiểm tra kết nối internet.');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [globalError]);

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      await handleLogin(loginData);
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle register form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError(null);

    try {
      await handleRegister(registerData);
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  // Show loading screen khi check auth
  if (authLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center overflow-hidden">
        <div className="relative">
          {/* Animated background circles */}
          <div className="absolute -inset-4">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div className="absolute -inset-8 animate-spin-slow">
            <div className="w-40 h-40 border-2 border-blue-400/20 border-t-blue-400 rounded-full"></div>
          </div>
          
          {/* Main loading card */}
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Task Manager</h1>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-white/70">Đang kiểm tra phiên đăng nhập...</p>
          </div>
        </div>
      </div>
    );
  }

  // If logged in, show appropriate dashboard based on user role
  if (isLoggedIn) {
    // Check if user is admin (username is 'admin')
    if (user?.username === 'admin') {
      return <AdminManagement user={user} onLogout={handleLogout} />;
    } else {
      return <TaskManagement user={user} onLogout={handleLogout} />;
    }
  }

  // Landing page with login form - Single page design
  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Global Error Display */}
      {globalError && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/30 text-white px-6 py-4 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-red-100">{globalError}</span>
              <button
                onClick={() => setGlobalError(null)}
                className="ml-4 text-red-200 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Single Page Layout */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          
          {/* Header */}
          <div className="absolute top-8 left-8 right-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckSquare className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TaskManager</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="hidden sm:inline">Trusted by 10k+ users</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center h-full pt-24 pb-16">
            
            {/* Left Side - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/90 font-medium text-sm">Công cụ quản lý task #1</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Quản lý
                  <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    công việc
                  </span>
                  <span className="block text-3xl lg:text-5xl text-white/90">thông minh</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed max-w-xl">
                  Tăng năng suất làm việc với công cụ quản lý task hiện đại, 
                  trực quan và dễ sử dụng.
                </p>
              </div>

              {/* Features Grid - Compact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <CheckSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">Tạo & Quản lý</h3>
                  <p className="text-white/70 text-sm">Tasks dễ dàng với giao diện trực quan</p>
                </div>

                <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">Ưu tiên thông minh</h3>
                  <p className="text-white/70 text-sm">Sắp xếp công việc theo độ quan trọng</p>
                </div>

                <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">Theo dõi tiến độ</h3>
                  <p className="text-white/70 text-sm">Báo cáo chi tiết về hiệu suất</p>
                </div>

                <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">Tự động hóa</h3>
                  <p className="text-white/70 text-sm">Tiết kiệm thời gian thông minh</p>
                </div>
              </div>

              {/* Stats - Compact */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">10K+</div>
                  <div className="text-white/70 text-sm">Người dùng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">50K+</div>
                  <div className="text-white/70 text-sm">Tasks hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                  <div className="text-white/70 text-sm">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8">
                  
                  {/* View Toggle Tabs */}
                  <div className="flex mb-6 bg-white/5 backdrop-blur-xl rounded-xl p-1">
                    <button
                      onClick={() => setCurrentView('login')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentView === 'login'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => setCurrentView('register')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentView === 'register'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Đăng ký
                    </button>
                  </div>

                  {currentView === 'login' ? (
                    <>
                      {/* Login Form Header */}
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Chào mừng trở lại</h2>
                        <p className="text-white/70">Đăng nhập để tiếp tục quản lý công việc</p>
                      </div>

                      {/* Login Error Message */}
                      {loginError && (
                        <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-xl">
                          <p className="text-red-100 text-center text-sm">{loginError}</p>
                        </div>
                      )}

                      {/* Login Form */}
                      <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">
                            Tên đăng nhập
                          </label>
                          <div className="relative">
                            <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                              focusedField === 'username' ? 'text-blue-400 scale-110' : 'text-white/50'
                            }`} />
                            <input
                              type="text"
                              value={loginData.username}
                              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                              onFocus={() => setFocusedField('username')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                focusedField === 'username' 
                                  ? 'border-blue-400/70 ring-2 ring-blue-400/30 bg-white/15 scale-105' 
                                  : 'border-white/20 hover:border-white/30'
                              }`}
                              placeholder="Nhập tên đăng nhập"
                              required
                            />
                                                          {focusedField === 'username' && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-xl -z-10 animate-pulse"></div>
                              )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">
                            Mật khẩu
                          </label>
                          <div className="relative">
                            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                              focusedField === 'password' ? 'text-blue-400 scale-110' : 'text-white/50'
                            }`} />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={loginData.password}
                              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                              onFocus={() => setFocusedField('password')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-xl border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                focusedField === 'password' 
                                  ? 'border-blue-400/70 ring-2 ring-blue-400/30 bg-white/15 scale-105' 
                                  : 'border-white/20 hover:border-white/30'
                              }`}
                              placeholder="Nhập mật khẩu"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                                                          {focusedField === 'password' && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-xl -z-10 animate-pulse"></div>
                              )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loginLoading}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                        >
                          {loginLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Đang đăng nhập...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <LogIn className="w-5 h-5 mr-2" />
                              Đăng nhập
                            </div>
                          )}
                        </button>
                      </form>

                      {/* Demo Credentials */}
                      <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-400/30 rounded-xl">
                        <div className="text-center">
                          <p className="text-white/80 text-sm mb-2">Demo Accounts:</p>
                          <div className="space-y-2">
                            {/* Admin Account */}
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-white/70 text-xs">Admin:</span>
                              <code className="bg-white/20 px-2 py-1 rounded text-white font-mono text-xs">admin</code>
                              <span className="text-white/60">/</span>
                              <code className="bg-white/20 px-2 py-1 rounded text-white font-mono text-xs">admin123</code>
                            </div>
                            {/* User Account */}
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-white/70 text-xs">User:</span>
                              <code className="bg-white/20 px-2 py-1 rounded text-white font-mono text-xs">user1</code>
                              <span className="text-white/60">/</span>
                              <code className="bg-white/20 px-2 py-1 rounded text-white font-mono text-xs">user123</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Register Form Header */}
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Tạo tài khoản mới</h2>
                        <p className="text-white/70">Đăng ký để bắt đầu quản lý công việc</p>
                      </div>

                      {/* Register Success Message */}
                      {registerSuccess && (
                        <div className="mb-4 p-3 bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-xl">
                          <p className="text-green-100 text-center text-sm">Đăng ký thành công! Đang chuyển đến trang đăng nhập...</p>
                        </div>
                      )}

                      {/* Register Error Message */}
                      {registerError && (
                        <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-xl">
                          <p className="text-red-100 text-center text-sm">{registerError}</p>
                        </div>
                      )}

                      {/* Register Form */}
                      <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">
                            Tên đăng nhập
                          </label>
                          <div className="relative">
                            <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                              focusedField === 'reg_username' ? 'text-green-400 scale-110' : 'text-white/50'
                            }`} />
                            <input
                              type="text"
                              value={registerData.username}
                              onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                              onFocus={() => setFocusedField('reg_username')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                focusedField === 'reg_username' 
                                  ? 'border-green-400/70 ring-2 ring-green-400/30 bg-white/15 scale-105' 
                                  : 'border-white/20 hover:border-white/30'
                              }`}
                              placeholder="Nhập tên đăng nhập"
                              required
                            />
                            {focusedField === 'reg_username' && (
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl -z-10 animate-pulse"></div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                              focusedField === 'reg_email' ? 'text-green-400 scale-110' : 'text-white/50'
                            }`} />
                            <input
                              type="email"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                              onFocus={() => setFocusedField('reg_email')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                focusedField === 'reg_email' 
                                  ? 'border-green-400/70 ring-2 ring-green-400/30 bg-white/15 scale-105' 
                                  : 'border-white/20 hover:border-white/30'
                              }`}
                              placeholder="Nhập email"
                              required
                            />
                            {focusedField === 'reg_email' && (
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl -z-10 animate-pulse"></div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">
                            Mật khẩu
                          </label>
                          <div className="relative">
                            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                              focusedField === 'reg_password' ? 'text-green-400 scale-110' : 'text-white/50'
                            }`} />
                            <input
                              type={showRegisterPassword ? 'text' : 'password'}
                              value={registerData.password}
                              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                              onFocus={() => setFocusedField('reg_password')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-xl border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                focusedField === 'reg_password' 
                                  ? 'border-green-400/70 ring-2 ring-green-400/30 bg-white/15 scale-105' 
                                  : 'border-white/20 hover:border-white/30'
                              }`}
                              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                            >
                              {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            {focusedField === 'reg_password' && (
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl -z-10 animate-pulse"></div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/90 mb-2">
                            Xác nhận mật khẩu
                          </label>
                          <div className="relative">
                            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                              focusedField === 'reg_confirm' ? 'text-green-400 scale-110' : 'text-white/50'
                            }`} />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={registerData.confirmPassword}
                              onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                              onFocus={() => setFocusedField('reg_confirm')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-xl border rounded-xl text-white placeholder-white/50 focus:outline-none transition-all duration-300 ${
                                focusedField === 'reg_confirm' 
                                  ? 'border-green-400/70 ring-2 ring-green-400/30 bg-white/15 scale-105' 
                                  : 'border-white/20 hover:border-white/30'
                              }`}
                              placeholder="Nhập lại mật khẩu"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            {focusedField === 'reg_confirm' && (
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl -z-10 animate-pulse"></div>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={registerLoading || registerSuccess}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                        >
                          {registerLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Đang tạo tài khoản...
                            </div>
                          ) : registerSuccess ? (
                            <div className="flex items-center justify-center">
                              <CheckSquare className="w-5 h-5 mr-2" />
                              Đăng ký thành công!
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <User className="w-5 h-5 mr-2" />
                              Tạo tài khoản
                            </div>
                          )}
                        </button>
                      </form>
                    </>
                  )}

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center justify-center space-x-2 text-white/60">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs">Bảo mật SSL 256-bit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
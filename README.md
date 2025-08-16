# 🚀 Task Management System

Một hệ thống quản lý task hiện đại với giao diện đẹp mắt, tính năng admin dashboard và quản lý người dùng toàn diện.

## 🌐 **Live Demo**

### Frontend (Vercel)
**URL:** https://taskmanagement-three-gamma.vercel.app

### Backend (Heroku)
**URL:** https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com

**API Endpoints:**
- Health Check: https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/health
- Users: https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/users
- Tasks: https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/tasks
- System Stats: https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/system-stats

## ✨ Tính năng chính

### 🔐 **Hệ thống xác thực**
- Đăng nhập/Đăng ký tài khoản với validation
- Quản lý session an toàn với JWT
- Phân quyền user/admin
- Đổi mật khẩu với xác thực
- Rate limiting cho API calls

### 📋 **Quản lý Task (User Dashboard)**
- **CRUD Operations**: Tạo, chỉnh sửa, xóa task
- **Advanced Filtering**: Lọc theo trạng thái, độ ưu tiên, danh mục
- **Smart Search**: Tìm kiếm với debounced input (500ms delay)
- **Intelligent Sorting**: Sắp xếp theo title, priority, status, dueDate, category
- **Priority System**: Cao/Trung bình/Thấp với màu sắc phân biệt
- **Status Management**: Chưa bắt đầu/Đang thực hiện/Đã hoàn thành
- **Categories**: Công việc, Cá nhân, Mua sắm, Sức khỏe, Họp, Tài liệu, Khác
- **Due Date Management**: Ngày hết hạn và nhắc nhở
- **Statistics Dashboard**: Thống kê real-time về task status

### 👨‍💼 **Admin Dashboard**
- **System Monitoring**: CPU, RAM, Disk, Network usage real-time
- **Smart Alerts**: Chỉ hiển thị cảnh báo khi metrics > 75%
  - Warning: 75% - 90% (màu vàng)
  - Critical: > 90% (màu đỏ)
- **User Management**: Quản lý người dùng, xem trạng thái online/offline
- **Advanced Search**: Tìm kiếm user với debounced input (500ms delay)
- **User Sorting**: Sắp xếp theo username, email, status, lastActivity
- **Activity Logs**: Theo dõi hoạt động người dùng real-time
- **Real-time Updates**: Cập nhật dữ liệu theo thời gian thực

### 🎨 **Giao diện người dùng**
- **Glassmorphism Design**: Hiệu ứng trong suốt hiện đại
- **Dark/Light Mode**: Chuyển đổi theme linh hoạt
- **Responsive Design**: Tối ưu cho mobile, tablet, desktop
- **Smooth Animations**: Chuyển động mượt mà với CSS transitions
- **Tailwind CSS**: Styling hiện đại và nhất quán
- **Mobile-First**: Responsive breakpoints: 320px, 480px, 768px, 1024px

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18.2.0** - Framework chính với hooks
- **React Router DOM 7.7.1** - Điều hướng SPA
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.539.0** - Icon library hiện đại
- **PostCSS** - CSS processing và optimization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JSON Server** - Mock API server với real-time updates
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Compression** - Response compression

### Development Tools
- **Custom Hooks**: useDebounce, useDarkMode, useTheme
- **ESLint** - Code linting và formatting
- **Jest** - Testing framework
- **Git Hooks** - Pre-commit validation

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js (version 16 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone https://github.com/hwg121/taskmanagement.git
cd taskmanagement
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Khởi động hệ thống

#### Chạy tất cả services (khuyến nghị)
```bash
npm run dev
```

Lệnh này sẽ chạy:
- **JSON Server** (port 3001) - API backend
- **System Stats Updater** - Cập nhật system metrics
- **Activity Logger** - Log hoạt động users
- **React App** (port 3000) - Frontend

#### Chạy từng service riêng lẻ
```bash
# Chỉ chạy React app
npm start

# Chỉ chạy JSON server
npm run server

# Chạy system stats updater
npm run updater:stats

# Chạy activity logger
npm run updater:activity
```

## 🚀 Sử dụng

### Đăng nhập
1. Mở trình duyệt và truy cập `http://localhost:3000`
2. Sử dụng tài khoản có sẵn hoặc đăng ký mới

#### Tài khoản để truy cập Admin Dashboard mặc định
- **Username:** `admin`
- **Password:** `admin123`

#### Tài khoản User mặc định
- **Username:** `user1`
- **Password:** `user123`

### Tạo Task mới
1. Đăng nhập vào hệ thống
2. Click nút "Tạo Task Mới" (+)
3. Điền thông tin task:
   - Tiêu đề (bắt buộc)
   - Mô tả
   - Độ ưu tiên (Cao/Trung bình/Thấp)
   - Trạng thái (Chưa bắt đầu/Đang thực hiện/Đã hoàn thành)
   - Ngày hết hạn
   - Danh mục
4. Click "Tạo mới"

### Quản lý Task
- **Chỉnh sửa**: Click icon edit trên task
- **Xóa**: Click icon trash trên task
- **Thay đổi trạng thái**: Click checkbox để toggle hoàn thành
- **Lọc và tìm kiếm**: Sử dụng thanh tìm kiếm và bộ lọc
- **Sắp xếp**: Click header columns để sort theo tiêu chí

### Admin Dashboard
1. Đăng nhập với tài khoản admin
2. Truy cập Admin Dashboard
3. Xem system stats, user management, activity logs
4. Quản lý người dùng (thêm, sửa, xóa)
5. Monitor system alerts (chỉ hiển thị khi > 75%)

## 📁 Cấu trúc dự án

```
taskmanagement/
├── src/
│   ├── components/
│   │   ├── Admin/           # Admin dashboard components
│   │   │   ├── AdminDashboard.jsx    # Main admin interface
│   │   │   └── AdminManagement.jsx   # Admin routing
│   │   ├── Auth/            # Authentication components
│   │   │   ├── LoginForm.jsx         # Login/Register forms
│   │   │   └── NavBar.jsx            # Navigation bar
│   │   ├── Tasks/           # Task management components
│   │   │   ├── TaskDashboard.jsx     # Main task interface
│   │   │   ├── TaskForm.jsx          # Create/Edit task form
│   │   │   ├── TaskItem.jsx          # Individual task display
│   │   │   ├── TaskList.jsx          # Task list container
│   │   │   ├── TaskManagement.jsx    # Task routing
│   │   │   └── TaskTimeline.jsx      # Timeline view
│   │   ├── UI/              # Reusable UI components
│   │   │   ├── Calendar.jsx          # Calendar component
│   │   │   ├── CircularChart.jsx     # Statistics charts
│   │   │   ├── Settings.jsx          # Settings panel
│   │   │   └── ThemeSelector.jsx     # Theme switcher
│   │   └── Commons/         # Common components
│   │       ├── ErrorMessage.jsx      # Error display
│   │       └── LoadingSpinner.jsx    # Loading states
│   ├── hooks/               # Custom React hooks
│   │   ├── useDebounce.js           # Debounced search hook
│   │   ├── useDarkMode.js           # Dark mode hook
│   │   └── useTheme.js              # Theme management hook
│   ├── services/            # API services
│   │   └── api.js                   # Centralized API service
│   ├── utils/               # Utility functions
│   │   └── validation.js            # Form validation
│   └── Styles/              # Component-specific styles
├── db/                      # Database files
├── scripts/                 # Node.js scripts
├── public/                  # Static assets
└── package.json
```

## 🔧 Scripts có sẵn

```bash
# Development
npm run dev              # Chạy tất cả services
npm start               # Chạy React app
npm run server          # Chạy JSON server

# System Management
npm run updater:stats   # Cập nhật system stats
npm run updater:activity # Log user activities
npm run reset:stats     # Reset system stats
npm run force:stats     # Force update stats

# Testing
npm run test            # Chạy tests
npm run test:all        # Test tất cả scripts
npm run test:api        # Test API endpoints
npm run test:stats      # Test system stats

# Build
npm run build           # Build production
npm run build:css       # Build CSS với PostCSS
```

## 🌐 API Endpoints

### Authentication
- `POST /login` - Đăng nhập với validation
- `POST /register` - Đăng ký với email validation
- `POST /logout` - Đăng xuất và clear session
- `POST /change-password` - Đổi mật khẩu

### Users
- `GET /users` - Lấy danh sách users với pagination
- `GET /users/:id` - Lấy thông tin user cụ thể
- `POST /users` - Tạo user mới với validation
- `PATCH /users/:id` - Cập nhật user information
- `DELETE /users/:id` - Xóa user với confirmation

### Tasks
- `GET /tasks` - Lấy danh sách tasks với filtering
- `GET /tasks/:id` - Lấy thông tin task cụ thể
- `POST /tasks` - Tạo task mới với validation
- `PATCH /tasks/:id` - Cập nhật task status/content
- `DELETE /tasks/:id` - Xóa task với confirmation

### System
- `GET /system-stats` - Lấy system metrics real-time
- `GET /activities` - Lấy activity logs với pagination
- `POST /activities` - Thêm activity mới
- `GET /health` - Health check endpoint

## 🎨 Themes và Styling

### Theme System
- **Light Mode**: Giao diện sáng với màu sắc tươi mới
- **Dark Mode**: Giao diện tối với màu sắc sang trọng
- **Auto-detect**: Tự động detect system preference

### Design System
- **Glassmorphism**: Hiệu ứng trong suốt hiện đại
- **Color Palette**: Hệ thống màu sắc nhất quán
- **Typography**: Font chữ dễ đọc và đẹp mắt
- **Spacing**: Hệ thống khoảng cách chuẩn
- **Responsive**: Mobile-first approach với breakpoints

## 🔒 Bảo mật

### Authentication
- JWT token management
- Session validation
- Password hashing
- Rate limiting (10 requests/minute)
- Input validation và sanitization

### Data Protection
- CORS configuration
- Input sanitization
- Error handling an toàn
- Permission-based access control
- User isolation (chỉ thấy task của mình)

## 📊 Performance

### Optimization
- **Debounced Search**: 500ms delay cho search input
- **Memoized Filtering**: useMemo cho complex calculations
- **Real-time Updates**: Polling intervals cho live data
- **Data Caching**: Local state management
- **Lazy Loading**: Component loading optimization
- **Efficient Re-renders**: React optimization

### Monitoring
- System health monitoring
- User activity tracking
- Performance metrics
- Error logging và reporting

## 🐛 Troubleshooting

### Vấn đề thường gặp

1. **"Server không phản hồi"**
   ```bash
   # Kiểm tra JSON Server
   curl http://localhost:3001/users
   
   # Restart services
   npm run dev
   ```

2. **"Không thấy data thực"**
   - Kiểm tra scripts có chạy không
   - Xem console logs
   - Kiểm tra database files

3. **"Admin dashboard không hiện"**
   - Đăng nhập với username "admin"
   - Kiểm tra localStorage
   - Kiểm tra user permissions

4. **"Search không hoạt động"**
   - Đợi 500ms sau khi gõ
   - Kiểm tra debounced search
   - Clear browser cache

### Debug Commands
```bash
# Check server status
curl http://localhost:3001/users

# Check system stats
curl http://localhost:3001/system-stats

# Check activities
curl http://localhost:3001/activities

# Check production backend
curl https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/health

# View logs
npm run test:all
```

### Production Debug Commands
```bash
# Check Heroku backend health
curl https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/health

# Check Heroku logs
heroku logs --tail

# Check Vercel deployment status
# Visit: https://vercel.com/dashboard
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. **Connect GitHub Repository** với Vercel
2. **Build Command:** `npm run build`
3. **Output Directory:** `build`
4. **Environment Variables:**
   - `NODE_ENV=production`
   - `REACT_APP_API_URL=https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com`

### Backend Deployment (Heroku)
1. **Create Heroku App:**
   ```bash
   heroku create task-management-backend-2025
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set SESSION_SECRET=your-session-secret
   heroku config:set NPM_CONFIG_PRODUCTION=false
   heroku config:set NPM_CONFIG_CI=false
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

### Production Build
```bash
npm run build
```

### Environment Variables
Tạo file `.env` trong root directory:
```env
# Development
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development

# Production
REACT_APP_API_URL=https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com
REACT_APP_ENV=production
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phát hành dưới MIT License.

## 👨‍💻 Tác giả

**Nguyễn Hưng** - [nguyenhung12105@gmail.com](mailto:nguyenhung12105@gmail.com)

---

⭐ **Nếu dự án này hữu ích, hãy cho một star!**

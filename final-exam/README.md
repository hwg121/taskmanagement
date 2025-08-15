# 🚀 Task Management System

Một hệ thống quản lý task hiện đại với giao diện đẹp mắt, tính năng admin dashboard và quản lý người dùng toàn diện.

## ✨ Tính năng chính

### 🔐 **Hệ thống xác thực**
- Đăng nhập/Đăng ký tài khoản
- Quản lý session an toàn
- Phân quyền user/admin
- Đổi mật khẩu

### 📋 **Quản lý Task**
- Tạo, chỉnh sửa, xóa task
- Phân loại theo độ ưu tiên (Cao/Trung bình/Thấp)
- Trạng thái task (Chưa bắt đầu/Đang thực hiện/Đã hoàn thành)
- Danh mục đa dạng (Công việc, Cá nhân, Mua sắm, Sức khỏe, Họp, Tài liệu, Khác)
- Ngày hết hạn và nhắc nhở
- Tìm kiếm và lọc task

### 👨‍💼 **Admin Dashboard**
- **System Monitoring**: CPU, RAM, Disk, Network usage real-time
- **User Management**: Quản lý người dùng, xem trạng thái online/offline
- **Activity Logs**: Theo dõi hoạt động người dùng
- **System Alerts**: Cảnh báo khi tài nguyên hệ thống cao
- **Real-time Updates**: Cập nhật dữ liệu theo thời gian thực

### 🎨 **Giao diện người dùng**
- **Glassmorphism Design**: Hiệu ứng trong suốt hiện đại
- **Dark/Light Mode**: Chuyển đổi theme linh hoạt
- **Responsive Design**: Tương thích mọi thiết bị
- **Smooth Animations**: Chuyển động mượt mà
- **Tailwind CSS**: Styling hiện đại và nhất quán

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18.2.0** - Framework chính
- **React Router DOM 7.7.1** - Điều hướng
- **Tailwind CSS 3.4.1** - Styling framework
- **Lucide React 0.539.0** - Icon library
- **PostCSS** - CSS processing

### Backend
- **JSON Server 0.17.3** - Mock API server
- **Node.js** - Runtime environment

### Development Tools
- **Concurrently** - Chạy nhiều services đồng thời
- **ESLint** - Code linting
- **Jest** - Testing framework

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js (version 16 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd final-exam
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
   - Độ ưu tiên
   - Trạng thái
   - Ngày hết hạn
   - Danh mục
4. Click "Tạo mới"

### Quản lý Task
- **Chỉnh sửa**: Click icon edit trên task
- **Xóa**: Click icon trash trên task
- **Thay đổi trạng thái**: Click checkbox để toggle hoàn thành
- **Lọc và tìm kiếm**: Sử dụng thanh tìm kiếm và bộ lọc

### Admin Dashboard
1. Đăng nhập với tài khoản admin
2. Truy cập Admin Dashboard
3. Xem system stats, user management, activity logs
4. Quản lý người dùng (thêm, sửa, xóa)

## 📁 Cấu trúc dự án

```
final-exam/
├── src/
│   ├── components/
│   │   ├── Admin/           # Admin dashboard components
│   │   ├── Auth/            # Authentication components
│   │   ├── Tasks/           # Task management components
│   │   ├── UI/              # Reusable UI components
│   │   └── Commons/         # Common components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── utils/               # Utility functions
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
- `POST /login` - Đăng nhập
- `POST /register` - Đăng ký
- `POST /logout` - Đăng xuất

### Users
- `GET /users` - Lấy danh sách users
- `GET /users/:id` - Lấy thông tin user
- `POST /users` - Tạo user mới
- `PATCH /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

### Tasks
- `GET /tasks` - Lấy danh sách tasks
- `GET /tasks/:id` - Lấy thông tin task
- `POST /tasks` - Tạo task mới
- `PATCH /tasks/:id` - Cập nhật task
- `DELETE /tasks/:id` - Xóa task

### System
- `GET /system-stats` - Lấy system metrics
- `GET /activities` - Lấy activity logs
- `POST /activities` - Thêm activity mới

## 🎨 Themes và Styling

### Theme System
- **Light Mode**: Giao diện sáng với màu sắc tươi mới
- **Dark Mode**: Giao diện tối với màu sắc sang trọng

### Design System
- **Glassmorphism**: Hiệu ứng trong suốt hiện đại
- **Color Palette**: Hệ thống màu sắc nhất quán
- **Typography**: Font chữ dễ đọc và đẹp mắt
- **Spacing**: Hệ thống khoảng cách chuẩn

## 🔒 Bảo mật

### Authentication
- Session management an toàn
- Password hashing
- Rate limiting cho API calls
- Input validation và sanitization

### Data Protection
- CORS configuration
- Input sanitization
- Error handling an toàn
- Permission-based access control

## 📊 Performance

### Optimization
- Real-time updates với polling intervals
- Data caching
- Lazy loading components
- Efficient re-renders

### Monitoring
- System health monitoring
- User activity tracking
- Performance metrics
- Error logging

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

### Debug Commands
```bash
# Check server status
curl http://localhost:3001/users

# Check system stats
curl http://localhost:3001/system-stats

# Check activities
curl http://localhost:3001/activities

# View logs
npm run test:all
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Tạo file `.env` trong root directory:
```env
REACT_APP_API_URL=http://localhost:3001
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

**Nguyễn Hùng** - [nguyenhung12105@gmail.com](mailto:nguyenhung12105@gmail.com)

---

⭐ **Nếu dự án này hữu ích, hãy cho một star!**
   
 
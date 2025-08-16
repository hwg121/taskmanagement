# 👨‍💼 Admin Dashboard Documentation

## 📋 Tổng quan

Admin Dashboard là giao diện quản trị hệ thống Task Management, cung cấp khả năng giám sát hệ thống, quản lý người dùng và theo dõi hoạt động real-time.

## 🌐 **Live Demo**

**Admin Dashboard URL:** https://taskmanagement-three-gamma.vercel.app (đăng nhập với admin/admin123)

**Backend API:** https://task-management-new-70f78e078f73.herokuapp.com

## 🔐 **Đăng nhập Admin**

### Tài khoản mặc định
- **Username:** `admin`
- **Password:** `admin123`

### Quyền truy cập
- ✅ Xem system stats
- ✅ Quản lý users
- ✅ Xem activity logs
- ✅ System monitoring
- ❌ Không thể tạo/sửa task

## 🎯 **Tính năng chính**

### 📊 **System Monitoring Dashboard**

#### Real-time Metrics
- **CPU Usage**: Hiển thị % sử dụng CPU với màu sắc phân biệt
- **RAM Usage**: Hiển thị % sử dụng RAM
- **Disk Usage**: Hiển thị % sử dụng ổ cứng
- **Network Usage**: Hiển thị % sử dụng mạng

#### Color Coding
- 🟢 **Green**: < 50% (Bình thường)
- 🟡 **Yellow**: 50% - 80% (Cần chú ý)
- 🔴 **Red**: > 80% (Cao)

#### Update Frequency
- **Real-time**: Cập nhật mỗi 5 giây
- **Auto-refresh**: Tự động refresh data

### 🚨 **Smart System Alerts**

#### Alert Logic
- **Chỉ hiển thị khi metrics > 75%**
- **Warning Level**: 75% - 90% (màu vàng)
- **Critical Level**: > 90% (màu đỏ)

#### Alert Types
- **CPU Alert**: Khi CPU usage > 75%
- **RAM Alert**: Khi RAM usage > 75%
- **Disk Alert**: Khi Disk usage > 75%
- **Network Alert**: Khi Network usage > 75%

#### Dynamic UI
- **Alert Count**: Hiển thị số lượng cảnh báo
- **Color Coding**: 
  - 1 cảnh báo: Xanh dương
  - 2 cảnh báo: Vàng
  - 3+ cảnh báo: Đỏ
- **Hide Section**: Không hiển thị nếu không có cảnh báo

### 👥 **User Management System**

#### User Overview
- **Online Users**: Hiển thị số người dùng online
- **User Status**: Online/Idle/Offline
- **Last Activity**: Thời gian hoạt động cuối

#### Advanced Search
- **Debounced Search**: 500ms delay sau khi gõ
- **Search Fields**: username, email, status
- **Real-time Results**: Hiển thị kết quả ngay lập tức
- **Search Indicators**: 
  - Yellow border khi đang search
  - Loading spinner
  - Results count

#### User Sorting
- **Sort Fields**: username, email, status, lastActivity
- **Sort Direction**: Ascending/Descending
- **Dynamic Sorting**: Thay đổi sort ngay lập tức

#### User Actions
- **View Details**: Xem thông tin chi tiết user
- **Edit User**: Sửa username, email, password
- **Delete User**: Xóa user với confirmation
- **Activity Logging**: Log mọi thay đổi

#### Sensitive Data Toggle
- **Show/Hide**: Toggle hiển thị thông tin nhạy cảm
- **IP Address**: Hiển thị IP của user
- **Password**: Hiển thị password (chỉ admin)

### 📝 **Activity Logging System**

#### Real-time Activity
- **User Actions**: Login, logout, create, update, delete
- **System Events**: User management actions
- **Timestamp**: Thời gian chính xác
- **Auto-refresh**: Cập nhật mỗi 10 giây

#### Activity Types
- **Create**: Tạo mới (màu xanh)
- **Update**: Cập nhật (màu xanh dương)
- **Delete**: Xóa (màu đỏ)
- **Login**: Đăng nhập (màu xanh)
- **Logout**: Đăng xuất (màu đỏ)

### 🎨 **UI/UX Features**

#### Responsive Design
- **Mobile-First**: Tối ưu cho mobile
- **Breakpoints**: 320px, 480px, 768px, 1024px
- **Adaptive Layout**: Tự động điều chỉnh

#### Visual Feedback
- **Loading States**: Spinner, skeleton loading
- **Success/Error**: Toast notifications
- **Hover Effects**: Interactive elements
- **Smooth Transitions**: CSS animations

#### Theme System
- **Dark Theme**: Mặc định
- **Glassmorphism**: Hiệu ứng trong suốt
- **Color Consistency**: Hệ thống màu nhất quán

## 🛠️ **Technical Implementation**

### Frontend Architecture
- **React 18.2.0**: Functional components với hooks
- **Custom Hooks**: useDebounce, useMemo
- **State Management**: Local state với useState
- **Performance**: Memoized calculations

### API Integration
- **Centralized Service**: api.js service
- **Error Handling**: Try-catch với user feedback
- **Rate Limiting**: 10 requests/minute
- **Real-time Updates**: Polling intervals

### Data Flow
```
User Input → Debounced Search → API Call → State Update → UI Render
```

### Performance Optimizations
- **Debounced Search**: 500ms delay
- **Memoized Filtering**: useMemo cho complex calculations
- **Efficient Sorting**: Optimized sort algorithms
- **Lazy Loading**: Component loading optimization

## 📱 **Mobile Responsiveness**

### Breakpoint Strategy
- **320px**: Small mobile
- **480px**: Mobile
- **768px**: Tablet
- **1024px**: Desktop

### Mobile Optimizations
- **Touch-friendly**: Button sizes phù hợp
- **Swipe Gestures**: Mobile navigation
- **Optimized Layout**: Stack elements vertically
- **Reduced Padding**: Tối ưu không gian

## 🔒 **Security Features**

### Authentication
- **JWT Tokens**: Secure session management
- **Role-based Access**: Admin-only features
- **Session Validation**: Real-time verification

### Data Protection
- **User Isolation**: Admin chỉ thấy public data
- **Input Validation**: Sanitize user input
- **Error Handling**: Không expose sensitive info

### API Security
- **CORS Configuration**: Cross-origin protection
- **Rate Limiting**: Prevent abuse
- **Input Sanitization**: XSS protection

## 📊 **Performance Metrics**

### Loading Times
- **Initial Load**: < 2s
- **Search Response**: < 100ms (sau debounce)
- **Sort Response**: < 50ms
- **Real-time Updates**: < 5s intervals

### Memory Usage
- **Component Memory**: Optimized với useMemo
- **Event Listeners**: Proper cleanup
- **API Calls**: Efficient caching

### Scalability
- **User Limit**: Hỗ trợ 100+ concurrent users
- **Data Volume**: Xử lý 1000+ tasks
- **Real-time Updates**: Efficient polling

## 🐛 **Troubleshooting**

### Common Issues

#### System Alerts không hiển thị
- **Check**: Metrics có > 75% không?
- **Solution**: Đợi metrics tăng hoặc kiểm tra system

#### Search không hoạt động
- **Check**: Đợi 500ms sau khi gõ
- **Solution**: Clear cache hoặc refresh page

#### User data không load
- **Check**: API connection
- **Solution**: Kiểm tra backend status

#### Performance issues
- **Check**: Browser console errors
- **Solution**: Clear browser cache

### Debug Commands
```bash
# Check backend health
curl https://task-management-new-70f78e078f73.herokuapp.com/health

# Check system stats
curl https://task-management-new-70f78e078f73.herokuapp.com/system-stats

# Check users
curl https://task-management-new-70f78e078f73.herokuapp.com/users
```

## 🚀 **Deployment**

### Frontend (Vercel)
- **Auto-deploy**: Từ GitHub main branch
- **Build Command**: `npm run build`
- **Environment**: Production optimized

### Backend (Heroku)
- **Auto-deploy**: Từ GitHub main branch
- **Environment Variables**: Production config
- **Database**: JSON files với /tmp directory

## 📈 **Future Enhancements**

### Planned Features
- **Advanced Analytics**: Charts và graphs
- **User Permissions**: Role-based access control
- **Notification System**: Real-time alerts
- **Export Functionality**: Data export

### Performance Improvements
- **WebSocket**: Real-time communication
- **Caching**: Redis integration
- **CDN**: Static asset optimization

## 📞 **Support**

### Technical Issues
- **GitHub Issues**: Report bugs
- **Email**: nguyenhung12105@gmail.com
- **Documentation**: README.md

### Feature Requests
- **GitHub Discussions**: Feature ideas
- **Roadmap**: Planned features

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Author:** Nguyễn Hùng


# Admin Dashboard - Hướng dẫn sử dụng

## 🚀 Cách chạy hệ thống với data thực

### 1. Khởi động tất cả services

```bash
npm run dev
```

Lệnh này sẽ chạy:
- **JSON Server** (port 3001) - API backend
- **System Stats Updater** - Cập nhật CPU/RAM/Disk usage mỗi 5 giây
- **Activity Logger** - Log hoạt động users mỗi 30 giây  
- **React App** (port 3000) - Frontend

### 2. Đăng nhập Admin

Sử dụng tài khoản admin:
- **Username:** `admin`
- **Password:** `admin123`

### 3. Các tính năng Admin Dashboard

#### 📊 **System Monitoring**
- **CPU Usage:** Hiển thị % sử dụng CPU thực tế
- **RAM Usage:** Hiển thị % sử dụng RAM thực tế
- **Disk Usage:** Hiển thị % sử dụng ổ cứng thực tế
- **Network Usage:** Hiển thị % sử dụng mạng thực tế

#### 👥 **Online Users Tracking**
- **Real-time user status:** Online/Offline/Idle
- **IP Addresses:** Hiển thị IP của từng user
- **Last Activity:** Thời gian hoạt động cuối cùng
- **Toggle sensitive data:** Ẩn/hiện thông tin nhạy cảm

#### 📈 **Activity Logs**
- **User actions:** Đăng nhập, đăng xuất, tạo task, cập nhật task
- **Real-time updates:** Cập nhật mỗi 10 giây
- **Timestamps:** Thời gian chính xác của mỗi hoạt động
- **Activity types:** Phân loại theo loại hoạt động

#### ⚠️ **System Alerts**
- **Automatic warnings:** Cảnh báo khi RAM/Disk usage cao
- **Color-coded alerts:** Màu sắc theo mức độ nghiêm trọng
- **Dynamic content:** Dựa trên system stats thực tế

## 📁 Cấu trúc files

```
├── src/components/Admin/
│   ├── AdminDashboard.jsx    # Main admin dashboard
│   └── AdminManagement.jsx   # Wrapper component
├── db/
│   ├── activities.json       # Activity logs
│   └── system-stats.json     # System monitoring data
├── scripts/
│   ├── update-system-stats.js # System stats updater
│   └── log-activity.js       # Activity logger
└── db.json                   # Main database (users, tasks)
```

## 🔧 API Endpoints

### Users
- `GET /users` - Lấy danh sách users
- `PATCH /users/:id` - Cập nhật thông tin user (lastLogin, IP)

### Activities  
- `GET /activities` - Lấy activity logs
- `POST /activities` - Thêm activity mới

### System Stats
- `GET /system-stats` - Lấy system monitoring data

## 📊 Data Sources

### 1. **System Stats** (Real-time)
- **Source:** `scripts/update-system-stats.js`
- **Update frequency:** 5 giây
- **Data:** CPU, RAM, Disk, Network usage

### 2. **User Activities** (Real-time)
- **Source:** `scripts/log-activity.js` + Login/Logout events
- **Update frequency:** 30 giây (auto) + Real-time (user actions)
- **Data:** User actions, timestamps, activity types

### 3. **Online Users** (Real-time)
- **Source:** `db.json` (users table)
- **Update frequency:** 30 giây
- **Data:** User status, lastLogin, IP addresses

## 🎨 UI Features

### Glassmorphism Design
- **Backdrop blur effects**
- **Transparent backgrounds**
- **Subtle borders và shadows**
- **Smooth animations**

### Responsive Layout
- **Mobile-first design**
- **Grid layouts**
- **Flexible components**

### Color Themes
- **Admin theme:** Red/Pink/Purple gradients
- **Status indicators:** Green (online), Yellow (idle), Gray (offline)
- **Usage levels:** Green (<50%), Yellow (50-80%), Red (>80%)

## 🔒 Security Features

### Data Protection
- **Toggle sensitive data:** IP addresses có thể ẩn/hiện
- **Permission-based access:** Chỉ admin mới thấy dashboard
- **Activity logging:** Track tất cả user actions

### Error Handling
- **Graceful fallbacks:** Mock data khi API fails
- **Error boundaries:** Catch và display errors
- **Connection monitoring:** Check server health

## 🚀 Performance

### Optimization
- **Real-time updates:** Efficient polling intervals
- **Data caching:** Local storage cho user sessions
- **Lazy loading:** Components load khi cần

### Monitoring
- **System health:** Real-time monitoring
- **User activity:** Comprehensive logging
- **Performance metrics:** CPU, RAM, Disk usage

## 🛠️ Troubleshooting

### Common Issues

1. **"Server không phản hồi"**
   - Kiểm tra JSON Server có chạy không
   - Restart với `npm run dev`

2. **"Không thấy data thực"**
   - Kiểm tra scripts có chạy không
   - Xem console logs

3. **"Admin dashboard không hiện"**
   - Đăng nhập với username "admin"
   - Kiểm tra localStorage

### Debug Commands

```bash
# Check server status
curl http://localhost:3001/users

# Check system stats
curl http://localhost:3001/system-stats

# Check activities
curl http://localhost:3001/activities
```

## 📈 Future Enhancements

### Planned Features
- **Real system monitoring** (OS-level metrics)
- **User session management**
- **Advanced analytics dashboard**
- **Email notifications**
- **Export reports**

### Technical Improvements
- **WebSocket connections** (real-time updates)
- **Database optimization**
- **Caching strategies**
- **Security enhancements**


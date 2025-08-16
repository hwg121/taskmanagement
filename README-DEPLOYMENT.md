# 🚀 Hướng dẫn Deployment Task Management System

## 📋 Tổng quan

Hệ thống Task Management được deploy trên 2 nền tảng:
- **Frontend**: Vercel (React App)
- **Backend**: Heroku (Node.js + Express)

## 🌐 URLs Production

### Frontend (Vercel)
- **URL:** https://taskmanagement-three-gamma.vercel.app
- **Repository:** https://github.com/hwg121/taskmanagement

### Backend (Heroku)
- **URL:** https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com
- **Health Check:** https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/health

## 🔧 Backend Deployment (Heroku)

### Bước 1: Chuẩn bị
```bash
# Cài đặt Heroku CLI
npm install -g heroku

# Đăng nhập Heroku
heroku login
```

### Bước 2: Tạo Heroku App
```bash
# Tạo app mới
heroku create task-management-backend-2025

# Hoặc sử dụng app có sẵn
heroku git:remote -a task-management-backend-2025
```

### Bước 3: Cấu hình Environment Variables
```bash
# Thiết lập NODE_ENV
heroku config:set NODE_ENV=production

# Thiết lập PORT (tự động)
heroku config:get PORT

# Thiết lập các biến khác (nếu cần)
heroku config:set JWT_SECRET=your-secret-key
heroku config:set SESSION_SECRET=your-session-secret
```

### Bước 4: Deploy
```bash
# Commit changes
git add .
git commit -m "Prepare for Heroku deployment"

# Push lên Heroku
git push heroku main
```

### Bước 5: Kiểm tra và khởi động
```bash
# Kiểm tra logs
heroku logs --tail

# Khởi động app
heroku ps:scale web=1

# Mở app
heroku open
```

## 🎨 Frontend Deployment (Vercel)

### Bước 1: Chuẩn bị
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Đăng nhập với GitHub account

### Bước 2: Import Repository
1. Click "New Project"
2. Import từ GitHub: `hwg121/taskmanagement`
3. Chọn repository

### Bước 3: Cấu hình Build
- **Framework Preset:** Create React App
- **Root Directory:** `./` (root)
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### Bước 4: Environment Variables
```
REACT_APP_API_URL=https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com
REACT_APP_ENV=production
NODE_ENV=production
```

### Bước 5: Deploy
1. Click "Deploy"
2. Đợi build hoàn thành
3. Kiểm tra URL production

## 🔗 Liên kết Frontend-Backend

### CORS Configuration
Backend đã được cấu hình CORS để chấp nhận requests từ:
- **Development:** `http://localhost:3000`
- **Production:** `https://taskmanagement-three-gamma.vercel.app`

### API Configuration
Frontend sử dụng `src/services/api.js` để:
- Tự động detect environment (dev/prod)
- Sử dụng URL tương ứng
- Xử lý errors và retry logic

## 📊 Monitoring và Maintenance

### Heroku Commands
```bash
# Xem logs real-time
heroku logs --tail

# Kiểm tra app status
heroku ps

# Restart app
heroku restart

# Xem config
heroku config

# Xem releases
heroku releases
```

### Vercel Commands
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy từ local
vercel

# Xem deployment status
vercel ls
```

## 🧪 Testing Production

### Health Check
```bash
# Backend health
curl https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/health

# Frontend accessibility
curl -I https://taskmanagement-three-gamma.vercel.app
```

### API Endpoints Test
```bash
# Users endpoint
curl https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/users

# Tasks endpoint
curl https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/tasks

# System stats
curl https://task-management-backend-2025-ebb92e46bb7f.herokuapp.com/system-stats
```

## 🔒 Security

### Environment Variables
- Không commit `.env` files
- Sử dụng Heroku config vars
- Sử dụng Vercel environment variables

### CORS Security
- Chỉ cho phép specific origins
- Credentials: true cho authentication
- Rate limiting đã được implement

## 🚨 Troubleshooting

### Build Failed
```bash
# Kiểm tra Heroku logs
heroku logs --tail

# Kiểm tra build logs
heroku logs --tail --source app --build
```

### App Crashed
```bash
# Restart app
heroku restart

# Kiểm tra logs
heroku logs --tail
```

### CORS Issues
- Kiểm tra CORS configuration trong `server.js`
- Đảm bảo frontend URL được thêm vào allowed origins

## 📈 Performance

### Optimization
- Compression middleware đã enable
- Static file serving từ build folder
- Database files sử dụng `/tmp` trên Heroku

### Monitoring
- System stats real-time
- User activity tracking
- Performance metrics logging

## 🎯 Checklist Deployment

- [ ] Heroku app đã tạo
- [ ] Environment variables đã set
- [ ] Backend deploy thành công
- [ ] Health check endpoint hoạt động
- [ ] Vercel project đã tạo
- [ ] Frontend environment variables đã set
- [ ] Frontend deploy thành công
- [ ] CORS configuration đúng
- [ ] API endpoints test thành công
- [ ] Frontend-backend liên kết hoạt động

## 📚 Tài liệu tham khảo

- [Heroku Node.js Documentation](https://devcenter.heroku.com/categories/nodejs)
- [Vercel Documentation](https://vercel.com/docs)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express.js Documentation](https://expressjs.com/)

---

**Lưu ý:** Đảm bảo tất cả environment variables được set đúng trước khi deploy!

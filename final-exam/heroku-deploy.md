# 🚀 Hướng dẫn Deploy lên Heroku

## 📋 Yêu cầu trước khi deploy

1. **Cài đặt Heroku CLI**
   ```bash
   # Windows (với Chocolatey)
   choco install heroku-cli
   
   # macOS (với Homebrew)
   brew tap heroku/brew && brew install heroku
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Đăng nhập Heroku**
   ```bash
   heroku login
   ```

3. **Cài đặt Git** (nếu chưa có)
   ```bash
   git --version
   ```

## 🔧 Bước 1: Chuẩn bị dự án

### Cài đặt dependencies
```bash
npm install
```

### Build ứng dụng React
```bash
npm run build
```

### Kiểm tra server.js hoạt động
```bash
npm start
```

## 🚀 Bước 2: Tạo Heroku App

### Tạo app mới
```bash
heroku create your-app-name
```

### Hoặc sử dụng app có sẵn
```bash
heroku git:remote -a your-app-name
```

## ⚙️ Bước 3: Cấu hình Environment Variables

### Thiết lập NODE_ENV
```bash
heroku config:set NODE_ENV=production
```

### Thiết lập PORT (tự động)
```bash
# Heroku sẽ tự động set PORT
heroku config:get PORT
```

### Thiết lập các biến khác (nếu cần)
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set SESSION_SECRET=your-session-secret
```

## 📦 Bước 4: Deploy

### Commit changes
```bash
git add .
git commit -m "Prepare for Heroku deployment"
```

### Push lên Heroku
```bash
git push heroku main
```

### Hoặc nếu dùng master branch
```bash
git push heroku master
```

## 🔍 Bước 5: Kiểm tra và khởi động

### Kiểm tra logs
```bash
heroku logs --tail
```

### Khởi động app
```bash
heroku ps:scale web=1
```

### Mở app
```bash
heroku open
```

## 🌐 Bước 6: Cấu hình Frontend

### Cập nhật API URL trong frontend
Sau khi deploy thành công, cập nhật `src/services/api.js`:

```javascript
// Thay đổi từ localhost sang Heroku URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.herokuapp.com'
  : 'http://localhost:3001';
```

### Rebuild và redeploy
```bash
npm run build
git add .
git commit -m "Update API URL for production"
git push heroku main
```

## 🛠️ Bước 7: Kiểm tra hoạt động

### Health check
```bash
curl https://your-app-name.herokuapp.com/health
```

### Test API endpoints
```bash
# Test users endpoint
curl https://your-app-name.herokuapp.com/users

# Test tasks endpoint
curl https://your-app-name.herokuapp.com/tasks
```

## 📊 Bước 8: Monitoring và Maintenance

### Xem logs real-time
```bash
heroku logs --tail
```

### Kiểm tra app status
```bash
heroku ps
```

### Restart app nếu cần
```bash
heroku restart
```

### Xem config
```bash
heroku config
```

## 🔧 Troubleshooting

### Lỗi thường gặp

1. **"Build failed"**
   ```bash
   # Kiểm tra build logs
   heroku logs --tail
   
   # Kiểm tra package.json scripts
   # Đảm bảo có "start" script
   ```

2. **"App crashed"**
   ```bash
   # Kiểm tra logs
   heroku logs --tail
   
   # Restart app
   heroku restart
   ```

3. **"Database connection failed"**
   ```bash
   # Kiểm tra database addon
   heroku addons
   
   # Provision database nếu cần
   heroku addons:create heroku-postgresql:mini
   ```

### Debug commands
```bash
# Xem detailed logs
heroku logs --tail --source app

# Xem build logs
heroku logs --tail --source app --build

# Xem release logs
heroku releases

# Rollback nếu cần
heroku rollback v1
```

## 📱 Bước 9: Custom Domain (Tùy chọn)

### Thêm custom domain
```bash
heroku domains:add www.yourdomain.com
```

### Cấu hình DNS
```bash
# Lấy DNS target
heroku domains
```

## 🔒 Bước 10: Security

### Enable HTTPS
```bash
# Heroku tự động cung cấp HTTPS
heroku config:get HEROKU_SSL_CERT
```

### CORS Configuration
Kiểm tra CORS settings trong `server.js`:

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

## 📈 Bước 11: Performance Optimization

### Enable compression
```bash
# Đã có trong server.js
# app.use(compression());
```

### Static file serving
```bash
# Đã có trong server.js
# app.use(express.static(path.join(__dirname, 'build')));
```

## 🎯 Bước 12: Testing Production

### Test đăng nhập
1. Mở app trên Heroku
2. Đăng nhập với tài khoản admin
3. Kiểm tra admin dashboard
4. Tạo task mới
5. Kiểm tra real-time updates

### Test API endpoints
```bash
# Test tất cả endpoints
curl -X GET https://your-app-name.herokuapp.com/users
curl -X GET https://your-app-name.herokuapp.com/tasks
curl -X GET https://your-app-name.herokuapp.com/activities
curl -X GET https://your-app-name.herokuapp.com/system-stats
```

## 📋 Checklist hoàn thành

- [ ] Heroku CLI đã cài đặt
- [ ] Đã đăng nhập Heroku
- [ ] Dự án đã build thành công
- [ ] server.js hoạt động locally
- [ ] Đã tạo Heroku app
- [ ] Environment variables đã set
- [ ] Deploy thành công
- [ ] App khởi động thành công
- [ ] API endpoints hoạt động
- [ ] Frontend đã cập nhật API URL
- [ ] Test đăng nhập thành công
- [ ] Test tạo task thành công
- [ ] Admin dashboard hoạt động

## 🎉 Hoàn thành!

Sau khi hoàn thành tất cả bước trên, ứng dụng Task Management System của bạn đã được deploy thành công lên Heroku và có thể truy cập từ bất kỳ đâu trên internet!

**URL Production:** `https://your-app-name.herokuapp.com`

---

## 📚 Tài liệu tham khảo

- [Heroku Node.js Documentation](https://devcenter.heroku.com/categories/nodejs)
- [Heroku CLI Commands](https://devcenter.heroku.com/articles/heroku-cli-commands)
- [Heroku Environment Variables](https://devcenter.heroku.com/articles/config-vars)
- [Heroku Logs](https://devcenter.heroku.com/articles/logging)

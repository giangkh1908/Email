# Email Service

Dự án REST API phục vụ cho việc quản lý và gửi email, được xây dựng bằng **Node.js**, **Express** và lưu trữ dữ liệu trên **MongoDB**.

## Tech Stack
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Environment:** Node.js
- **Authentication:** JSON Web Token (JWT) & Bcrypt

## Cấu trúc thư mục

```text
src/
├── config/       # Cấu hình hệ thống (Database kết nối, config các thư viện)
├── controller/   # Tiếp nhận request và trả về response cho các API
├── middlewares/  # Chứa các middleware (Authentication, Error Handler...)
├── models/       # Định nghĩa các Schema của database (Mongoose)
├── routes/       # Khai báo các route (endpoint) của ứng dụng
├── services/     # Chứa logic nghiệp vụ xử lý chính của email
└── utils/        # Các hàm helper hoặc tiện ích dùng chung
```

## Setup dự án

1. Cài đặt các thư viện (dependencies):
```bash
npm install
```

2. Cài đặt biến môi trường:
Tạo một file `.env` ở thư mục gốc của dự án và thêm thông tin sau:
```bash
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
PORT=5000
# JWT_SECRET=your_jwt_secret_key
```

## Chạy ứng dụng

```bash
# Môi trường phát triển (có nodemon để tự động restart khi code thay đổi)
npm run dev

# Môi trường Production
npm start
```


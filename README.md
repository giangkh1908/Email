# AI Email Agent

Hệ thống AI Agent tự động viết email xin việc.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js (ES Modules)
- **Database:** MongoDB (Mongoose)
- **Cache/Queue:** Redis
- **Authentication:** JWT + OTP

## Architecture

**Modular Architecture** - Tổ chức theo modules, mỗi module chứa logic của riêng feature.

## Features

- **Authentication:** Register, Login, Logout với JWT
- **Email Verification:** OTP qua email
- **Email Validation:** 2-layer validation (blocklist, MX check)
- **Email Queue:** Redis queue cho việc gửi email
- **Token Management:** Access Token + Refresh Token với HttpOnly Cookie

## Setup

```bash
npm install
```

Tạo file `.env` với các biến môi trường cần thiết. 

## Run

```bash
npm run dev    # Development
npm start      # Production
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/auth/register/send-otp` | Gửi OTP đến email |
| POST | `/api/auth/register/verify-otp` | Verify OTP + Tạo user |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Đăng xuất |
| GET | `/api/auth/profile` | Lấy thông tin user |

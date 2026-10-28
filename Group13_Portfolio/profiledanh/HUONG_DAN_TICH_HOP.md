# HƯỚNG DẪN TÍCH HỢP PORTFOLIO MAI HOÀNG DANH VÀO WEBSITE NHÓM 11

## 1. Cấu trúc thư mục chuẩn
Trong file `group11.html`, thẻ thành viên **Mai Hoàng Danh** đang gọi liên kết tương đối:
```html
<div class="avatar-container" onclick="handleAvatarClick(this, 'profiledanh/danh.html')">
```
Vì vậy, toàn bộ mã nguồn portfolio của Mai Hoàng Danh được đặt trong thư mục `profiledanh/` với cấu trúc như sau:

```text
(Thư mục gốc dự án Nhóm 11 - chứa group11.html)
├── group11.html
└── profiledanh/
    ├── danh.html                  (Trang HTML chính của Mai Hoàng Danh)
    ├── css/
    │   └── profile.css            (File CSS định dạng giao diện Dark/Light, Responsive)
    ├── js/
    │   └── profile.js             (File JS xử lý Menu mobile, Theme, Copy email, Form validation + Mailto)
    ├── images/
    │   └── avatar.jpg             (Ảnh đại diện - bạn có thể chép đè ảnh chân dung thật của bạn vào tên file này)
    └── HUONG_DAN_TICH_HOP.md      (File hướng dẫn này)
```

## 2. Kiểm tra các liên kết tương đối (Relative Links)
1. **Từ `group11.html` sang trang cá nhân:**
   - Đường dẫn: `profiledanh/danh.html` -> **Khớp chính xác 100%**.
2. **Từ `profiledanh/danh.html` quay về trang nhóm:**
   - Ở cuối trang (`<footer>`), nút **"← TRỞ VỀ WEBSITE NHÓM 11"** dùng đường dẫn tương đối `../group11.html` -> **Khớp chính xác 100%**.
3. **Liên kết tài nguyên bên trong `profiledanh/danh.html`:**
   - CSS: `css/profile.css`
   - JS: `js/profile.js`
   - Ảnh đại diện: `images/avatar.jpg` (kèm cơ chế `onerror` tự động hiện khung chữ `D` nếu thiếu ảnh, đảm bảo không bao giờ vỡ giao diện).

## 3. Cách thay ảnh chân dung thật
- Chép file ảnh chân dung của bạn vào thư mục `profiledanh/images/` và đặt tên là `avatar.jpg` (hoặc giữ nguyên file `avatar.jpg` mặc định đã tạo sẵn trong gói ZIP).

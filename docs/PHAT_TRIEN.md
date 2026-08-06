# Tài Liệu Dành Cho Nhà Phát Triển (Developer Guide)

Tài liệu này dành cho những ai muốn tìm hiểu về kiến trúc, cách đóng gói (build) và đóng góp mã nguồn cho dự án **Amnimo Test Runner**.

---

## 1. Kiến Trúc Dự Án (Tech Stack)

Amnimo Test Runner là một ứng dụng Desktop được xây dựng trên sự kết hợp của các công nghệ Web hiện đại:
- **Framework Chính:** Nuxt 4 (chạy kèm với Nitro Server cho backend API).
- **Giao Diện (Frontend):** Vue 3 (sử dụng Composition API).
- **Quản Lý Trạng Thái (State Management):** Pinia.
- **Tạo Kiểu (Styling):** Tailwind CSS (thiết kế theo phong cách Glassmorphism).
- **Đóng Gói Desktop:** Electron và `electron-builder` để tạo ra file cài đặt (ví dụ: `.exe` cho Windows).
- **Đa Ngôn Ngữ:** `@nuxtjs/i18n`.

---

## 2. Cấu Trúc Thư Mục

Để dễ dàng nắm bắt mã nguồn, dưới đây là ý nghĩa của các thư mục quan trọng:

```text
amnimo-test-runer/
├── app/                  # Chứa toàn bộ mã nguồn Frontend (Giao diện)
│   ├── components/       # Các thành phần giao diện nhỏ (Nút, Biểu đồ, Form...)
│   ├── composables/      # Logic tái sử dụng (useSessionList, useFirmwareManager...)
│   ├── layouts/          # Khung giao diện dùng chung (thanh điều hướng, header)
│   └── pages/            # Các màn hình chính (index, firmware, release-spec, settings)
├── electron/             # Mã nguồn khởi chạy ứng dụng Desktop (main.mjs, preload.js)
├── build/                # Các file icon, ảnh nền để tạo bộ cài đặt phần mềm
├── server/               # Mã nguồn API nội bộ (Nitro Server) xử lý logic lưu trữ, đọc ghi file
├── i18n/                 # Dữ liệu dịch thuật ngôn ngữ (tiếng Anh và tiếng Nhật)
├── sessions/             # (Tự động sinh) Nơi lưu lịch sử phiên trong lúc lập trình (dev mode)
├── nuxt.config.ts        # File cấu hình trung tâm của Nuxt
└── package.json          # Danh sách thư viện và các lệnh chạy (scripts)
```

---

## 3. Cách Đóng Gói Ứng Dụng (Build & Package)

Sau khi chỉnh sửa mã nguồn và muốn xuất ra một file cài đặt phần mềm để gửi cho người dùng khác, bạn cần làm theo các bước sau:

1. Mở Terminal tại thư mục dự án.
2. Chạy lệnh đóng gói:
   ```bash
   npm run build:electron
   ```
3. Chờ quá trình hoàn tất, phần mềm của bạn sẽ được lưu trong thư mục `dist-electron/`. 
4. Đối với máy tính Windows, hệ thống sẽ sử dụng **NSIS** để tạo ra một file cài đặt `.exe` hoàn chỉnh, có biểu tượng (icon), có hỗ trợ tạo shortcut ngoài Desktop và chức năng tự động gỡ cài đặt (Uninstaller).

---

## 4. Quản Lý Cập Nhật Tự Động (OTA Updates)

Dự án có tích hợp tính năng tự động cập nhật phần mềm (Auto-Update) thông qua thư viện `electron-updater` liên kết trực tiếp với GitHub Releases.

**Quy trình tung ra bản cập nhật mới:**
1. Sửa số phiên bản (`version`) trong file `package.json` (ví dụ từ `1.1.5` lên `1.1.6`).
2. Code, Commit và Push code của bạn lên kho lưu trữ GitHub.
3. Tạo một **Release** mới trên GitHub với số phiên bản tương ứng.
4. Ứng dụng của người dùng sẽ tự động phát hiện phiên bản mới trong mục **Settings**, sau đó thông báo cho người dùng nhấn "Cập nhật và Khởi động lại".

---

## 5. Các Lệnh (Scripts) Quan Trọng

- `npm run dev`: Chạy server dev trên trình duyệt web (Phù hợp để thiết kế giao diện UI nhanh chóng).
- `npm run dev:electron`: Chạy server dev kết hợp mở cửa sổ Electron (Phù hợp để test các API truy cập file hệ thống, chức năng OS).
- `npm run build:electron`: Biên dịch mã nguồn và tạo ra file cài đặt (.exe).
- `npm run release`: Tự động biên dịch và tạo bản phân phối (release). 

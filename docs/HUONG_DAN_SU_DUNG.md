# Hướng Dẫn Sử Dụng Amnimo Test Runner

Chào mừng bạn đến với tài liệu hướng dẫn sử dụng **Amnimo Test Runner**. Tài liệu này được thiết kế dành cho người mới bắt đầu, giúp bạn hiểu rõ và có thể sử dụng ứng dụng một cách dễ dàng nhất, ngay cả khi bạn chưa từng biết đến dự án Amnimo trước đây.

---

## 1. Tổng Quan Về Amnimo Test Runner

**Amnimo Test Runner** là một ứng dụng Desktop (ứng dụng chạy trên máy tính) hiện đại, được xây dựng để giúp bạn quản lý và thực thi các bài kiểm thử tự động (End-to-End E2E tests) trên các thiết bị của Amnimo. 

**Các tính năng nổi bật:**
- **Quản lý đa phiên (Multi-session):** Cho phép bạn chạy nhiều bài kiểm thử cùng lúc. Mỗi phiên chạy hoàn toàn độc lập với nhau, không lo bị xung đột.
- **Theo dõi tiến độ theo thời gian thực (Real-time):** Bạn có thể xem trực tiếp số lượng bài test đã Pass (Thành công), Failed (Thất bại) hoặc Skipped (Bỏ qua) ngay trong lúc hệ thống đang chạy.
- **Quản lý Firmware:** Hỗ trợ tải xuống, tải lên và quản lý các bản firmware từ các máy chủ Staging (thử nghiệm) hoặc Production (thực tế) trực tiếp trên ứng dụng.
- **Quản lý Test Spec (Release Spec):** Hỗ trợ tạo, xem trước và quản lý các file thông số kiểm thử (Test Specifications) dưới dạng Excel, cũng như import kết quả test.
- **Giao diện hiện đại & Đa ngôn ngữ:** Hỗ trợ giao diện sáng sủa, mượt mà (hiệu ứng kính - glassmorphism) và có thể chuyển đổi giữa tiếng Anh (English) và tiếng Nhật (Japanese).

---

## 2. Cài Đặt & Khởi Chạy

### 2.1 Yêu Cầu Hệ Thống
Để chạy được Amnimo Test Runner, máy tính của bạn cần có:
- **Node.js:** Phiên bản 18.x trở lên.
- **Git:** Để tải mã nguồn.
- Đã tải (clone) mã nguồn chứa các bài test thực tế (thường là kho lưu trữ `amnimo-e2e`) trên máy tính của bạn.

### 2.2 Cài Đặt
Mở Terminal (Command Prompt hoặc PowerShell) và chạy các lệnh sau:

1. Tải mã nguồn ứng dụng:
   ```bash
   git clone https://github.com/edrixx95/amnimo-test-runer.git
   cd amnimo-test-runer
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```

### 2.3 Khởi Chạy Ứng Dụng
Bạn có 2 cách để mở ứng dụng trong quá trình phát triển:
- **Cách 1 - Chạy trên Trình duyệt Web (Web Mode):** Dùng lệnh `npm run dev`. Sau đó mở trình duyệt và truy cập `http://localhost:3000`.
- **Cách 2 - Chạy như một phần mềm Desktop (Electron App Mode):** Dùng lệnh `npm run dev:electron`. Ứng dụng sẽ mở lên như một cửa sổ phần mềm thực thụ trên máy tính của bạn.

---

## 3. Hướng Dẫn Sử Dụng Các Tính Năng Chính

Giao diện của ứng dụng được chia thành nhiều mục ở thanh điều hướng bên trái. Dưới đây là cách sử dụng từng mục.

### 3.1 Trang Chủ (Home / Sessions)
Đây là màn hình chính khi bạn mở ứng dụng, nơi quản lý toàn bộ các phiên kiểm thử (Sessions).

- **Tạo phiên mới (New Session):** 
  - Bấm vào nút **"+ New Session"** (hoặc Tạo Phiên Mới).
  - Điền tên phiên và cấu hình môi trường cần thiết.
  - Hệ thống sẽ tự động cấp phát một cổng (port) riêng biệt và bắt đầu thực thi bài test của bạn.
- **Theo dõi tiến độ:** Mỗi phiên sẽ hiển thị một thanh tiến trình (progress bar) và số lượng test cases đang chạy.
- **Xem báo cáo (Reports):** Sau khi test xong, bạn có thể bấm vào phiên đó để xem Báo cáo dữ liệu (Data Viewer) hoặc Báo cáo HTML trực quan.
- **Lọc & Tìm kiếm:** Bạn có thể tìm phiên theo Tên, Trạng thái (Running, Passed, Failed...) hoặc thiết bị.

### 3.2 Quản Lý Firmware (Firmware)
Mục này giúp bạn quản lý các tệp tin hệ thống (firmware) dành cho các thiết bị Amnimo.

- **Chọn Nguồn (Source):** Khi vào trang Firmware, bạn sẽ được chọn nguồn lấy dữ liệu là **Staging Server** (Máy chủ thử nghiệm) hoặc **Production Server** (Máy chủ thực tế).
- **Xem danh sách:** Ứng dụng sẽ hiển thị danh sách các phiên bản firmware, ngày tạo, kích thước file.
- **Lọc & Tìm kiếm:** Bạn có thể tìm firmware theo tên thiết bị (Board) hoặc sắp xếp theo ngày tháng mới nhất.
- **Tải mới/Cập nhật:** Có nút **Refresh** để làm mới danh sách.

### 3.3 Thông Số Kiểm Thử (Release Spec)
Đây là công cụ hỗ trợ cho việc quản lý các kịch bản test (Test Specifications).

- **Xem trước file (Preview):** Ứng dụng cho phép hiển thị trước nội dung file Excel chứa kịch bản test ngay trên giao diện (hiển thị 50 dòng đầu tiên của mỗi sheet).
- **Import Kết Quả (Import Test Results):** Cho phép bạn đẩy các kết quả test đã chạy xong vào file Spec để tự động điền trạng thái (Pass/Fail) vào báo cáo Excel.

### 3.4 Cài Đặt (Settings)
Nơi tùy chỉnh các cấu hình chung cho ứng dụng.

- **Ngôn ngữ (Language):** Chuyển đổi giao diện giữa **Tiếng Anh (English)** và **Tiếng Nhật (日本語)**.
- **Biến Môi Trường (Environment Variables):** Quản lý file `.env` chứa các thông tin cấu hình như IP thiết bị, mật khẩu, API keys,...
- **Cập nhật tự động (Auto-Updates):** Tại đây sẽ có thông báo nếu có phiên bản phần mềm mới. Bạn chỉ cần bấm cập nhật và ứng dụng sẽ tự khởi động lại.

---

## 4. Dữ Liệu Của Tôi Được Lưu Ở Đâu?
Bạn không cần lo lắng về việc mất lịch sử kiểm thử khi tắt ứng dụng hoặc cập nhật phiên bản mới. 
Tất cả các **Settings** và **Lịch sử Sessions** đều được lưu trữ an toàn trong thư mục Dữ liệu người dùng của Hệ điều hành (ví dụ: `AppData/Roaming` trên Windows).

# Khắc phục lỗi Xung đột IP 192.168.0.254 (Factory Reset Lock)

Tài liệu này cung cấp hướng dẫn cách lập trình trong thư mục dự án `amnimo-e2e` (Playwright) của bạn để gọi API Mutex Lock trên **Amnimo Test Runner** nhằm giải quyết lỗi xung đột IP khi reset thiết bị.

## Ý tưởng cốt lõi

1. Gửi request `POST /api/locks/acquire` để xin khóa `FACTORY_RESET` trước khi reset thiết bị.
2. Nếu thiết bị khác đang reset, script sẽ tự động bị hold/timeout cho đến khi đến lượt.
3. Chờ reset xong, truy cập thiết bị qua IP mặc định `192.168.0.254`.
4. Cấu hình lại thành IP riêng (ví dụ: `192.168.10.1`).
5. Cuối cùng, gọi `POST /api/locks/release` để trả khóa lại cho phiên khác.

---

## 1. Viết Lock Helper Utility trong `amnimo-e2e`

Trong thư mục code Playwright của bạn, tạo một file tên là `utils/lockManager.ts`:

```typescript
// amnimo-e2e/utils/lockManager.ts
import { request } from '@playwright/test';

// Lấy port của Test Runner từ ENV do Test Runner truyền sang
const RUNNER_URL = `http://127.0.0.1:${process.env.CLI_SERVER_PORT || 8765}`;
const SESSION_ID = process.env.SESSION_ID || 'unknown-session';

export async function acquireLock(resource: string, timeoutMs: number = 600000) { // Timeout 10 phút
  const context = await request.newContext();
  console.log(`[Lock] Vui lòng đợi, đang xin quyền ${resource}...`);
  
  const response = await context.post(`${RUNNER_URL}/api/locks/acquire`, {
    data: {
      resource,
      sessionId: SESSION_ID,
      timeoutMs
    }
  });

  if (!response.ok()) {
    throw new Error(`Failed to acquire lock for ${resource}. Test Runner returned ${response.status()}`);
  }
  console.log(`[Lock] Đã lấy quyền ${resource} thành công.`);
}

export async function releaseLock(resource: string) {
  const context = await request.newContext();
  const response = await context.post(`${RUNNER_URL}/api/locks/release`, {
    data: {
      resource,
      sessionId: SESSION_ID
    }
  });

  if (response.ok()) {
    console.log(`[Lock] Đã nhả quyền ${resource} thành công.`);
  } else {
    console.error(`[Lock] Lỗi khi nhả quyền ${resource}.`);
  }
}
```

---

## 2. Áp dụng vào Test Case Reset (Ví dụ: `simple-settings`)

Sử dụng `try/finally` để luôn đảm bảo nhả khóa dù test fail hay pass.

```typescript
// amnimo-e2e/tests/simple-settings.spec.ts
import { test, expect } from '@playwright/test';
import { acquireLock, releaseLock } from '../utils/lockManager';

// Lấy IP tĩnh của thiết bị từ ENV (Cái này Test Runner sẽ nạp tự động)
const TARGET_IP = process.env.BASE_URL ? new URL(process.env.BASE_URL).hostname : '192.168.10.1';

test('Factory Reset and Re-IP', async ({ page }) => {
  // 1. Xin quyền Lock trước khi click nút "工場初期化"
  await acquireLock('FACTORY_RESET');
  
  try {
    // 2. Đi tới màn hình Settings hiện tại và click Reset
    await page.goto('/settings');
    await page.getByRole('button', { name: '工場初期化' }).click();
    await page.getByRole('button', { name: '確認' }).click(); // Confirm dialog
    
    // Đợi thiết bị reboot
    await page.waitForTimeout(60000); // Đợi 60 giây
    
    // 3. Truy cập vào IP mặc định 192.168.0.254 (Vượt qua BASE_URL của Playwright)
    // Tạm thời tắt cơ chế chờ mạng (waitUntil) vì thiết bị mới boot
    await page.goto('http://192.168.0.254', { waitUntil: 'domcontentloaded' });
    
    // 4. Thực hiện các thao tác đăng nhập mặc định (root/amnimo)
    await page.fill('input[name="username"]', 'root');
    await page.fill('input[name="password"]', 'amnimo');
    await page.click('button[type="submit"]');
    
    // 5. Cấu hình IP tĩnh thành TARGET_IP
    await page.goto('http://192.168.0.254/network');
    await page.fill('input[name="ip_address"]', TARGET_IP);
    await page.click('button:has-text("適用")'); // Nút Apply
    
    // Đợi thiết bị apply IP mới
    await page.waitForTimeout(30000); 
    
    // 6. Quay trở về IP Gốc để test có thể tiếp tục bằng BASE_URL ban đầu
    await page.goto(`http://${TARGET_IP}`);
    await expect(page).toHaveURL(`http://${TARGET_IP}/login`);
    
  } finally {
    // 7. Nhả quyền Lock. QUAN TRỌNG: LUÔN NẰM TRONG `finally`
    await releaseLock('FACTORY_RESET');
  }
});
```

### Chú ý về mạng (Host PC Network)
Trên Windows của bạn, Card mạng LAN đang cắm vào các thiết bị phải được Add cả IP tĩnh `192.168.0.x` và các IP thuộc giải `TARGET_IP`. Bạn có thể Add nhiều IP bằng cách vào:
`Network Connections > Properties > IPv4 > Advanced > IP Addresses > Add`.

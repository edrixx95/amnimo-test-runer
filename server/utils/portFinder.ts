import net from 'node:net';

/**
 * Tìm một cổng mạng đang rảnh (chưa có ứng dụng nào dùng) trên máy tính.
 * @param startingAt Cổng bắt đầu quét (mặc định 8080)
 * @returns Promise trả về số cổng trống
 */
export function getAvailablePort(startingAt: number = 8080): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    
    server.on('error', (e: any) => {
      // Nếu cổng đã bị chiếm (EADDRINUSE), thử tiếp với cổng tiếp theo
      if (e.code === 'EADDRINUSE') {
        getAvailablePort(startingAt + 1).then(resolve).catch(reject);
      } else {
        reject(e);
      }
    });
    
    // Thử lắng nghe trên cổng hiện tại
    server.listen(startingAt, '127.0.0.1', () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => {
        resolve(port);
      });
    });
  });
}

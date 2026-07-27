import net from "node:net";

/**
 * コンピュータ上で利用可能な（他のアプリケーションで使用されていない）ネットワークポートを検索します。
 * @param startingAt スキャンを開始するポート番号 (デフォルトは 8080)
 * @returns 空いているポート番号を返す Promise
 */
export function getAvailablePort(startingAt: number = 8080): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();

    server.on("error", (e: unknown) => {
      // ポートが既に使用されている場合 (EADDRINUSE)、次のポートを試す
      if ((e as { response?: { status?: number }, statusCode?: number, message?: string, statusMessage?: string, code?: string }).code === "EADDRINUSE") {
        getAvailablePort(startingAt + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(e);
      }
    });

    // 現在のポートでリッスンを試みる
    server.listen(startingAt, "127.0.0.1", () => {
      const port = (server.address() as net.AddressInfo).port;
      server.close(() => {
        resolve(port);
      });
    });
  });
}

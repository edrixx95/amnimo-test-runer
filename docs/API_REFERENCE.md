# Amnimo Test Runner API リファレンス (API Reference)

本ドキュメントは、**Amnimo Test Runner** のバックエンド（Nitro Server）が提供する REST API / SSE ストリーム、および Electron の IPC インターフェースの技術仕様書です。

---

## 1. 共通仕様 (Overview)

- **ベースURL**: `http://127.0.0.1:8765`（Electron 実行時）または `http://localhost:3000`（Web 開発モード）
- **通信プロトコル**:
  - データ操作: REST (JSON)
  - リアルタイム通知: Server-Sent Events (SSE, `text/event-stream`)
- **エラーレスポンス形式**:
  ```json
  {
    "statusCode": 400,
    "statusMessage": "エラーメッセージ詳細",
    "data": null
  }
  ```

---

## 2. セッション API (`/api/sessions`)

| メソッド | パス | 説明 | リクエスト例 / パラメータ |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/sessions` | 保存されているセッション一覧を取得 | なし |
| `POST` | `/api/sessions` | 新規セッションを作成 | `{ "name": "AG10-Release-v3.8" }` |
| `GET` | `/api/sessions/:id` | 特定セッションの詳細・設定を取得 | パスパラメータ: `id` |
| `PUT` | `/api/sessions/:id` | セッション設定（`.env`、board、testType 等）を更新 | `{ "board": "AX30", "envContent": "..." }` |
| `DELETE` | `/api/sessions/:id` | セッションおよび関連データを削除 | パスパラメータ: `id` |
| `POST` | `/api/sessions/:id/close` | セッションをクローズ（排他ロック全解放、完了マーク） | パスパラメータ: `id` |
| `GET` | `/api/sessions/:id/reports` | セッション実行中に生成された HTML/JSON レポート一覧を取得 | パスパラメータ: `id` |
| `GET` | `/api/sessions/:id/aggregated-report` | セッション内の全テスト結果を集計した JSON を取得 | パスパラメータ: `id` |
| `GET` | `/api/sessions/:id/download-aggregated-report` | 規定フォーマットに整形した集計レポートを JSON ファイルとしてダウンロード | Content-Disposition による添付ダウンロード |

---

## 3. テスト実行・スキャン API (`/api/tests`)

| メソッド | パス | 説明 | リクエスト例 / パラメータ |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tests/files` | テストファイルツリー（階層構造）を取得 | `?type=release` または `?type=system-test` |
| `POST` | `/api/tests/files/refresh` | テストツリーを強制再走査しキャッシュを更新 | `?type=release` |
| `GET` | `/api/tests/cases` | 指定したテストファイル内の個別ケース一覧を取得 | `?type=release&targetPath=network/interface` |
| `GET` | `/api/tests/orders` | 定義済み実行順序ファイル（`test-order/*.json`）一覧を取得 | `?type=release` |
| `POST` | `/api/tests/run` | Playwright テストプロセスを起動 | `{ "sessionId": "xxx", "mode": "single", "tests": [...] }` |
| `POST` | `/api/tests/stop` | 実行中のテストプロセスを停止 (SIGTERM) | `{ "sessionId": "xxx" }` |
| `GET` | `/api/tests/stream` | **SSE**: ログ出力・進捗カウント（Pass/Fail）をリアルタイム購読 | `?sessionId=xxx` (`text/event-stream`) |

### `POST /api/tests/run` リクエストボディ仕様:
```json
{
  "sessionId": "session-20260907-xxxx",
  "mode": "single", // "single" (個別選択) または "order" (順序定義)
  "tests": [
    "network/interface/interface.spec.ts"
  ]
}
```

---

## 4. デバイスプロキシ＆周辺機器検証 API (`/api/proxy`, `/api/network`)

ゲートウェイ実機の Web GUI は自己署名証明書（HTTPS）や CORS 制限があるため、Nitro サーバーがプロキシとしてリクエストを中継・検証します。

| メソッド | パス | 説明 | 主なパラメータ |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/network/ping` | ターゲット IP または URL への疎通確認 | `{ "targetUrl": "https://192.168.0.254" }` |
| `POST` | `/api/proxy/device/information` | ゲートウェイの機種名・シリアル・FWバージョン取得 | `{ "targetUrl": "..." }` |
| `POST` | `/api/proxy/device/mobile` | SIMカードの装着状況（Slot 0 / Slot 1）を確認 | `{ "targetUrl": "..." }` |
| `POST` | `/api/proxy/device/storage/partitions` | 接続ストレージ（USB / SDカード / NVMe）の認識確認 | `{ "targetUrl": "..." }` |
| `POST` | `/api/proxy/device/poe` | PoE カメラ給電ポート（LAN1〜4）のリンク状態確認 | `{ "targetUrl": "..." }` |
| `POST` | `/api/proxy/device/dhcp-partner` | 対向 DHCP Partner GW の疎通・DHCP 有効化確認 | `{ "targetUrl": "...", "dhcpClientIp": "..." }` |
| `POST` | `/api/proxy/device/startup-check` | 初期起動チェック総合確認 | `{ "targetUrl": "..." }` |
| `POST` | `/api/proxy/configs/nxwitness-setup` | Nx Witness サーバー設定の自動適用 | `{ "targetUrl": "..." }` |
| `POST` | `/api/proxy/configs/nxwitness-register` | Nx Witness へのカメラ登録処理 | `{ "targetUrl": "..." }` |

---

## 5. デバイス排他ロック API (`/api/locks`)

同一ゲートウェイ実機へのテスト重複実行を防止する排他制御システムです。

| メソッド | パス | 説明 | パラメータ |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/locks/acquire` | リソース（IPアドレス/ホスト名）の排他ロックを取得 | `{ "resource": "192.168.0.254", "sessionId": "xxx", "sessionName": "..." }` |
| `POST` | `/api/locks/release` | 保持しているロックを解放 | `{ "resource": "192.168.0.254", "sessionId": "xxx", "force": false }` |
| `GET` | `/api/locks/status` | 現在取得されている全ロック一覧を取得 | なし |
| `GET` | `/api/locks/stream` | **SSE**: ロック取得・解放のイベントストリームを購読 | `initial_state`, `lock_acquired`, `lock_released` イベント |

---

## 6. ファームウェア管理 API (`/api/firmware`, `/api/firmwares`)

| メソッド | パス | 説明 | 用途 |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/firmwares` | ローカルに存在する FW パッケージ一覧 | セットアップ時の FW 選択ドロップダウン |
| `GET` | `/api/firmwares/external` | Staging / Production サーバー上の FW 一覧 | ファームウェア管理画面での比較・一覧表示 |
| `GET` | `/api/firmwares/download` | 外部サーバーからローカルへ FW をダウンロード | ファームウェア管理画面からのダウンロード |
| `GET` | `/api/firmware/status` | セッション用の事前配置 FW 状態確認 | Setup 画面での FW 準備チェック |
| `POST` | `/api/firmware/upload` | ブラウザからローカルへ FW を直接アップロード | Setup 画面でのローカル追加 |
| `POST` | `/api/firmware/copy` | ローカルの別フォルダからセッション環境へコピー | ファイルサーバーとの同期 |
| `POST` | `/api/firmware/copy-from-server`| ファイルサーバーからセッション環境へ直接同期 | 自動準備ボタン |

---

## 7. 試験仕様書（Release Spec）API (`/api/spec`)

| メソッド | パス | 説明 | パラメータ |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/spec/list` | 生成済み試験仕様書（Excel）一覧 | なし |
| `GET` | `/api/spec/preview` | 仕様書またはテンプレートの各シート先頭行をプレビュー | `?file=AX30_リリーステスト_試験仕様書.xlsx` |
| `POST` | `/api/spec/generate` | セッションのテスト結果を集計し、公式仕様書 Excel へ転記出力 | `{ "sessionIds": ["sess-1", "sess-2"], "testerName": "担当者名" }` |
| `DELETE` | `/api/spec/delete` | 生成済み仕様書ファイルを削除 | `{ "fileName": "..." }` |

---

## 8. システム＆ユーティリティ API (`/api/settings`, `/api/utils`)

| メソッド | パス | 説明 | パラメータ |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/settings` | 現在のアプリ共通設定を取得 | なし |
| `PUT` | `/api/settings` | アプリ共通設定（E2Eパス、ポート番号）を更新 | `{ "e2ePath": "C:\\amnimo\\amnimo-e2e", ... }` |
| `POST` | `/api/settings/validate` | 指定されたパスに `amnimo-e2e` が存在するか検証 | `{ "path": "..." }` |
| `GET` | `/api/utils/list-dir` | 指定ディレクトリのサブフォルダ/ファイルを一覧取得 | `FolderPickerDialog.vue` で使用 |
| `POST` | `/api/utils/save-file` | 指定パスにファイルを保存 | `{ "filePath": "...", "content": "..." }` |
| `GET` | `/api/utils/available-ports` | 現在ローカルマシンで未使用のポート番号リストを取得 | `CLI_SERVER_PORT` 決定用 |
| `GET` | `/api/local/netstat` | Windows の `netstat -ano` を解析し、ポート占有プロセスを調査 | ポート競合診断 |
| `GET` | `/api/backup/export` | 全セッション＆設定を Zip 圧縮してダウンロード | 設定のバックアップ |
| `POST` | `/api/backup/import` | Zip アーカイブからセッション＆設定を復元 | 設定のリストア |

---

## 9. Electron IPC インターフェース (`electronAPI`)

レンダラープロセス（Vue 3）から `window.electronAPI` を介して呼び出せるネイティブ機能です（`electron/preload.js` で定義）。

```typescript
export interface ElectronAPI {
  // アプリバージョン取得
  getAppVersion: () => Promise<string>;

  // OTA 自動アップデート
  checkForUpdates: () => void;
  installUpdate: () => void;
  onUpdateStatus: (callback: (status: UpdateStatus) => void) => void;
  removeUpdateStatusListener: () => void;

  // ダウンロード進捗通知
  onDownloadProgress: (callback: (data: DownloadProgress) => void) => void;
  onDownloadComplete: (callback: (data: DownloadComplete) => void) => void;
  removeDownloadListeners: () => void;
}
```

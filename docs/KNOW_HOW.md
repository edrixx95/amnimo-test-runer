# Amnimo Test Runner ノウハウ集＆トラブルシューティング (Know-How & Troubleshooting)

本ドキュメントは、**Amnimo Test Runner** を運用・保守・拡張するにあたって遭遇しやすい問題の対処法、実践的なノウハウ、および新規ボード（機種）追加の手順書です。

---

## 1. よくあるトラブルシューティング (Troubleshooting)

### 1.1 `amnimo-e2e` のパス設定エラー
- **現象**: セッションの Setup 画面でテストケース一覧が表示されない、または「E2E directory not found」とエラーになる。
- **原因**:
  - [Settings] で指定した `amnimo-e2e` パスが存在しないか、Playwright のテストフォルダ構成が期待される構造と異なっている。
- **確認・対処法**:
  1. [Settings] 画面でパスが正しいか確認（緑色のチェックアイコンが出ているか）。
  2. `amnimo-e2e` 直下に以下の構成が存在することを確認:
     ```text
     amnimo-e2e/
     ├── playwright/
     │   └── tests/
     │       ├── release/
     │       └── system-test/
     └── package.json
     ```
  3. `amnimo-e2e` 内で `npm install` および `npx playwright install` が実行済みか確認。

---

### 1.2 ポート競合エラー (Port In Use)
- **現象**: テスト起動時に「Port already in use」エラーが発生するか、プロセスが即座に異常終了する。
- **原因**:
  - **Nitro Server ポート (8765)**: 前回の Electron プロセスがタスクマネージャーに残存している。
  - **セッション用 CLI ポート (`CLI_SERVER_PORT`)**: 別のセッションまたは別の開発サーバーが同じポートを使用している。
- **対処法**:
  1. **ポート 8765 のプロセスをキル**:
     ```powershell
     # ポートを占有している PID を特定
     netstat -ano | findstr 8765
     # プロセスを強制終了
     taskkill /F /PID <PID>
     ```
  2. **セッションポートの変更**:
     - セッションの Setup 画面（Step 3: Environment Variables）で、`CLI_SERVER_PORT` を未使用のポート（例: `3100`, `3101`, `3102`...）に再選択してください。

---

### 1.3 デバイスが「Locked」のまま解除されない
- **現象**: 以前のテストが異常終了した等の理由で、ターゲットデバイスの IP（例: `192.168.0.254`）がロックされたままになり、新しいセッションでテストを開始できない。
- **原因**:
  - Playwright プロセスが強制終了（クラッシュ）した際に、`processManager` による自動ロック解放フックが通過しなかった。
- **対処法**:
  1. **UI からの解除**:
     - 画面左下の「Notifications」（ベルマーク）をクリックし、ロック履歴モーダルを開いて該当セッションを特定後、該当セッションをクローズ（Finish / Close）する。
  2. **アプリの再起動**:
     - `lockManager` はメモリ上の Map でロックを管理しているため、アプリ（Electron）を再起動すると全ロックがクリーンに初期化されます。
  3. **API による強制解除**:
     - 開発時であれば、以下のリクエストを送信して強制解除可能です:
       ```bash
       curl -X POST http://localhost:8765/api/locks/release \
         -H "Content-Type: application/json" \
         -d '{"resource": "192.168.0.254", "sessionId": "", "force": true}'
       ```

---

### 1.4 Windows 環境におけるパス区切り文字（`\` と `/`）問題
- **現象**: テストファイルの指定が Playwright 側にうまく認識されず、0 tests passed となる。
- **原因**:
  - Windows ではパス区切りにバックスラッシュ（`\`）が使われますが、Playwright CLI や glob パターンはスラッシュ（`/`）を期待します。
- **実装上のルール**:
  - パスを文字列操作・API送信する際は、必ず `.replace(/\\/g, "/")` で正規化してください。
  - `path.resolve()` 等で生成した絶対パスも、Playwright 引数に渡す直前にスラッシュ形式に統一しています。

---

### 1.5 Excel 試験仕様書の転記がズレる / エラーになる
- **現象**: `spec/generate` で「No tests found」または特定シートの行番号が合わない。
- **原因**:
  - `spec-manager/template/リリーステスト_試験仕様書.xlsx` のシート名や列位置が変更された。
- **コードとの対応関係**:
  - `server/api/spec/generate.post.ts` では以下の列番号（1-indexed）を前提としています:
    - **列 2 (B列)**: Test ID（例: `GUI_NETWORK_001`）
    - **列 10 (J列)**: 結果（`Pass` / `Fail` / `Skip`）
    - **列 12 (L列)**: テスト対象機番・シリアル
    - **列 13 (M列)**: 試験実施者（Tester Name）
    - **列 14 (N列)**: 実施日
    - **列 15 (O列)**: ファームウェアバージョン
  - テンプレートの書式を改訂した場合は、`generate.post.ts` の列マッピングも合わせて更新してください。

---

### 1.6 Git 管理において `/sessions/` の指定を維持する重要性
- **注意点**:
  - `.gitignore` で `sessions` と書いてしまうと、Git の仕様上、パスのどこかに `sessions` を含むフォルダ（`app/composables/sessions/` や `server/api/sessions/...`）まで一括で除外されてしまいます。
  - **必ずルート指定の `/sessions/`** と記述してください。

---

## 2. 新しいボード（機種）を追加する手順 (Adding a New Board)

今後、新しい Amnimo ゲートウェイ製品（例: `AX40` や `AG30` 等）が開発され、Test Runner で扱えるようにする際の手順です。

### ステップ 1: 定数定義の追加 (`shared/constants/index.ts`)
```typescript
// 1. ボード一覧に追加
export const BOARDS = {
  G: ["AG10", "AG20", "AG30"], // 追加
  X: ["AX11", "AX12", "AX21", "AX30", "AX40"], // 追加
  R: ["AR10", "AR20"],
  C: ["AC10", "AC15", "AC25"],
} as const;

// 2. 派生タイプ（Type A, B 等）がある場合は DEVICE_TYPES に定義
export const DEVICE_TYPES: Record<string, string[]> = {
  AX40: ["A", "B"],
  // ...
};

// 3. チェックリストの定義 (CHECKLISTS)
// 対象機種に必要なハードウェアチェック（SIM、ストレージ、PoE等）を定義
export const CHECKLISTS = {
  // ...
  "AX40": {
    peripherals: [
      { id: "sim", label: "SIM", icon: "heroicons:credit-card" },
      { id: "usb", label: "Storage Device", icon: "heroicons:archive-box" },
      { id: "poe_camera", label: "PoE Camera", icon: "heroicons:video-camera" },
    ],
    partners: [],
    manual: [ ... ]
  }
};

// 4. ファームウェアのプレフィックス判定関数を更新
export const getFirmwarePrefix = (board: string): string => {
  const b = board.toLowerCase();
  if (b === "ax40") return "ax40";
  // ...
};
```

### ステップ 2: ボードアイコンの配置 (`public/icons/boards/`)
- ボードの外観画像（PNG形式）を配置します:
  `public/icons/boards/AX40.png`
- Setup 画面のボード選択カルーセルで自動的にこの画像が読み込まれます。

### ステップ 3: ストレージ検証ロジックの追加 (`app/components/peripherals/PeripheralStorageCheck.vue`)
- 新機種の内蔵ストレージ（NVMe / eMMC / SATA）や SD カード、USB ドライブの Linux デバイス名（`sda`, `nvme0n1`, `mmcblk1` 等）の正規表現を `expectedDevices` に追加します。

```typescript
} else if (["AX40"].includes(b)) {
  return [
    {
      id: "internal",
      name: t("peripheralStorageCheck.internalStorage"),
      regex: /^nvme0n1$/,
      icon: IconInternalStorage,
    },
    {
      id: "usb",
      name: t("peripheralStorageCheck.usbDrive"),
      regex: /^sda$/,
      icon: IconUsb,
    }
  ];
}
```

### ステップ 4: 試験仕様書テンプレートへの反映
- `spec-manager/template/リリーステスト_試験仕様書.xlsx` の `progress` シートまたは各シートの機番マッピングに新機種名を追加します。

---

## 3. 将来の機能拡張時のベストプラクティス

1. **新しい周辺機器チェックの追加**:
   - `app/components/peripherals/` に `PeripheralXxxCheck.vue` を作成します。
   - `setup.vue` および `usePeripheralChecklist.ts` に項目を追加します。
   - すべてのチェック項目が `isFullyConnected === true` になった時のみ、テスト実行への進行ボタン（Go to Runner）が有効化される規約を遵守してください。
2. **REST API の新規追加**:
   - `server/api/` にファイルベースルーティング（例: `server/api/devices/reboot.post.ts`）で作成します。
   - すべてのエンドポイントは `defineEventHandler` を使用し、バリデーションには `zod` を活用してください。
3. **Electron IPC の拡張**:
   - レンダラーから直接 Node.js のコアモジュール（`fs`, `child_process`）を叩くのはセキュリティ上禁止されています。
   - 必ず `electron/preload.js` でホワイトリスト化したメソッドのみを `contextBridge.exposeInMainWorld` で公開してください。

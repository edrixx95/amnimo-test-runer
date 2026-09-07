# Amnimo Test Runner 開発者ガイド (Developer Guide)

本ドキュメントは、**Amnimo Test Runner** の開発環境のセットアップ、実行モード、ディレクトリ構成、コーディング規約、およびビルド・配布・OTAアップデートの手順をまとめた開発者向け完全引継ぎガイドです。

---

## 1. 動作環境と前提条件 (Prerequisites)

本アプリケーションを開発・ビルドするには、以下の環境が必要です。

- **OS**: Windows 10 / 11（推奨。デバイスとのローカルネットワーク検証、PowerShellスクリプト連携、およびNSISインストーラ生成のため）
- **Node.js**: v18.18.0 以上（v20.x / v22.x LTS 推奨）
- **パッケージマネージャー**: `npm`（v9.x 以上）
- **Git**: バージョン管理用
- **外部依存リポジトリ (`amnimo-e2e`)**:
  - Test Runner は単体でテストスクリプトを抱えておらず、**`amnimo-e2e`** リポジトリ（Playwright E2Eテストプロジェクト）を読み込んで実行します。
  - ローカルマシン上の任意のパス（例: `C:\amnimo\amnimo-e2e`）にクローンし、依存パッケージ（`npm install` および `npx playwright install`）のインストールを完了させておく必要があります。

---

## 2. 開発環境のセットアップ手順

### 2.1 リポジトリの取得と依存関係インストール
```powershell
# リポジトリのクローン
git clone https://github.com/edrixx95/amnimo-test-runer.git
cd amnimo-test-runer

# 依存パッケージのインストール
npm install
```

### 2.2 初回起動時の E2E パス設定
アプリ起動時、テストコードが格納された `amnimo-e2e` ディレクトリのパス設定が求められます。
- UI 上の初期設定モーダル（Initial Setup Modal）または [設定]（`/settings`）画面から、`amnimo-e2e` の絶対パスを指定します。
- この設定は OS のユーザデータ領域（Windows では `%APPDATA%/amnimo-test-runner/settings.json`、開発環境ではプロジェクト直下の `settings.json`）に永続化されます。

---

## 3. 実行モードとコマンド解説 (Run Scripts)

`package.json` に定義されている主要スクリプトの役割と内部動作の違いです。

```json
"scripts": {
  "build": "nuxt build",
  "dev": "nuxt dev",
  "generate": "nuxt generate",
  "preview": "nuxt preview",
  "postinstall": "nuxt prepare",
  "dev:electron": "nuxt build && electron .",
  "build:electron": "nuxt build && electron-builder",
  "release": "nuxt build && electron-builder --publish always"
}
```

### 3.1 `npm run dev` (Web開発モード)
- **動作**: Nuxt の開発サーバーを起動し、ブラウザ（`http://localhost:3000`）でアプリを動作させます。
- **用途**: 画面 UI、Tailwind CSS スタイル調整、API エンドポイントの基本ロジックを高速にプレビュー・反復開発する際に最適です（HMR: Hot Module Replacement 有効）。
- **注意点**: `window.electronAPI`（Electron のネイティブ機能）は未定義となるため、Electron 固有の処理（バージョン取得や OTA 更新確認）はモック/スキップされます。

### 3.2 `npm run dev:electron` (デスクトップ動作確認モード)
- **動作**: 一度 `nuxt build` を実行して `.output` に Nitro サーバーとクライアント静的ファイルを生成した上で、Electron メインプロセス（`electron .`）を起動します。
- **用途**: デスクトップアプリとしてのネイティブ動作（スプラッシュ画面、ウィンドウ制御、IPC通信）を含めた統合テスト時に使用します。

### 3.3 `npm run build:electron` (Windows インストーラ生成)
- **動作**: Nuxt のプロダクションビルド後、`electron-builder` を起動して Windows 用のセットアップインストーラ（`.exe`）を生成します。
- **出力先**: `dist-electron/Amnimo Test Runner <version> Setup.exe`

### 3.4 `npm run release` (GitHub Releases 公開ビルド)
- **動作**: ビルド完了後、GitHub Releases にバイナリ（`.exe`）および更新メタデータ（`latest.yml`）を直接アップロード公開します（`GITHUB_TOKEN` 環境変数が必要）。

---

## 4. プロジェクトのディレクトリ構成と責務

Nuxt 4 / Vue 3 のモダンな推奨構造に準拠しています。

```text
amnimo-test-runer/
├── app/                          # フロントエンド (Nuxt / Vue 3)
│   ├── app.vue                   # ルートコンポーネント (Toast, UpdateNotifier, Tour スタイル)
│   ├── components/               # ドメイン分割された UI コンポーネント
│   │   ├── forms/                # フォーム関連 (EnvEditor.vue)
│   │   ├── icons/                # ハードウェアアイコン (IconInternalStorage, IconSdCard, IconUsb)
│   │   ├── manual/               # アプリ内マニュアルコンポーネント (InitialSetup, Sessions, etc.)
│   │   ├── modals/               # 各種モーダル (ConfirmModal, FolderPickerDialog, ReportModal)
│   │   ├── peripherals/          # ハードウェア周辺環境チェックコンポーネント
│   │   │   ├── PeripheralDhcpCheck.vue
│   │   │   ├── PeripheralNxWitnessCheck.vue
│   │   │   ├── PeripheralPoeCheck.vue
│   │   │   ├── PeripheralSimCheck.vue
│   │   │   └── PeripheralStorageCheck.vue
│   │   ├── runner/               # テスト実行画面関連 (ExcelJsonViewer, FileTree, HtmlReportViewer, TestProgress)
│   │   └── ui/                   # 共通UI (AmnimoLogo, AppLoader, AppSpinner, BaseToast, SimIcon)
│   ├── composables/              # リアクティブなビジネスロジック (Composition API)
│   │   ├── env/                  # useEnvEditor.ts
│   │   ├── firmware/             # useFirmwareManager.ts
│   │   ├── peripherals/          # useNetworkCheck.ts, usePeripheralChecklist.ts
│   │   ├── session/              # useSessionStore.ts (Pinia ストア)
│   │   ├── sessions/             # セッション一覧・作成・セットアップ制御
│   │   │   ├── useSessionList.ts
│   │   │   ├── useSessionActions.ts
│   │   │   ├── useSessionSetup.ts
│   │   │   ├── useSessionEnvTemplate.ts
│   │   │   └── useReportViewers.ts
│   │   ├── ui/                   # useConfirmModal.ts
│   │   ├── useLocks.ts           # デバイス排他ロック状態の購読 (SSE)
│   │   └── useToast.ts           # グローバルトースト通知
│   ├── layouts/                  # レイアウト (default.vue - サイドバー、ナビゲーション、ダウンロード進捗)
│   └── pages/                    # ページルーティング (Nuxt File-based Routing)
│       ├── index.vue             # セッション一覧ダッシュボード
│       ├── firmware.vue          # ファームウェア管理画面
│       ├── release-spec.vue      # リリーステスト試験仕様書管理画面
│       ├── manual.vue            # 操作マニュアル画面
│       ├── settings/             # 設定画面 (index.vue - E2Eパス, バックアップ, OTA更新)
│       └── sessions/[id]/
│           ├── setup.vue         # セッション環境設定・周辺機器チェック
│           └── runner.vue        # テスト実行・ログ・リアルタイム進捗
│
├── electron/                     # Electron メインプロセス
│   ├── main.mjs                  # メインプロセスエントリ (Nitro 内部サーバー起動, Window 管理, autoUpdater)
│   ├── preload.js                # レンダラーへの安全な IPC API 公開 (contextBridge)
│   └── splash.html               # アプリ起動時に表示するスプラッシュ画面
│
├── server/                       # バックエンド (Nitro Server エンジン)
│   ├── api/                      # REST / SSE エンドポイント
│   │   ├── backup/               # 設定・セッションの Zip エクスポート / インポート
│   │   ├── firmware/             # セッション固有のファームウェア操作 (upload, copy, download, status)
│   │   ├── firmwares/            # グローバルなファームウェア管理 (external, download)
│   │   ├── iis/                  # 稼働中 IIS サーバー一覧取得
│   │   ├── local/netstat.get.ts  # 端末のポート使用状況 (netstat 解析)
│   │   ├── locks/                # デバイス排他ロック API (acquire, release, status, stream)
│   │   ├── network/ping.post.ts  # ゲートウェイ/外部 IP への Ping 疎通確認
│   │   ├── proxy/                # ゲートウェイ実機への REST API プロキシ (CORS/認証回避)
│   │   │   ├── device/           # /information, /storage, /poe, /mobile, /dhcp-partner, /startup-check
│   │   │   └── configs/          # Nx Witness 設定・カメラ登録
│   │   ├── reports/              # HTML レポート配信、削除
│   │   ├── sessions/             # セッション CRUD、集計レポート、クローズ
│   │   ├── settings/             # アプリ基本設定 (e2ePath, ports, serverUrl)
│   │   ├── spec/                 # 試験仕様書 Excel 生成、プレビュー、一覧
│   │   ├── tests/                # テストツリー取得 (AST), オーダー, 実行, 停止, SSEストリーム
│   │   └── utils/                # ディレクトリブラウズ, ファイル保存, 利用可能ポート探索
│   ├── data/                     # テストケースツリーの静的キャッシュ JSON
│   └── utils/                    # サーバー共通ユーティリティ
│       ├── liveProgressParser.ts # Playwright 出力ログのリアルタイムパース
│       ├── lockManager.ts        # デバイス排他ロック管理シングルトン
│       ├── portFinder.ts         # 未使用ポート探索
│       ├── processManager.ts     # 子プロセスの実行・監視・キル
│       ├── reportUtils.ts        # レポート集計 & Trace Viewer パス解決
│       ├── sessionManager.ts     # セッションファイル読み書き
│       ├── settingsManager.ts    # 設定ファイル読み書き
│       └── testScanner.ts        # Playwright spec ファイルの走査・階層ソート
│
├── spec-manager/                 # 試験仕様書テンプレート
│   └── template/
│       └── リリーステスト_試験仕様書.xlsx # 公式 Excel テンプレート
│
├── shared/                       # フロントエンド・バックエンド共用定義
│   ├── constants/index.ts        # 対象ボード (BOARDS), チェックリスト, セッションステータス
│   └── types/index.ts            # Session, FileNode, TestOrder 等の型定義
│
├── i18n/                         # 国際化リソース (英語: en.json, 日本語: ja.json)
├── build/                        # インストーラ用リソース (icon.ico, installerSidebar.bmp 等)
├── nuxt.config.ts                # Nuxt 設定ファイル
└── package.json                  # パッケージ構成
```

---

## 5. コーディング規約と開発ルール

本プロジェクトでは、保守性と可読性を最大化するため、以下のルールを徹底してください。

1. **Vue 3 Composition API & TypeScript**:
   - すべての Vue コンポーネントは `<script setup lang="ts">` で記述します。
   - 型定義には `any` の使用を避け、`shared/types/index.ts` の型をインポートして利用します。
2. **リアクティブステートの使い分け**:
   - 単一のプリミティブ値（string, number, boolean）: `ref()`
   - 複雑なオブジェクト、フォームデータ: `reactive()`
   - 他のステートから算出される派生データ: 必ず `computed()` を使用
   - Boolean 変数の命名: `isLoading`, `hasError`, `isTesting` などの助動詞プレフィックスを付与
3. **スタイリング (Tailwind CSS)**:
   - スタイリングは Tailwind CSS のクラスを直接記述します（スコープ付き CSS や `@apply` の乱用は禁止）。
   - アイコンは Iconify 標準の `@nuxt/icon`（例: `heroicons:queue-list`）を使用します。
4. **国際化 (i18n)**:
   - 画面上のテキストはハードコードせず、`$t("key.path")` または `t("key.path")` を使用します。
   - 新規テキストを追加する場合は、必ず `i18n/locales/en.json` と `i18n/locales/ja.json` の両方に定義してください。
5. **Git 管理規約**:
   - `.gitignore` のセッション無視設定は必ず **`/sessions/`**（ルート指定）とし、`app/composables/sessions/` などのソースコードが誤って無視されないように注意してください。

---

## 6. ビルド・パッケージング・配布手順 (Packaging & Distribution)

### 6.1 インストーラの生成
```powershell
npm run build:electron
```
実行すると以下の処理が自動で行われます:
1. `nuxt build` が実行され、`.output/` にサーバーとクライアントのアセットがコンパイルされます。
2. `electron-builder` が起動し、`package.json` の `build` 設定に従って NSIS インストーラがビルドされます。
3. `dist-electron/Amnimo Test Runner <version> Setup.exe` が生成されます。

### 6.2 バージョンアップと OTA 自動更新 (Auto-Update)
本アプリは `electron-updater` による自動更新に対応しています。

1. **バージョン更新**:
   - `package.json` の `"version"`（例: `"1.2.2"` $\rightarrow$ `"1.2.3"`）をインクリメントします。
2. **Git コミット＆プッシュ**:
   ```powershell
   git add package.json
   git commit -m "chore: bump version to 1.2.3"
   git push origin main
   ```
3. **GitHub Release 作成**:
   - GitHub 上でタグ `v1.2.3` を作成し、Release を公開します。
   - `dist-electron/` に生成された `.exe` および `latest.yml` を添付します（または `npm run release` で自動公開）。
4. **クライアント側の動作**:
   - ユーザーがアプリを起動すると、バックグラウンドで GitHub の最新リリースをチェックします。
   - 新バージョンが存在する場合、自動ダウンロードが行われ、完了後に「再起動してインストール」のトーストが表示されます。

---

## 7. 後任開発者への引継ぎチェックリスト (Handover Checklist)

引き継ぎ後に最初に確認すべき実機動作確認項目です。

- [ ] Node.js (v18+) がインストールされており、`npm install` がエラーなく通ること。
- [ ] `npm run build` を実行し、TypeScript / Nitro ビルドが正常終了（Exit Code 0）すること。
- [ ] `npm run dev:electron` でアプリがデスクトップウィンドウとして起動すること。
- [ ] [Settings] でローカルの `amnimo-e2e` フォルダが正しく設定され、緑色のチェックが表示されること。
- [ ] テストセッションを 1 つ作成し、Setup 画面でターゲットボード（例: AX30）を選択して `.env` が自動生成されること。
- [ ] ターゲットデバイスの IP 宛てに Ping 疎通確認が成功すること。

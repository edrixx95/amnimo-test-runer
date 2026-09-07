<div align="center">
  <img src="build/icon.ico" width="100" height="100" alt="Amnimo Test Runner Logo">
  <h1>Amnimo Test Runner</h1>
  <p>モダンで高機能なマルチセッション対応 E2E テスト実行デスクトップアプリケーション</p>
</div>

---

> 📖 **開発者向けドキュメント (Developer Guides)**:  
> 本プロジェクトの引き継ぎ資料、アーキテクチャ詳細、APIリファレンス、およびノウハウ集は [docs/README.md](./docs/README.md) に体系化されています。
> - [📘 開発者ガイド (Developer Guide)](./docs/DEVELOPER_GUIDE.md)
> - [🏛️ アーキテクチャ詳細 (Architecture Deep Dive)](./docs/ARCHITECTURE.md)
> - [🔌 APIリファレンス (API Reference)](./docs/API_REFERENCE.md)
> - [💡 ノウハウ集＆トラブルシューティング (Know-How & Troubleshooting)](./docs/KNOW_HOW.md)

---

## 📖 概要 (Overview)

**Amnimo Test Runner** は、Nuxt 4、Vue 3、および Electron で構築されたデスクトップアプリケーションです。アムニモ（Amnimo）デバイスを対象とした End-to-End（E2E）テストを統合管理・実行するための包括的なダッシュボードを提供します。ユーザーは直感的で洗練された UI を通じて、複数のテストセッションの並列実行、デバイスファームウェアの管理、テスト環境変数の設定、リアルタイムなテスト進捗トラッキングなどを簡単に行うことができます。

## ✨ 主な機能 (Features)

- **マルチセッション並列管理**: 複数の E2E テストセッションを同時に並行して実行可能。各セッションは動的に割り当てられた専用ポートと独立したプロセスで完全に分離して動作します。
- **リアルタイム進捗トラッキング**: テストの実行状況をライブで監視。テストランナーの進行に伴い、Passed（成功）、Failed（失敗）、Skipped（スキップ）のテスト件数やログがリアルタイムに更新されます。
- **ファームウェア管理**: ローカルおよび外部/本番のファームウェアパッケージを一括管理。アプリ内から直接ファームウェアアセットのダウンロード、アップロード、追跡を行えます。
- **データの永続化**: 各種設定およびセッションデータは OS の User Data ディレクトリ（例: `AppData/Roaming`）に安全に保存されるため、アプリのバージョン更新時にもテストレポートやセッション履歴が保持されます。
- **多言語対応 (i18n)**: **英語 (en)** および **日本語 (ja)** の 2 言語に完全対応。
- **自動アップデート**: `electron-updater` を使用し、GitHub Releases と連携したシームレスな自動 OTA（Over-The-Air）アップデートに対応。
- **直感的なテスト環境設定**: 各テストセッションで使用する環境変数（`.env`）を UI から簡単に設定・調整可能。
- **モダンで洗練された UI**: Tailwind CSS を活用したグラスモーフィズムデザインの美しく操作性の高いインターフェース。

## 🛠 技術スタック (Tech Stack)

- **フレームワーク**: Nuxt 4 (Nitro Server 搭載)
- **フロントエンド**: Vue 3 (Composition API)、Pinia (状態管理)、VueUse
- **スタイリング**: Tailwind CSS
- **デスクトップラッパー**: Electron
- **パッケージング**: electron-builder
- **国際化 (i18n)**: `@nuxtjs/i18n`

---

## 🚀 クイックスタート (Getting Started)

### 前提条件 (Prerequisites)

- **Node.js** (v18.x 以上を推奨)
- **Git**
- 実際の E2E テストを実行するため、ローカルマシンの任意の場所に `amnimo-e2e` リポジトリがクローンされている必要があります。

### インストール (Installation)

1. リポジトリをクローンします:
   ```bash
   git clone https://github.com/edrixx95/amnimo-test-runer.git
   cd amnimo-test-runer
   ```

2. 依存パッケージをインストールします:
   ```bash
   npm install
   ```

### ローカル実行 (Web モード)

Nuxt 開発サーバーを起動し、ブラウザ（`http://localhost:3000`）で UI を確認・開発する場合:

```bash
npm run dev
```

### ローカル実行 (Electron デスクトップモード)

実際の Electron デスクトップアプリケーションウィンドウとして起動する場合:

```bash
npm run dev:electron
```
*※注: このコマンドは Nuxt アプリケーションをビルドした後、Electron プロセスを起動します。*

---

## 🏗 プロジェクト構成 (Project Structure)

```text
amnimo-test-runer/
├── app/                  # Nuxt/Vue フロントエンドコード (Pages, Components, Layouts, Composables)
├── docs/                 # 引き継ぎ用ドキュメント一式 (開発ガイド、設計書、API仕様書、ノウハウ)
├── electron/             # Electron メインプロセス関連スクリプト (main.mjs, preload.js)
├── build/                # Electron パッケージング用アセット (アイコン、インストーラー画像等)
├── server/               # Nitro バックエンド API & ユーティリティ (Session Manager, SSE, IPC)
├── shared/               # フロントエンド・バックエンド共通 TypeScript 型定義 (types)
├── spec-manager/         # テスト仕様書 (YAML) パースおよび管理用スクリプト・設定
├── i18n/                 # 多言語対応設定および翻訳辞書 (en.json, ja.json)
├── sessions/             # (開発時に自動生成) 開発モード中のセッション実行データ保存先
├── nuxt.config.ts        # Nuxt 設定ファイル
├── package.json          # スクリプト、依存関係、electron-builder 設定
└── README.md
```

## 📦 ビルドとパッケージング (Building and Packaging)

配布用インストーラー（Windows 向け `.exe` 等）をビルドする場合:

```bash
npm run build:electron
```
- ビルドされたインストーラー一式は `dist-electron/` フォルダに出力されます。
- **NSIS** を使用して、デスクトップショートカットやアンインストーラーを含む Windows 用インストーラーが作成されます。

## 🔄 自動アップデート (Automatic Updates)

本アプリケーションは GitHub Releases から新しいバージョンを取得するよう `electron-updater` が設定されています。
新バージョンをリリースする手順:
1. `package.json` の `version` を更新します。
2. 変更内容をコミットし、GitHub にプッシュします。
3. GitHub 上で新しい Release を発行します。アプリ起動中または「設定 (Settings)」メニューから自動的に新バージョンが検知され、ダウンロードおよび再起動インストールの確認ダイアログが表示されます。

## 👨‍💻 開発者 (Author)

- **DAT NGUYEN THANH** (thanhdat.nguyen@dts-insight.co.jp)

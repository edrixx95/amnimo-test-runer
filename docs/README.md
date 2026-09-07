# Amnimo Test Runner ドキュメントポータル (Documentation Portal)

ようこそ！本ポータルは、**Amnimo Test Runner** の開発・保守・運用を行うエンジニア向け技術ドキュメントの総合目次です。

後任の担当者がプロジェクトに参画した際、迷うことなく設計思想やコードベース全体を把握し、機能追加・障害対応・配布ビルドを自律的に推進できるよう、実践的な情報を体系化しています。

---

## 📚 ドキュメント一覧

| ドキュメント | 概要 | 対象読者 |
| :--- | :--- | :--- |
| 📘 [開発者ガイド (Developer Guide)](./DEVELOPER_GUIDE.md) | 開発環境の構築、起動コマンド（Web/Electron）、ディレクトリ構造、コーディング規約、ビルド＆OTAアップデート手順 | 全開発者 |
| 🏛️ [アーキテクチャ詳細 (Architecture Deep Dive)](./ARCHITECTURE.md) | 全体アーキテクチャ図、セッションライフサイクル、テストスキャン＆実行エンジン、リアルタイムSSE、排他ロック制御、周辺機器チェック、Excel仕様書自動生成 | 設計・コア機能改修担当 |
| 🔌 [APIリファレンス (API Reference)](./API_REFERENCE.md) | Nitro Backend APIエンドポイント一覧、リクエスト/レスポンス仕様、Electron IPC通信仕様 | フロント/バックエンド開発者 |
| 💡 [ノウハウ集＆トラブルシューティング (Know-How & Troubleshooting)](./KNOW_HOW.md) | よくある問題と対処法、ポート競合・排他ロック強制解除、新規ボード・機種追加手順、実装上の注意点 | 運用・保守・機能拡張担当 |
| 📝 [初回起動と初期設定手順書](./INITIAL_SETUP.md) | アプリ初回起動時の `amnimo-e2e` パス指定手順 | エンドユーザー / テスター |
| 📝 [新規セッション作成手順書](./CREATE_SESSION.md) | ダッシュボードからのテストセッション新規作成手順 | エンドユーザー / テスター |
| 📝 [セッションセットアップ手順書](./SESSION_SETUP.md) | テストタイプ、ターゲットボード、環境変数、周辺機器チェックの詳細手順 | エンドユーザー / テスター |

---

## 🎯 システム概要

**Amnimo Test Runner** は、アムニモ社製IoTゲートウェイ（AG, AX, AR, ACシリーズ等）に対するエンドツーエンド（E2E）自動テスト（Playwright）を一括管理・実行するための**クロスプラットフォーム・デスクトップアプリケーション**です。

```text
+-----------------------------------------------------------------------+
|                       Amnimo Test Runner App                          |
|                                                                       |
|  +------------------------+             +--------------------------+  |
|  |   Frontend (Vue 3)     |  HTTP / SSE |   Backend (Nitro Server) |  |
|  | - Session Setup/Runner | <---------> | - Session Manager        |  |
|  | - Peripheral Checklist |   Port 8765 | - Test Scanner / Process |  |
|  | - Excel Spec Viewer    |             | - Device Lock Manager    |  |
|  +------------------------+             +--------------------------+  |
|               ^                                      |                |
|               | Electron Preload IPC                 | Spawn CLI      |
|               v                                      v                |
|  +------------------------+             +--------------------------+  |
|  |  Electron Main Process |             | Playwright Test Process  |  |
|  | - Window / Splash      |             | - amnimo-e2e Project     |  |
|  | - OTA Auto Updater     |             +--------------------------+  |
|  +------------------------+                          | Target Device  |
+------------------------------------------------------|----------------+
                                                       v
                                            +---------------------+
                                            |   Amnimo Gateways   |
                                            | (AG10, AX30, etc.)  |
                                            +---------------------+
```

### 主な特徴:
1. **マルチセッション同時実行**:
   - 複数のテストセッションを独立したプロセス・ポートで並列実行。
2. **ハードウェア周辺環境チェック (Peripheral Checklist)**:
   - テスト実行前に、SIM、外部ストレージ（USB/SD）、PoEカメラ、Nx Witness、DHCP Partner GWの疎通とハードウェア認識を自動API検証。
3. **デバイス排他ロック制御 (Device Lock Manager)**:
   - 同一のゲートウェイ実機やIPアドレスに対して複数セッションが同時にテストを走らせて設定破壊が起きるのを防止。
4. **リアルタイム進捗追跡**:
   - Server-Sent Events (SSE) を活用し、ミリ秒単位でPass/Fail/Runningの推移をダッシュボードへ配信。
5. **リリーステスト試験仕様書（Excel）の自動転記・集計**:
   - 実行結果JSONから公式の仕様書Excel（`リリーステスト_試験仕様書.xlsx`）へ合否結果、日付、ファームウェアバージョン、シリアル番号を自動反映。

---

## ⚡ クイックスタート

```powershell
# 1. リポジトリのクローン
git clone https://github.com/edrixx95/amnimo-test-runer.git
cd amnimo-test-runer

# 2. 依存パッケージのインストール
npm install

# 3. 開発モードでの起動（ブラウザ版）
npm run dev

# 4. 開発モードでの起動（Electronデスクトップ版）
npm run dev:electron

# 5. 本番インストーラ（.exe）の生成
npm run build:electron
```

詳細な環境構築手順や前提条件については、[開発者ガイド (Developer Guide)](./DEVELOPER_GUIDE_JA.md) をご参照ください。

<div align="center">
  <img src="build/icon.ico" width="100" height="100" alt="Amnimo Test Runner Logo">
  <h1>Amnimo Test Runner</h1>
  <p>A modern, powerful, and multi-session E2E test execution desktop application.</p>
</div>

---

## 📖 Overview

**Amnimo Test Runner** is a desktop application built with Nuxt 4, Vue 3, and Electron. It serves as a comprehensive dashboard and execution environment for managing end-to-end (E2E) tests on Amnimo devices. The application allows users to run multiple test sessions simultaneously, manage device firmwares, configure test environments, and track real-time test progress through an intuitive, interactive UI.

## ✨ Features

- **Multi-session Management**: Run multiple E2E test sessions in parallel. Each session is completely isolated with its own dynamically assigned port and process.
- **Real-time Progress Tracking**: Monitor test progress live. View counts for Passed, Failed, and Skipped tests dynamically as the test runner executes.
- **Firmware Management**: Manage both local and external/production firmware packages. Seamlessly download, upload, and track firmware assets directly from the application.
- **Persistent Data**: Settings and Session data are saved into the OS User Data directory (e.g., `AppData/Roaming`), meaning your test reports and sessions will safely persist across app updates.
- **Multi-language Support (i18n)**: Fully translated UI for both **English (en)** and **Japanese (ja)**.
- **Auto-Updates**: Built-in support for seamless over-the-air (OTA) updates using `electron-updater` directly linked to GitHub Releases.
- **Interactive Environment Setup**: Simple UI to manage environment variables (`.env`) for each testing session.
- **Modern UI**: Polished, glassmorphic UI built from scratch using Tailwind CSS.

## 🛠 Tech Stack

- **Framework**: Nuxt 4 (with Nitro Server)
- **Frontend**: Vue 3 (Composition API), Pinia (State Management), VueUse
- **Styling**: Tailwind CSS
- **Desktop Wrapper**: Electron
- **Packaging**: electron-builder
- **Internationalization**: `@nuxtjs/i18n`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.x or newer recommended)
- **Git**
- Ensure you have the `amnimo-e2e` repository cloned somewhere on your local machine, as the Test Runner needs it to execute the actual tests.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/edrixx95/amnimo-test-runer.git
   cd amnimo-test-runer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally (Web Mode)

To start the Nuxt development server (runs in your browser at `http://localhost:3000`):

```bash
npm run dev
```

### Running Locally (Electron App Mode)

To test the application as an actual Electron desktop window:

```bash
npm run dev:electron
```
*Note: This command builds the Nuxt app first and then spawns the Electron process.*

---

## 🏗 Project Structure

```text
amnimo-test-runer/
├── app/                  # Frontend Nuxt/Vue Code (Pages, Components, Layouts)
├── electron/             # Electron main process scripts (main.mjs, preload.js)
├── build/                # Electron packaging assets (Icons, Installer images)
├── server/               # Nitro backend API and Utilities (Session Manager, IPC)
├── i18n/                 # Localization config and translation dictionaries (en, ja)
├── sessions/             # (Generated) Local session data storage during dev mode
├── nuxt.config.ts        # Nuxt Configuration
├── package.json          # Scripts, dependencies, and electron-builder config
└── README.md
```

## 📦 Building and Packaging

To build the executable installer (e.g., `.exe` for Windows) for distribution:

```bash
npm run build:electron
```
- This will output the installation files inside the `dist-electron/` folder.
- Uses **NSIS** to create a complete Windows installer with desktop shortcuts and uninstallers.

## 🔄 Automatic Updates

The application uses `electron-updater` configured to pull releases from GitHub. 
When building a new version:
1. Update the `version` in `package.json`.
2. Commit and push to GitHub.
3. Publish a new Release on GitHub. The application will automatically check for this new version in the **Settings** menu and prompt users to install and restart.

## 👨‍💻 Author

- **DAT NGUYEN THANH** (thanhdat.nguyen@dts-insight.co.jp)

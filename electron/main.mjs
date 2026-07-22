import { app, BrowserWindow, dialog } from "electron";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let splashWindow = null;
const SERVER_PORT = 8765;

async function startNitroServer() {
  try {
    // Start Nitro server within the same process
    process.env.PORT = SERVER_PORT.toString();
    process.env.HOST = "127.0.0.1";

    // Import the built Nitro server
    // Node.js ESM loader on Windows requires file:// protocol for absolute paths
    const serverPath = path.join(__dirname, "../.output/server/index.mjs");
    await import(pathToFileURL(serverPath).href);
    console.log("Nitro server imported successfully");
  } catch (err) {
    console.error("Failed to start Nitro server:", err);
    dialog.showErrorBox(
      "Server Error",
      "Failed to start the internal server: " + err.message,
    );
    app.quit();
  }
}

function waitForServer(port, callback) {
  const check = () => {
    const req = http.get(`http://127.0.0.1:${port}`, (res) => {
      // Any response means the server is up
      callback();
    });

    req.on("error", () => {
      setTimeout(check, 200); // Retry every 200ms
    });
  };
  check();
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    icon: path.join(process.cwd(), "build", "icon.png"),
  });
  
  splashWindow.loadFile(path.join(__dirname, "splash.html"));
  
  splashWindow.once("ready-to-show", () => {
    splashWindow.show();
  });
  
  splashWindow.on("closed", () => {
    splashWindow = null;
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hiddenInset",
    icon: path.join(process.cwd(), "build", "icon.png"),
    title: "Amnimo Test Runner",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(`http://127.0.0.1:${SERVER_PORT}`);

  mainWindow.once("ready-to-show", () => {
    if (splashWindow) {
      splashWindow.close();
    }
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  createSplashWindow();
  
  await startNitroServer();

  // Wait for Nuxt API to be responsive
  waitForServer(SERVER_PORT, () => {
    createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

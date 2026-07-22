const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
  installUpdate: () => ipcRenderer.send('install-update'),
  onUpdateStatus: (callback) => ipcRenderer.on('update-status', (_event, status) => callback(status)),
  removeUpdateStatusListener: () => ipcRenderer.removeAllListeners('update-status'),
  getAppVersion: () => ipcRenderer.invoke('get-version'),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (_event, data) => callback(data)),
  onDownloadComplete: (callback) => ipcRenderer.on('download-complete', (_event, data) => callback(data)),
  removeDownloadListeners: () => {
    ipcRenderer.removeAllListeners('download-progress');
    ipcRenderer.removeAllListeners('download-complete');
  }
});

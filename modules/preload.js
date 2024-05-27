// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  extractImages: (pdfPath, outputDir) => ipcRenderer.invoke('extract-images', pdfPath, outputDir)
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  extractImages: (pdfPath, outputDir) =>
    ipcRenderer.invoke("extract-images", pdfPath, outputDir),
  checkFolderExists: (folderPath) =>
    ipcRenderer.invoke("check-folder-exists", folderPath),
  openFolderInOS: (outputDir) =>
    ipcRenderer.invoke("open-folder-InOS", outputDir),
});

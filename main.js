const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const folderExists = require("./modules/folderUtils");
const convertPDFPagesToImages = require("./modules/convertPDFPagesToImages");
const openFolderInOS = require("./modules/openFolder");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "modules/preload.js"),
      contentSecurityPolicy: "default-src 'self'; script-src 'self'; img-src 'self'", // Set content security policy
    },
  });

  mainWindow.loadFile("templates/index.html");
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("extract-images", async (event, pdfPath, outputDir) => {
    try {
      var result = await convertPDFPagesToImages(pdfPath, outputDir);
      return { success: true, imagePaths: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("check-folder-exists", async (event, folderPath) => {
    try {
      const result = await folderExists(folderPath);
      return { success: true, IsExist: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("open-folder-InOS", async (event, outputDir) => {
      await openFolderInOS(outputDir);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

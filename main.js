const path = require('path');
const { app, BrowserWindow, ipcMain  } = require('electron');
const folderExists = require('./modules/folderUtils');
const convertPDFPagesToImages = require('./modules/convertPDFPagesToImages');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'modules/preload.js')
    }
  });

  mainWindow.loadFile('templates/index.html');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('extract-images', async (event, pdfPath, outputDir) => {
    try {
      var result = await convertPDFPagesToImages(pdfPath, outputDir);
      return { success: true, imagePaths: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Expose selectFolder function to renderer process
  ipcMain.handle('check-folder-exists', async (event, folderPath) => {
    try {
      const result = await folderExists(folderPath);
      return { success: true, IsExist: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });  
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

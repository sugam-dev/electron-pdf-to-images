const { app, BrowserWindow, ipcMain  } = require('electron');
const convertPDFPagesToImages = require('./modules/convertPDFPagesToImages');
const path = require('path');
const { selectFolder } = require('./modules/fileUtils');

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

  ipcMain.handle('extract-images', async (event, pdfPath) => {
    try {
      var result = await convertPDFPagesToImages(pdfPath);
      return { success: true, imagePaths: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // Expose selectFolder function to renderer process
  ipcMain.handle('select-folder', async (event) => {
    try {
      const selectedFolder = await selectFolder();
      return selectedFolder;
    } catch (error) {
      console.error(error);
      return null;
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

const { dialog } = require('electron');

// Function to handle folder selection
function selectFolder() {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then(result => {
      if (!result.canceled) {
        const selectedPath = result.filePaths[0];
        resolve(selectedPath);
      } else {
        reject(new Error('Folder selection canceled'));
      }
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports = {
  selectFolder
};

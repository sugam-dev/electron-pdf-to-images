const { exec } = require('child_process');
const path = require('path');

function openFolderInOS(outputDir) {
  const folderPath = outputDir;

  console.log('folderPath: ', folderPath);

  let command = '';

  // Detect OS and set appropriate command
  if (process.platform === 'win32') {
    // For Windows
    command = `start "" "${folderPath}"`;
  } else if (process.platform === 'darwin') {
    // For macOS
    command = `open "${folderPath}"`;
  } else {
    // For Linux
    command = `xdg-open "${folderPath}"`;
  }

  // Execute the command
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error opening folder: ${err}`);
      return;
    }
    console.log(`Folder opened: ${folderPath}`);
  });
}

module.exports = openFolderInOS;

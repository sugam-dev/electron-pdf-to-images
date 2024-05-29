const { exec } = require('child_process');
const path = require('path');

function openFolderInOS(outputDir) {
  const folderPath = outputDir;
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
  });
}

module.exports = openFolderInOS;

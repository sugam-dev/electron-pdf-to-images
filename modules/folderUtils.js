const fs = require('fs');

// Function to check if a folder exists
async function folderExists(folderPath) {
  try {
      return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory();
  } catch (err) {
      console.error(err);
      return false;
  }
}


module.exports = folderExists;

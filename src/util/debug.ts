
const fss = require('fs');
const path = require('path');

export function printFileTree(directoryPath: string, indent = '') {
  try {
    const items = fss.readdirSync(directoryPath);

    items.forEach((item: any) => {
      const itemPath = path.join(directoryPath, item);
      const stats = fss.statSync(itemPath);

      const isDirectory = stats.isDirectory();
      const perms = (stats.mode & 0o777).toString(8); // string like "755" or "644"

      console.log(`${indent}${isDirectory ? '📁' : '📄'} ${perms} ${item}`);

      if (isDirectory) {
        printFileTree(itemPath, indent + '  '); // Increase indent for subdirectories
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${directoryPath}: ${err}`);
  }
}
// 分步清理dist目录的脚本
const fs = require('fs');
const path = require('path');

function stepClean(dir, depth = 0) {
  if (depth > 100) {
    console.log('Reached maximum depth, stopping to prevent infinite loop');
    return;
  }

  if (!fs.existsSync(dir)) {
    return;
  }

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    // 先删除所有文件
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      
      if (!entry.isDirectory()) {
        try {
          fs.unlinkSync(entryPath);
          console.log(`Deleted file: ${entryPath}`);
        } catch (err) {
          console.warn(`Failed to delete file: ${entryPath}`, err.message);
        }
      }
    }
    
    // 然后递归删除子目录
    const dirs = fs.readdirSync(dir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    for (const dirName of dirs) {
      const entryPath = path.join(dir, dirName);
      stepClean(entryPath, depth + 1);
    }
    
    // 最后删除空目录
    try {
      fs.rmdirSync(dir);
      console.log(`Deleted directory: ${dir}`);
    } catch (err) {
      console.warn(`Failed to delete directory: ${dir}`, err.message);
    }
  } catch (err) {
    console.error(`Error processing directory: ${dir}`, err.message);
  }
}

const distPath = path.join(__dirname, '..', 'dist');

console.log('Step cleaning dist directory...');

try {
  stepClean(distPath);
  console.log('Dist directory step cleaned successfully.');
} catch (error) {
  console.error('Error step cleaning dist directory:', error.message);
}
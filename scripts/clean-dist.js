// 清理dist目录的脚本
const fs = require('fs');
const path = require('path');

// 递归删除目录的函数，用于处理深度嵌套的目录
function deleteDirRecursive(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      deleteDirRecursive(entryPath);
    } else {
      try {
        fs.unlinkSync(entryPath);
      } catch (err) {
        console.warn(`Failed to delete file: ${entryPath}`, err.message);
      }
    }
  }

  try {
    fs.rmdirSync(dir);
  } catch (err) {
    console.warn(`Failed to remove directory: ${dir}`, err.message);
  }
}

const distPath = path.join(__dirname, '..', 'dist');

console.log('Cleaning dist directory...');

try {
  // 多次尝试删除，确保深度嵌套的目录被完全清除
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(distPath)) {
      deleteDirRecursive(distPath);
    }
  }
  
  // 最后确保目录被删除
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
  }
  
  console.log('Dist directory cleaned successfully.');
} catch (error) {
  console.error('Error cleaning dist directory:', error.message);
}
// 强制清理dist目录的脚本
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');

console.log('Force cleaning dist directory...');

try {
  if (fs.existsSync(distPath)) {
    // 使用Node.js内置的rmSync方法强制删除目录
    fs.rmSync(distPath, { recursive: true, force: true });
    console.log('Dist directory cleaned successfully.');
  } else {
    console.log('Dist directory does not exist.');
  }
} catch (error) {
  console.error('Error cleaning dist directory:', error.message);
}
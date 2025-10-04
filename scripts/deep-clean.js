// 深度清理dist目录的脚本
const fs = require('fs');
const path = require('path');

// 使用同步方式深度删除目录
function deepDeleteDir(dir) {
  try {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          // 递归删除子目录
          deepDeleteDir(filePath);
        } else {
          // 删除文件
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
          } catch (err) {
            console.warn(`Failed to delete file: ${filePath}`, err.message);
          }
        }
      }
      
      // 删除空目录
      try {
        fs.rmdirSync(dir);
        console.log(`Deleted directory: ${dir}`);
      } catch (err) {
        console.warn(`Failed to delete directory: ${dir}`, err.message);
      }
    }
  } catch (err) {
    console.error(`Error processing directory: ${dir}`, err.message);
  }
}

const distPath = path.join(__dirname, '..', 'dist');

console.log('Deep cleaning dist directory...');

try {
  deepDeleteDir(distPath);
  console.log('Dist directory deep cleaned successfully.');
} catch (error) {
  console.error('Error deep cleaning dist directory:', error.message);
}
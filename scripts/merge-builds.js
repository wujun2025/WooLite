// 合并两个构建结果的脚本
const fs = require('fs');
const path = require('path');

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 复制文件函数
function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

// 复制目录函数
function copyDir(src, dest) {
  ensureDir(dest);
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// 主函数
function main() {
  console.log('Merging builds...');
  
  const distPath = path.join(__dirname, '..', 'dist');
  const tempPath = path.join(distPath, 'temp');
  
  // 如果temp目录存在，将其内容合并到dist目录
  if (fs.existsSync(tempPath)) {
    console.log('Copying background script...');
    const entries = fs.readdirSync(tempPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(tempPath, entry.name);
      const destPath = path.join(distPath, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        copyFile(srcPath, destPath);
      }
    }
    
    // 删除temp目录
    fs.rmSync(tempPath, { recursive: true, force: true });
    console.log('Temp directory removed.');
  }
  
  console.log('Builds merged successfully.');
}

// 执行主函数
main();
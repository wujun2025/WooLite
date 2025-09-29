// 多浏览器构建脚本
const fs = require('fs');
const path = require('path');

// 浏览器配置
const browsers = [
  { 
    name: 'chrome', 
    manifest: 'src/manifest.json',
    targetDir: 'dist/chrome'
  },
  { 
    name: 'firefox', 
    manifest: 'src/manifest.firefox.json',
    targetDir: 'dist/firefox'
  }
];

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
    // 跳过目标目录本身
    if (entry.name === 'chrome' || entry.name === 'firefox') {
      continue;
    }
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// 构建函数
function buildForBrowser(browser) {
  console.log(`Preparing ${browser.name} build...`);
  
  // 创建目标目录
  ensureDir(browser.targetDir);
  
  // 复制对应的manifest文件
  const manifestSrc = path.join(__dirname, '..', browser.manifest);
  const manifestDest = path.join(__dirname, '..', browser.targetDir, 'manifest.json');
  copyFile(manifestSrc, manifestDest);
  
  console.log(`${browser.name} preparation completed.`);
}

// 主函数
function main() {
  console.log('Starting multi-browser preparation...');
  
  // 为每个浏览器准备构建
  for (const browser of browsers) {
    buildForBrowser(browser);
  }
  
  console.log('Multi-browser preparation completed.');
  console.log('To build the extension, run: npm run build');
  console.log('The build output will be automatically copied to the browser-specific directories.');
}

// 执行主函数
main();
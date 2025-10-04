// 多浏览器构建脚本 (仅支持Chrome和Edge)
const fs = require('fs');
const path = require('path');

// 浏览器配置 (仅支持Chrome和Edge)
const browsers = [
  { 
    name: 'chrome', 
    manifest: 'src/manifest.json',
    targetDir: 'dist/chrome-extension'
  },
  {
    name: 'edge',
    manifest: 'src/manifest.json',
    targetDir: 'dist/edge-extension'
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
function copyDir(src, dest, skipDirs = []) {
  ensureDir(dest);
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    // 跳过指定的目录
    if (skipDirs.includes(entry.name)) {
      continue;
    }
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, skipDirs);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// 主函数
function main() {
  console.log('Starting Chrome/Edge preparation...');
  
  // 清理旧的构建目录
  const skipDirs = ['chrome-extension', 'edge-extension'];
  const distPath = path.join(__dirname, '..', 'dist');
  
  for (const browser of browsers) {
    // 先确保目标目录存在
    ensureDir(browser.targetDir);
    
    // 获取dist目录下的所有条目
    if (fs.existsSync(distPath)) {
      const entries = fs.readdirSync(distPath, { withFileTypes: true });
      
      for (const entry of entries) {
        // 跳过浏览器特定目录和其他不需要的目录
        if (skipDirs.includes(entry.name)) {
          continue;
        }
        
        const srcPath = path.join(distPath, entry.name);
        const destPath = path.join(__dirname, '..', browser.targetDir, entry.name);
        
        // 特别检查避免复制到自身目录内
        if (path.resolve(srcPath) === path.resolve(browser.targetDir)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath, skipDirs);
        } else {
          copyFile(srcPath, destPath);
        }
      }
    }
    
    // 复制对应的manifest文件
    const manifestSrc = path.join(__dirname, '..', browser.manifest);
    const manifestDest = path.join(__dirname, '..', browser.targetDir, 'manifest.json');
    copyFile(manifestSrc, manifestDest);
    
    // 复制assets目录
    const assetsSrc = path.join(__dirname, '..', 'src', 'assets');
    const assetsDest = path.join(__dirname, '..', browser.targetDir, 'src', 'assets');
    if (fs.existsSync(assetsSrc)) {
      copyDir(assetsSrc, assetsDest);
    }
  }
  
  console.log('Chrome/Edge preparation completed.');
  console.log('To build the extension, run: npm run build');
  console.log('The build output will be automatically copied to the browser-specific directories.');
}

// 执行主函数
main();
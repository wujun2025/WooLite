const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 确保 dist 目录存在
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 创建不同尺寸的图标
async function createIcons() {
  try {
    // 加载原始图标
    const sourceIconPath = path.join(__dirname, '..', '..', 'woocommerce图标.png');
    
    if (!fs.existsSync(sourceIconPath)) {
      console.error('错误：找不到 woocommerce图标.png 文件');
      return;
    }
    
    // 定义所需尺寸
    const sizes = [16, 48, 128];
    
    // 为每个尺寸创建图标
    for (const size of sizes) {
      // 使用 sharp 调整图片尺寸
      const outputPath = path.join(__dirname, '..', 'src', 'assets', 'icons', `icon${size}.png`);
      
      await sharp(sourceIconPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // 透明背景
        })
        .png()
        .toFile(outputPath);
      
      console.log(`已创建 ${size}x${size} 图标: ${outputPath}`);
      
      // 同时复制到 dist/chrome/src/assets/icons 目录（如果存在）
      const distChromePath = path.join(__dirname, '..', 'dist', 'chrome', 'src', 'assets', 'icons');
      if (fs.existsSync(distChromePath)) {
        const distOutputPath = path.join(distChromePath, `icon${size}.png`);
        
        await sharp(sourceIconPath)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 } // 透明背景
          })
          .png()
          .toFile(distOutputPath);
          
        console.log(`已复制 ${size}x${size} 图标到 dist 目录: ${distOutputPath}`);
      }
    }
    
    console.log('所有图标处理完成！');
  } catch (error) {
    console.error('处理图标时出错:', error);
  }
}

createIcons();
#!/usr/bin/env node

/**
 * 版本号更新脚本
 * 符合Chrome扩展规范的版本号格式: 主版本号.次版本号.修订号
 * 例如: 1.0.2
 */

const fs = require('fs');
const path = require('path');

// 更新版本号（仅增加修订号）
const updateVersion = () => {
  try {
    // 更新 package.json
    const packagePath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(packagePath)) {
      console.error('package.json 文件不存在');
      process.exit(1);
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    // 明确获取顶层的version字段
    const currentVersion = packageJson.version;
    
    // 验证当前版本号格式
    if (!currentVersion || !/^\d+\.\d+\.\d+$/.test(currentVersion)) {
      console.error('当前版本号格式不正确，应为 主版本号.次版本号.修订号 格式');
      process.exit(1);
    }
    
    const versionParts = currentVersion.split('.').map(Number);
    
    // 增加修订号
    if (versionParts.length >= 3) {
      versionParts[2] += 1;
    } else {
      // 如果版本号格式不完整，补充默认值
      while (versionParts.length < 2) versionParts.push(0);
      versionParts.push(1);
    }
    
    const newVersion = versionParts.join('.');
    packageJson.version = newVersion;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    
    // 更新 manifest.json
    const manifestPath = path.join(__dirname, '..', 'src', 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      console.error('manifest.json 文件不存在');
      process.exit(1);
    }
    
    const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const oldManifestVersion = manifestJson.version;
    manifestJson.version = newVersion;
    fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, 2));
    
    // 更新版本日志
    const versionLogPath = path.join(__dirname, '..', 'VERSION_LOG.md');
    const currentDate = new Date().toISOString().split('T')[0];
    const versionLogEntry = `\n### v${newVersion} (${currentDate})\n- 自动更新版本号\n`;
    
    if (fs.existsSync(versionLogPath)) {
      // 在文件开头插入新的版本记录（在第二个标题之后）
      let versionLogContent = fs.readFileSync(versionLogPath, 'utf8');
      const lines = versionLogContent.split('\n');
      // 找到第二个标题的位置
      let insertIndex = 3; // 默认在文件开头几行之后插入
      for (let i = 3; i < lines.length; i++) {
        if (lines[i].startsWith('### ')) {
          insertIndex = i;
          break;
        }
      }
      lines.splice(insertIndex, 0, versionLogEntry);
      versionLogContent = lines.join('\n');
      fs.writeFileSync(versionLogPath, versionLogContent);
    } else {
      // 创建新的版本日志文件
      const versionLogContent = `# 版本更新记录

## 版本号格式说明
采用 \`主版本号.次版本号.修订号\` 的标准语义化版本格式，符合Chrome扩展规范：
- 主版本号：重大功能更新或架构调整时增加
- 次版本号：新增功能或重要改进时增加
- 修订号：修复bug或小幅度改进时增加

## 版本记录${versionLogEntry}`;
      fs.writeFileSync(versionLogPath, versionLogContent);
    }
    
    console.log(`版本号已更新: ${currentVersion} -> ${newVersion}`);
  } catch (error) {
    console.error('更新版本号时出错:', error.message);
    process.exit(1);
  }
};

// 执行更新
updateVersion();
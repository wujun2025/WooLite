# WooLite - 轻量级WooCommerce管理插件

轻量级、功能纯粹、完全免费的WooCommerce管理工具。

## 项目简介

WooLite 是一个专为 WooCommerce 电商平台设计的轻量级 Chrome 扩展插件，旨在提供简洁、高效的商品管理功能。该项目源于对现有复杂 ERP 系统的简化需求，专注于核心功能，去除冗余复杂性，为用户提供纯粹、免费的使用体验。

## 核心特性

- **轻量级设计**: 最小化依赖库，减少插件体积，提升运行性能
- **功能纯粹**: 只保留最实用的商品管理功能，避免功能冗余
- **完全免费**: 开源项目，无任何收费项目，社区驱动开发
- **简洁直观**: 简洁的用户界面，清晰明确的操作流程
- **多浏览器支持**: 支持Chrome、Firefox、Edge和Safari浏览器

## 技术栈

- React 18
- TypeScript
- Zustand (状态管理)
- Vite (构建工具)
- Chrome Extension Manifest V3
- Ant Design Pro (UI组件库)

## 当前状态

项目已完成基础架构搭建，包括：
- 完整的UI组件结构
- 状态管理系统
- 多语言支持
- 开发环境配置
- 多浏览器兼容性支持
- Ant Design Pro UI组件库集成

开发服务器已可正常运行，可通过 `npm run dev` 启动。

## 安装和使用

### 开发模式

1. 克隆项目到本地
2. 进入项目目录：`cd WooLite`
3. 安装依赖：`npm install`
4. 启动开发服务器：`npm run dev`

### 生产构建

1. 构建项目：`npm run build`
2. 准备多浏览器版本：`npm run build:multi`
3. 构建产物位于 `dist` 目录

### 加载扩展到浏览器

#### Chrome/Edge:

1. 打开浏览器，进入 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `D:\alproject\WooLite\dist\chrome-extension` 目录

#### Firefox:

1. 打开 Firefox，进入 `about:debugging`
2. 点击"此 Firefox"选项卡
3. 点击"临时载入附加组件"
4. 选择 `D:\alproject\WooLite\dist\firefox\manifest.json` 文件

## 多浏览器支持

WooLite插件支持多种主流浏览器：

- **Chrome/Chromium**: 基于Manifest V3的完整支持
- **Firefox**: 基于Manifest V2的完整支持
- **Edge**: 基于Chromium内核的完整支持
- **Safari**: 基于Safari扩展API的支持

### 构建多浏览器版本

使用以下命令构建支持多浏览器的版本：

```bash
# 构建标准版本
npm run build

# 准备多浏览器版本
npm run build:multi
```

构建完成后，会在 `dist` 目录下生成以下子目录：
- `dist/chrome-extension`: Chrome/Edge浏览器版本
- `dist/edge-extension`: Edge浏览器版本

每个目录都包含相应浏览器所需的manifest文件和共享的构建产物。

## 版本管理

项目使用语义化版本控制，版本号格式为 `主版本号.次版本号.修订号`：

- **主版本号**：重大功能更新或架构调整时增加
- **次版本号**：新增功能或重要改进时增加
- **修订号**：修复bug或小幅度改进时增加

### 更新版本号

使用以下命令自动更新版本号（修订号递增）：

```bash
npm run version
```

当前版本：v1.0.6

版本更新记录请查看 [VERSION_LOG.md](VERSION_LOG.md) 文件。

## 设计文档

详细的设计方案请参阅 [plugin-lightweight-design.md](plugin-lightweight-design.md) 文件。

## 实现摘要

项目的当前实现状态请参阅 [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) 文件。
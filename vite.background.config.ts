import { defineConfig } from 'vite'

// 专门为background script的配置
export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/background/index.ts',
      name: 'background',
      formats: ['iife'], // 使用立即执行函数格式，避免ES模块
      fileName: () => 'background.js'
    },
    rollupOptions: {
      output: {
        // 确保生成的文件是普通的JavaScript，不使用ES模块
        format: 'iife'
      }
    }
  }
})
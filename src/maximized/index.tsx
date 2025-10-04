import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import MaximizedApp from './MaximizedApp'
import '../index.css'

// 创建主题提供者组件
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeWrapper>
      <MaximizedApp />
    </ThemeWrapper>
  </React.StrictMode>,
)
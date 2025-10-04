import React, { useEffect, useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'

const PopupApp: React.FC = () => {
  const { t } = useTranslation()
  const [status, setStatus] = useState<string>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('PopupApp mounted')
    try {
      // 创建最大化窗口
      chrome.windows.create({
        url: chrome.runtime.getURL('src/maximized/index.html'),
        type: 'popup',
        width: 1200,
        height: 800
      }, (window) => {
        if (chrome.runtime.lastError) {
          console.error('Error creating window:', chrome.runtime.lastError)
          setError(chrome.runtime.lastError.message || 'Failed to create window')
          setStatus('error')
          return
        }
        console.log('Window created:', window)
        // 窗口创建成功后关闭popup
        // 注意：我们不能直接关闭当前popup窗口，因为这是扩展的popup页面
        // 我们可以尝试通过chrome.tabs API关闭当前标签页
        if (window) {
          // 窗口创建成功，popup会自动关闭或用户可以手动关闭
        }
      })
    } catch (err) {
      console.error('Error creating window:', err)
      setError(err instanceof Error ? err.message : String(err))
      setStatus('error')
    }
  }, [])

  return (
    <div className="popup-app" style={{ padding: '20px', textAlign: 'center', minWidth: '300px' }}>
      <h1>WooLite</h1>
      {status === 'loading' && (
        <>
          <p>{t('common.loading')}...</p>
          <p>正在打开最大化窗口...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <p style={{ color: 'red' }}>错误: {error}</p>
          <p>请检查扩展权限或尝试重新加载扩展。</p>
        </>
      )}
    </div>
  )
}

export default PopupApp
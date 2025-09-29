import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store'

const MaximizedApp: React.FC = () => {
  const { t } = useTranslation()
  const stores = useAppStore(state => state.stores)
  const activeStoreId = useAppStore(state => state.activeStoreId)
  
  const activeStore = stores.find(store => store.id === activeStoreId)

  return (
    <div className="maximized-app">
      <header>
        <h1>WooLite</h1>
      </header>
      
      <main>
        <div className="app-content">
          {activeStore ? (
            <div className="store-info">
              <h2>{activeStore.name}</h2>
              <p>{activeStore.url}</p>
            </div>
          ) : (
            <div className="no-store">
              <p>{t('storeManagement.title')}</p>
            </div>
          )}
          
          <div className="features">
            <div className="feature-card">
              <h3>{t('storeManagement.title')}</h3>
              <p>管理您的WooCommerce店铺</p>
            </div>
            
            <div className="feature-card">
              <h3>{t('productManagement.title')}</h3>
              <p>编辑和管理商品信息</p>
            </div>
            
            <div className="feature-card">
              <h3>{t('orderNotification.title')}</h3>
              <p>实时订单提醒功能</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MaximizedApp
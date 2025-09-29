import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store'

const PopupApp: React.FC = () => {
  const { t } = useTranslation()
  const stores = useAppStore(state => state.stores)
  const activeStoreId = useAppStore(state => state.activeStoreId)
  const isOrderNotificationEnabled = useAppStore(state => state.isOrderNotificationEnabled)
  
  const activeStore = stores.find(store => store.id === activeStoreId)

  return (
    <div className="popup-app">
      <header>
        <h1>WooLite</h1>
      </header>
      
      <main>
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
        
        <div className="order-notification">
          <h3>{t('orderNotification.title')}</h3>
          <p>{isOrderNotificationEnabled ? t('orderNotification.enable') : t('orderNotification.disable')}</p>
        </div>
        
        <div className="actions">
          <button onClick={() => window.open('src/maximized/index.html', '_blank')}>
            {t('productManagement.title')}
          </button>
        </div>
      </main>
    </div>
  )
}

export default PopupApp
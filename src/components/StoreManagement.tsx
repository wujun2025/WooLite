import React, { useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store'
import { StoreConfig } from '../types'

interface StoreManagementProps {
  onStoreAdded?: () => void
}

const StoreManagement: React.FC<StoreManagementProps> = ({ onStoreAdded }) => {
  const { t } = useTranslation()
  const stores = useAppStore(state => state.stores)
  const addStore = useAppStore(state => state.addStore)
  const removeStore = useAppStore(state => state.removeStore)
  const setActiveStore = useAppStore(state => state.setActiveStore)
  const activeStoreId = useAppStore(state => state.activeStoreId)
  
  const [isAdding, setIsAdding] = useState(false)
  const [newStore, setNewStore] = useState<Omit<StoreConfig, 'id' | 'isActive'>>({
    name: '',
    url: '',
    authType: 'wordpress',
    credentials: {
      username: '',
      password: '',
      consumerKey: '',
      consumerSecret: ''
    }
  })

  const handleAddStore = () => {
    if (stores.length >= 3) {
      alert(t('storeManagement.maxStoresReached'))
      return
    }
    
    const store: StoreConfig = {
      ...newStore,
      id: Date.now().toString(),
      isActive: stores.length === 0 // 第一个店铺自动设为激活状态
    }
    
    addStore(store)
    setIsAdding(false)
    setNewStore({
      name: '',
      url: '',
      authType: 'wordpress',
      credentials: {
        username: '',
        password: '',
        consumerKey: '',
        consumerSecret: ''
      }
    })
    
    if (onStoreAdded) onStoreAdded()
  }

  const handleRemoveStore = (storeId: string) => {
    if (window.confirm(t('common.delete') + '?')) {
      removeStore(storeId)
    }
  }

  const handleSetActiveStore = (storeId: string) => {
    setActiveStore(storeId)
  }

  return (
    <div className="store-management">
      <div className="header">
        <h2>{t('storeManagement.title')}</h2>
        <button onClick={() => setIsAdding(true)}>
          {t('storeManagement.addStore')}
        </button>
      </div>
      
      {isAdding && (
        <div className="add-store-form">
          <h3>{t('storeManagement.addStore')}</h3>
          <div className="form-group">
            <label>{t('storeManagement.storeName')}</label>
            <input
              type="text"
              value={newStore.name}
              onChange={(e) => setNewStore({...newStore, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>{t('storeManagement.storeUrl')}</label>
            <input
              type="text"
              value={newStore.url}
              onChange={(e) => setNewStore({...newStore, url: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>{t('storeManagement.authType')}</label>
            <select
              value={newStore.authType}
              onChange={(e) => setNewStore({
                ...newStore, 
                authType: e.target.value as 'wordpress' | 'woocommerce',
                credentials: {
                  username: '',
                  password: '',
                  consumerKey: '',
                  consumerSecret: ''
                }
              })}
            >
              <option value="wordpress">{t('storeManagement.wordpressAuth')}</option>
              <option value="woocommerce">{t('storeManagement.woocommerceAuth')}</option>
            </select>
          </div>
          
          {newStore.authType === 'wordpress' ? (
            <>
              <div className="form-group">
                <label>{t('storeManagement.username')}</label>
                <input
                  type="text"
                  value={newStore.credentials.username || ''}
                  onChange={(e) => setNewStore({
                    ...newStore, 
                    credentials: {...newStore.credentials, username: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label>{t('storeManagement.password')}</label>
                <input
                  type="password"
                  value={newStore.credentials.password || ''}
                  onChange={(e) => setNewStore({
                    ...newStore, 
                    credentials: {...newStore.credentials, password: e.target.value}
                  })}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>{t('storeManagement.consumerKey')}</label>
                <input
                  type="text"
                  value={newStore.credentials.consumerKey || ''}
                  onChange={(e) => setNewStore({
                    ...newStore, 
                    credentials: {...newStore.credentials, consumerKey: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label>{t('storeManagement.consumerSecret')}</label>
                <input
                  type="password"
                  value={newStore.credentials.consumerSecret || ''}
                  onChange={(e) => setNewStore({
                    ...newStore, 
                    credentials: {...newStore.credentials, consumerSecret: e.target.value}
                  })}
                />
              </div>
            </>
          )}
          
          <div className="form-actions">
            <button onClick={handleAddStore}>{t('common.save')}</button>
            <button onClick={() => setIsAdding(false)}>{t('common.cancel')}</button>
          </div>
        </div>
      )}
      
      <div className="store-list">
        {stores.map(store => (
          <div key={store.id} className={`store-card ${store.id === activeStoreId ? 'active' : ''}`}>
            <div className="store-info">
              <h3>{store.name}</h3>
              <p>{store.url}</p>
              <p className="auth-type">
                {store.authType === 'wordpress' 
                  ? t('storeManagement.wordpressAuth') 
                  : t('storeManagement.woocommerceAuth')}
              </p>
            </div>
            <div className="store-actions">
              <button 
                onClick={() => handleSetActiveStore(store.id)}
                disabled={store.id === activeStoreId}
              >
                {t('storeManagement.setActive')}
              </button>
              <button onClick={() => handleRemoveStore(store.id)}>
                {t('common.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoreManagement
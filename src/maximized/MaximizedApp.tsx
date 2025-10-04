import React, { useState, useEffect } from 'react'
import { Button, Typography, Alert } from 'antd'
import { 
  AppstoreOutlined, 
  ShoppingCartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { ProLayout, PageContainer, ProCard } from '@ant-design/pro-components'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store'
import StoreManagement from '../components/StoreManagement'
import ProductManagement from '../components/ProductManagement'
import About from '../components/About'
import WooCommerceAPI from '../services/api'

const { Title, Text } = Typography

const MaximizedApp: React.FC = () => {
  const { t } = useTranslation()
  const stores = useAppStore(state => state.stores)
  const activeStoreId = useAppStore(state => state.activeStoreId)
  const setProducts = useAppStore(state => state.setProducts)
  const [loading, setLoading] = useState(false)
  
  const [activeTab, setActiveTab] = useState<'stores' | 'products' | 'about'>('stores')
  
  const activeStore = stores.find(store => store.id === activeStoreId)



  // 处理添加店铺后的回调 - 不再自动跳转
  const handleStoreAdded = () => {
    // 不再自动切换到商品管理标签
    // 用户需要手动切换或通过测试连接后跳转
  }

  // 从API获取商品数据
  const fetchProducts = async (page: number = 1, itemsPerPage: number = 20) => {
    if (!activeStore) return
    
    setLoading(true)
    try {
      const paginatedProducts = await WooCommerceAPI.getProducts(activeStore, {
        page,
        per_page: itemsPerPage
      })
      setProducts(paginatedProducts.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  // 当激活的店铺改变时，获取商品数据
  useEffect(() => {
    if (activeStore && activeTab === 'products') {
      fetchProducts()
    }
  }, [activeStore, activeTab])



  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 美化页头 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        padding: '12px 20px',
        textAlign: 'center',
        color: '#2c3e50',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 1000,
        position: 'relative'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '20px', 
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          WooLite
        </h1>
        <p style={{ 
          margin: '4px 0 0 0', 
          fontSize: '12px', 
          opacity: 0.8,
          fontWeight: '400'
        }}>
          轻量级WooCommerce管理工具
        </p>
      </div>
      
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ProLayout
          title=""
          logo={null}
          layout="top"
          splitMenus={false}
          contentWidth="Fluid"
          fixedHeader={true}
          menu={{ locale: false }}
          menuItemRender={(_, dom) => dom}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: t('storeManagement.title'),
            },
            ...routers,
          ]}
          headerTitleRender={() => null}
        >
          <PageContainer
            tabList={[
              {
                tab: (
                  <span>
                    <AppstoreOutlined /> {t('storeManagement.title')}
                  </span>
                ),
                key: 'stores',
              },
              {
                tab: (
                  <span>
                    <ShoppingCartOutlined /> {t('productManagement.title')}
                  </span>
                ),
                key: 'products',
                disabled: stores.length === 0,
              },
              {
                tab: (
                  <span>
                    <InfoCircleOutlined /> {t('about.title')}
                  </span>
                ),
                key: 'about',
              },
            ]}
            tabActiveKey={activeTab}
            onTabChange={(key) => setActiveTab(key as 'stores' | 'products' | 'about')}
          >
            {activeTab === 'stores' ? (
              <StoreManagement onStoreAdded={handleStoreAdded} />
            ) : activeTab === 'products' && stores.length > 0 && activeStore ? (
              <>
                {loading && (
                  <div style={{ marginBottom: 16 }}>
                    <Alert message={t('common.loading')} type="info" />
                  </div>
                )}
                <ProductManagement />
              </>
            ) : activeTab === 'about' ? (
              <About />
            ) : (
              <ProCard style={{ maxWidth: 500, margin: '0 auto', marginTop: 16 }} ghost>
                <div style={{ textAlign: 'center' }}>
                  <Title level={4} style={{ marginBottom: 12 }}>
                    {t('storeManagement.title')}
                  </Title>
                  <Text type="secondary" style={{ marginBottom: 16, display: 'block', fontSize: '13px' }}>
                    {t('storeManagement.noStoreMessage')}
                  </Text>
                  <Text type="secondary" style={{ marginBottom: 16, display: 'block', fontSize: '13px' }}>
                    {t('storeManagement.addStoreFirst')}
                  </Text>
                  <Button 
                    type="primary" 
                    onClick={() => setActiveTab('stores')}
                    icon={<AppstoreOutlined />}
                    size="small"
                  >
                    {t('storeManagement.addStore')}
                  </Button>
                </div>
              </ProCard>
            )}
          </PageContainer>
        </ProLayout>
      </div>
    </div>
  )
}

export default MaximizedApp
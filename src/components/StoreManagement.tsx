import React, { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Tag,
  message,
  Steps
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloudOutlined,
  LockOutlined,
  ApiOutlined
} from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store'
import { StoreConfig } from '../types'
import WooCommerceAPI from '../services/api'

const { Title, Text } = Typography
const { Item: FormItem } = Form

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
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({})
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({})
  const [form] = Form.useForm()
  
  // 添加绑定级别状态
  const [bindingLevel, setBindingLevel] = useState<'level1' | 'level2'>('level1')
  
  // 根据绑定级别设置默认认证方式
  const [newStore, setNewStore] = useState<Omit<StoreConfig, 'id' | 'isActive'>>({
    name: '',
    url: '',
    authType: 'woocommerce', // 一级绑定默认为WooCommerce API
    credentials: {
      username: '',
      password: '',
      consumerKey: '',
      consumerSecret: ''
    }
  })

  // 当绑定级别改变时，更新默认认证方式
  useEffect(() => {
    if (bindingLevel === 'level1') {
      setNewStore(prev => ({
        ...prev,
        authType: 'woocommerce', // 一级绑定默认为WooCommerce API
        credentials: {
          username: '',
          password: '',
          consumerKey: '',
          consumerSecret: ''
        }
      }))
      // 同步更新表单中的认证类型字段
      form.setFieldsValue({ authType: 'woocommerce' });
    } else {
      setNewStore(prev => ({
        ...prev,
        authType: 'wordpress', // 二级绑定默认为WordPress应用程序密码
        credentials: {
          username: '',
          password: '',
          consumerKey: '',
          consumerSecret: ''
        }
      }))
      // 同步更新表单中的认证类型字段
      form.setFieldsValue({ authType: 'wordpress' });
    }
  }, [bindingLevel, form])
  
  // 当模态框打开时，确保表单字段正确初始化
  useEffect(() => {
    if (isAdding) {
      // 确保每次打开模态框时都重置为一级绑定和默认认证方式
      setBindingLevel('level1');
      setNewStore(prev => ({
        ...prev,
        authType: 'woocommerce',
        credentials: {
          username: '',
          password: '',
          consumerKey: '',
          consumerSecret: ''
        }
      }));
      
      // 使用Form的setFieldsValue方法确保表单字段正确初始化
      form.setFieldsValue({
        name: '',
        url: '',
        authType: 'woocommerce'
      });
    }
  }, [isAdding, form]);

  const handleAddStore = () => {
    form.validateFields().then(() => {
      // 验证认证信息 - 改进验证逻辑
      if (newStore.authType === 'wordpress') {
        if (!newStore.credentials.username || !newStore.credentials.password) {
          message.error(t('storeManagement.credentialsRequired'));
          return;
        }
      } else {
        // 对于WooCommerce认证，至少需要填写一个认证字段
        if (!newStore.credentials.consumerKey && !newStore.credentials.consumerSecret) {
          message.error(t('storeManagement.credentialsRequired'));
          return;
        }
      }
      
      if (stores.length >= 3) {
        message.error(t('storeManagement.maxStoresReached'));
        return;
      }
      
      const store: StoreConfig = {
        ...newStore,
        id: Date.now().toString(),
        isActive: stores.length === 0 // 第一个店铺自动设为激活状态
      }
      
      addStore(store)
      setIsAdding(false)
      setBindingLevel('level1') // 重置为一级绑定
      setNewStore({
        name: '',
        url: '',
        authType: 'woocommerce', // 重置为默认值
        credentials: {
          username: '',
          password: '',
          consumerKey: '',
          consumerSecret: ''
        }
      })
      form.resetFields()
      
      if (onStoreAdded) onStoreAdded()
    }).catch(() => {
      message.error(t('storeManagement.pleaseFillAllFields'));
    });
  }

  const handleRemoveStore = (storeId: string) => {
    Modal.confirm({
      title: t('common.delete') + t('storeManagement.title') + '?',
      content: t('common.deleteConfirm'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: () => {
        removeStore(storeId)
      }
    });
  }

  const handleSetActiveStore = (storeId: string) => {
    setActiveStore(storeId)
  }

  const handleTestConnection = async (store: StoreConfig) => {
    setIsTesting(prev => ({ ...prev, [store.id]: true }))
    
    try {
      console.log('Testing connection for store:', store) // 添加调试日志
      const success = await WooCommerceAPI.testConnection(store)
      setTestResults(prev => ({
        ...prev,
        [store.id]: {
          success,
          message: success ? t('common.success') : t('storeManagement.connectionFailed')
        }
      }))
      
      // 如果测试连接成功且该店铺不是当前激活店铺，提示用户设置为当前店铺
      if (success && store.id !== activeStoreId) {
        Modal.confirm({
          title: t('storeManagement.setActive'),
          content: `${t('storeManagement.setActive')} ${store.name} ${t('storeManagement.setActive')}?`,
          okText: t('common.confirm'),
          cancelText: t('common.cancel'),
          onOk: () => {
            setActiveStore(store.id)
            // 测试连接成功后跳转到商品管理页面
            if (onStoreAdded) onStoreAdded()
          }
        })
      } else if (success && store.id === activeStoreId) {
        // 如果测试连接成功且该店铺已经是当前激活店铺，直接跳转到商品管理页面
        if (onStoreAdded) onStoreAdded()
      }
    } catch (error) {
      console.error('Test connection error:', error) // 添加调试日志
      setTestResults(prev => ({
        ...prev,
        [store.id]: {
          success: false,
          message: `${t('common.error')}: ${(error as Error).message || t('storeManagement.connectionFailed')}`
        }
      }))
    } finally {
      setIsTesting(prev => ({ ...prev, [store.id]: false }))
    }
  }



  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 16,
        padding: '0 16px'
      }}>
        <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
          {t('storeManagement.title')}
        </Title>
      </div>

      {stores.length === 0 ? (
        <ProCard style={{ textAlign: 'center', padding: '24px 16px' }} ghost>
          <CloudOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }} />
          <Title level={5} style={{ marginBottom: 8 }}>
            {t('storeManagement.noStores')}
          </Title>
          <Text type="secondary" style={{ marginBottom: 16, display: 'block', fontSize: '13px' }}>
            {t('storeManagement.addFirstStore')}
          </Text>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsAdding(true)}
            size="small"
          >
            {t('storeManagement.addStore')}
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <img 
              src="/images/donation-qrcode.jpg" 
              alt={t('about.donationQRCode')} 
              style={{ maxWidth: '200px', height: 'auto', border: '1px solid #f0f0f0', borderRadius: '8px' }}
            />
            <div style={{ marginTop: '12px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('about.supportDescription')}
              </Text>
            </div>
          </div>
        </ProCard>
      ) : (
        <div style={{ padding: '0 16px' }}>
          {stores.map(store => (
            <ProCard 
              key={store.id} 
              style={{ 
                marginBottom: 12,
                borderRadius: 8,
                border: activeStoreId === store.id ? '1px solid #1890ff' : '1px solid #f0f0f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <Text strong style={{ fontSize: '14px', marginRight: 8 }}>
                      {store.name}
                    </Text>
                    {store.isActive && (
                      <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: '10px', padding: '0 4px' }}>
                        {t('storeManagement.setActive')}
                      </Tag>
                    )}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>
                    {store.url}
                  </Text>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tag 
                      icon={store.authType === 'wordpress' ? <LockOutlined /> : <ApiOutlined />} 
                      color={store.authType === 'wordpress' ? 'processing' : 'default'}
                      style={{ fontSize: '10px', padding: '0 4px' }}
                    >
                      {store.authType === 'wordpress' 
                        ? t('storeManagement.wordpressAuth') 
                        : t('storeManagement.woocommerceAuth')}
                    </Tag>
                    {testResults[store.id] && (
                      <Tag 
                        color={testResults[store.id].success ? 'success' : 'error'}
                        style={{ fontSize: '10px', padding: '0 4px', marginLeft: 4 }}
                      >
                        {testResults[store.id].success 
                          ? t('storeManagement.connectionSuccess') 
                          : t('storeManagement.connectionFailed')}
                      </Tag>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button 
                    type="primary" 
                    icon={<SyncOutlined />} 
                    loading={isTesting[store.id]}
                    onClick={() => handleTestConnection(store)}
                    size="small"
                  >
                    {t('storeManagement.testConnection')}
                  </Button>
                  <Button 
                    icon={<EditOutlined />} 
                    onClick={() => {
                      // 编辑功能实现
                    }}
                    size="small"
                  />
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleRemoveStore(store.id)}
                    size="small"
                  />
                  {!store.isActive && (
                    <Button 
                      type="dashed" 
                      onClick={() => handleSetActiveStore(store.id)}
                      size="small"
                    >
                      {t('storeManagement.setActive')}
                    </Button>
                  )}
                </div>
              </div>
            </ProCard>
          ))}
        </div>
      )}

      <Modal
        title={t('storeManagement.addStore')}
        open={isAdding}
        onOk={handleAddStore}
        onCancel={() => {
          setIsAdding(false)
          setBindingLevel('level1') // 重置为一级绑定
        }}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        width={500}
      >
        <Form 
          form={form} 
          layout="vertical"
          initialValues={{
            name: '',
            url: '',
            authType: 'woocommerce'
          }}
        >
          <Steps 
            current={bindingLevel === 'level1' ? 0 : 1} 
            items={[
              { title: t('storeManagement.levelOneTitle') },
              { title: t('storeManagement.levelTwoTitle') }
            ]} 
            size="small"
            style={{ marginBottom: 16 }}
          />
          
          <FormItem
            name="bindingLevel"
            label={t('storeManagement.level')}
            initialValue="level1"
          >
            <Select 
              value={bindingLevel} 
              onChange={setBindingLevel}
              size="small"
            >
              <Select.Option value="level1">
                {t('storeManagement.levelOneBinding')} ({t('storeManagement.levelOneDescription')})
              </Select.Option>
              <Select.Option value="level2">
                {t('storeManagement.levelTwoBinding')} ({t('storeManagement.levelTwoDescription')})
              </Select.Option>
            </Select>
          </FormItem>

          <FormItem
            name="name"
            label={t('storeManagement.storeName')}
            rules={[{ required: true, message: t('storeManagement.storeName') + t('common.required') }]}
          >
            <Input 
              value={newStore.name}
              onChange={e => setNewStore({ ...newStore, name: e.target.value })}
              placeholder={t('storeManagement.storeName')}
              size="small"
            />
          </FormItem>

          <FormItem
            name="url"
            label={t('storeManagement.storeUrl')}
            rules={[
              { required: true, message: t('storeManagement.storeUrl') + t('common.required') },
              { pattern: /^https?:\/\/.+/, message: t('storeManagement.invalidUrl') }
            ]}
          >
            <Input 
              value={newStore.url}
              onChange={e => setNewStore({ ...newStore, url: e.target.value })}
              placeholder="https://example.com"
              size="small"
            />
          </FormItem>

          <FormItem
            name="authType"
            label={t('storeManagement.authType')}
            initialValue="woocommerce"
          >
            <Select 
              value={newStore.authType} 
              onChange={value => setNewStore({ 
                ...newStore, 
                authType: value as 'wordpress' | 'woocommerce',
                credentials: {
                  username: '',
                  password: '',
                  consumerKey: '',
                  consumerSecret: ''
                }
              })}
              size="small"
            >
              <Select.Option value="woocommerce">
                {t('storeManagement.woocommerceAuth')}
              </Select.Option>
              <Select.Option value="wordpress">
                {t('storeManagement.wordpressAuth')}
              </Select.Option>
            </Select>
          </FormItem>

          {newStore.authType === 'wordpress' ? (
            <>
              <FormItem
                name="username"
                label={t('storeManagement.username')}
                rules={[{ required: true, message: t('storeManagement.username') + t('common.required') }]}
              >
                <Input 
                  value={newStore.credentials.username}
                  onChange={e => setNewStore({ 
                    ...newStore, 
                    credentials: { ...newStore.credentials, username: e.target.value }
                  })}
                  placeholder={t('storeManagement.username')}
                  size="small"
                />
              </FormItem>
              <FormItem
                name="password"
                label={t('storeManagement.password')}
                rules={[{ required: true, message: t('storeManagement.password') + t('common.required') }]}
              >
                <Input.Password 
                  value={newStore.credentials.password}
                  onChange={e => setNewStore({ 
                    ...newStore, 
                    credentials: { ...newStore.credentials, password: e.target.value }
                  })}
                  placeholder={t('storeManagement.password')}
                  size="small"
                />
              </FormItem>
            </>
          ) : (
            <>
              <FormItem
                name="consumerKey"
                label={t('storeManagement.consumerKey')}
                rules={[{ required: true, message: t('storeManagement.consumerKey') + t('common.required') }]}
              >
                <Input 
                  value={newStore.credentials.consumerKey}
                  onChange={e => setNewStore({ 
                    ...newStore, 
                    credentials: { ...newStore.credentials, consumerKey: e.target.value }
                  })}
                  placeholder={t('storeManagement.consumerKey')}
                  size="small"
                />
              </FormItem>
              <FormItem
                name="consumerSecret"
                label={t('storeManagement.consumerSecret')}
                rules={[{ required: true, message: t('storeManagement.consumerSecret') + t('common.required') }]}
              >
                <Input.Password 
                  value={newStore.credentials.consumerSecret}
                  onChange={e => setNewStore({ 
                    ...newStore, 
                    credentials: { ...newStore.credentials, consumerSecret: e.target.value }
                  })}
                  placeholder={t('storeManagement.consumerSecret')}
                  size="small"
                />
              </FormItem>
            </>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default StoreManagement
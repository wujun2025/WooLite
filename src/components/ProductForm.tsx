import React, { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Input,
  Typography,
  Alert,
  Tabs,
  Space,
  message,
  Row,
  Col,
  Select
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  FileImageOutlined,
  TagOutlined,
  AppstoreOutlined,
  DollarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { ProForm, ProFormText, ProFormTextArea, ProFormDigit, ProFormSelect, ProFormSwitch } from '@ant-design/pro-form'
import { useTranslation } from '../hooks/useTranslation'
import { Product, ProductCategory } from '../types'

interface ProductFormProps {
  product: Product
  productCategories: ProductCategory[]
  onSave: (product: Product) => void
  onCancel: () => void
}

const { Title } = Typography
const { TabPane } = Tabs

const ProductForm: React.FC<ProductFormProps> = ({ product, productCategories, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Product>(product)
  const [activeTab, setActiveTab] = useState('1')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // 当product prop变化时更新formData
  useEffect(() => {
    console.log('Product prop changed:', product); // 添加调试日志
    setFormData(product)
  }, [product])

  const handleChange = (field: keyof Product, value: any) => {
    console.log(`Changing field ${field} to:`, value); // 添加调试日志
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('New form data:', newData); // 添加调试日志
      return newData;
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleCategoryChange = (index: number, field: string, value: string | number) => {
    const updatedCategories = [...formData.categories]
    updatedCategories[index] = { ...updatedCategories[index], [field]: value }
    setFormData(prev => ({ ...prev, categories: updatedCategories }))
  }

  const handleTagChange = (index: number, field: string, value: string) => {
    const updatedTags = [...formData.tags]
    updatedTags[index] = { ...updatedTags[index], [field]: value }
    setFormData(prev => ({ ...prev, tags: updatedTags }))
  }

  const handleImageChange = (index: number, field: string, value: string) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = { ...updatedImages[index], [field]: value }
    setFormData(prev => ({ ...prev, images: updatedImages }))
  }

  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, { id: 0, name: '', slug: '' }]
    }))
  }

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, { id: 0, name: '', slug: '' }]
    }))
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { id: 0, src: '', name: '', alt: '' }]
    }))
  }

  const removeCategory = (index: number) => {
    const updatedCategories = [...formData.categories]
    updatedCategories.splice(index, 1)
    setFormData(prev => ({ ...prev, categories: updatedCategories }))
  }

  const removeTag = (index: number) => {
    const updatedTags = [...formData.tags]
    updatedTags.splice(index, 1)
    setFormData(prev => ({ ...prev, tags: updatedTags }))
  }

  const removeImage = (index: number) => {
    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)
    setFormData(prev => ({ ...prev, images: updatedImages }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = t('productManagement.productName') + t('common.required')
    }
    
    if (formData.price < 0) {
      newErrors.price = t('productManagement.price') + t('common.required')
    }
    
    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = t('productManagement.stockQuantity') + t('common.required')
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData)
    } else {
      message.error(t('common.error'))
    }
  }

  return (
    <Card style={{ marginBottom: 20 }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        <InfoCircleOutlined style={{ marginRight: 8 }} />
        {formData.id ? t('productManagement.editProduct') : t('productManagement.addProduct')}
      </Title>
      
      {Object.keys(errors).length > 0 && (
        <Alert 
          message={t('common.error')}
          type="error" 
          style={{ marginBottom: 20 }}
        />
      )}
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
      >
        <TabPane 
          key="1" 
          tab={
            <span>
              <InfoCircleOutlined />
              {t('productManagement.basicInfo')}
            </span>
          }
        >
          <div style={{ padding: 20 }}>
            <ProForm 
              submitter={false}
              layout="vertical"
            >
              <ProFormText
                label={t('productManagement.productName')}
                name="name"
                initialValue={formData.name}
                fieldProps={{
                  onChange: (e) => handleChange('name', e.target.value),
                  value: formData.name
                }}
                rules={[
                  {
                    required: true,
                    message: t('productManagement.productName') + t('common.required'),
                  },
                ]}
              />
              
              <ProFormTextArea
                label={t('productManagement.productDescription')}
                name="description"
                initialValue={formData.description}
                fieldProps={{
                  onChange: (e) => handleChange('description', e.target.value),
                  value: formData.description,
                  rows: 4
                }}
              />
              
              <ProFormText
                label={t('productManagement.sku')}
                name="sku"
                initialValue={formData.sku}
                fieldProps={{
                  onChange: (e) => handleChange('sku', e.target.value),
                  value: formData.sku
                }}
              />
              
              <Row gutter={16}>
                <Col span={12}>
                  <ProFormDigit
                    label={t('productManagement.price')}
                    name="price"
                    initialValue={formData.price}
                    fieldProps={{
                      onChange: (value) => handleChange('price', value || 0),
                      value: formData.price,
                      precision: 2,
                      formatter: (value) => `¥ ${value}`,
                      parser: (value) => value!.replace(/¥\s?|(,*)/g, '') as unknown as number
                    }}
                    rules={[
                      {
                        required: true,
                        message: t('productManagement.price') + t('common.required'),
                      },
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <ProFormDigit
                    label={t('productManagement.regularPrice')}
                    name="regularPrice"
                    initialValue={formData.regularPrice}
                    fieldProps={{
                      onChange: (value) => handleChange('regularPrice', value || 0),
                      value: formData.regularPrice,
                      precision: 2,
                      formatter: (value) => `¥ ${value}`,
                      parser: (value) => value!.replace(/¥\s?|(,*)/g, '') as unknown as number
                    }}
                  />
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <ProFormSelect
                    label={t('productManagement.status')}
                    name="status"
                    initialValue={formData.status}
                    fieldProps={{
                      onChange: (value) => handleChange('status', value),
                      value: formData.status
                    }}
                    options={[
                      { label: t('productManagement.status.draft'), value: 'draft' },
                      { label: t('productManagement.status.publish'), value: 'publish' },
                      { label: t('productManagement.status.pending'), value: 'pending' }
                    ]}
                  />
                </Col>
                <Col span={12}>
                  <ProFormSelect
                    label={t('productManagement.productType')}
                    name="type"
                    initialValue={formData.type}
                    fieldProps={{
                      onChange: (value) => handleChange('type', value),
                      value: formData.type
                    }}
                    options={[
                      { label: t('productManagement.type.simple'), value: 'simple' },
                      { label: t('productManagement.type.variable'), value: 'variable' },
                      { label: t('productManagement.type.external'), value: 'external' }
                    ]}
                  />
                </Col>
              </Row>
            </ProForm>
          </div>
        </TabPane>
        
        <TabPane 
          key="2" 
          tab={
            <span>
              <AppstoreOutlined />
              {t('productManagement.categories')}
            </span>
          }
        >
          <div style={{ padding: 20 }}>
            <Title level={5} style={{ marginBottom: 20 }}>
              {t('productManagement.categories')}
            </Title>
            
            {formData.categories.map((category, index) => (
              <Space key={index} style={{ display: 'flex', marginBottom: 16 }} align="start">
                <Select
                  showSearch
                  placeholder={t('productManagement.selectCategory')}
                  optionFilterProp="children"
                  onChange={(value: number) => {
                    const selectedCategory = productCategories.find(cat => cat.id === value);
                    if (selectedCategory) {
                      handleCategoryChange(index, 'id', value);
                      handleCategoryChange(index, 'name', selectedCategory.name);
                      handleCategoryChange(index, 'slug', selectedCategory.slug);
                    }
                  }}
                  value={category.id || undefined}
                  style={{ flex: 1 }}
                  options={productCategories.map(cat => ({
                    label: cat.name,
                    value: cat.id
                  }))}
                />
                <Button 
                  type="primary" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeCategory(index)}
                />
              </Space>
            ))}
            
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addCategory}
              style={{ width: '100%' }}
            >
              {t('productManagement.addCategory')}
            </Button>
          </div>
        </TabPane>
        
        <TabPane 
          key="3" 
          tab={
            <span>
              <TagOutlined />
              {t('productManagement.tags')}
            </span>
          }
        >
          <div style={{ padding: 20 }}>
            <Title level={5} style={{ marginBottom: 20 }}>
              {t('productManagement.tags')}
            </Title>
            
            {formData.tags.map((tag, index) => (
              <Space key={index} style={{ display: 'flex', marginBottom: 16 }} align="start">
                <Input
                  placeholder={t('productManagement.tagName')}
                  value={tag.name}
                  onChange={(e) => handleTagChange(index, 'name', e.target.value)}
                  style={{ flex: 1 }}
                />
                <Input
                  placeholder="Slug"
                  value={tag.slug}
                  onChange={(e) => handleTagChange(index, 'slug', e.target.value)}
                  style={{ flex: 1 }}
                />
                <Button 
                  type="primary" 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeTag(index)}
                />
              </Space>
            ))}
            
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addTag}
              style={{ width: '100%' }}
            >
              {t('productManagement.addTag')}
            </Button>
          </div>
        </TabPane>
        
        <TabPane 
          key="4" 
          tab={
            <span>
              <FileImageOutlined />
              {t('productManagement.images')}
            </span>
          }
        >
          <div style={{ padding: 20 }}>
            <Title level={5} style={{ marginBottom: 20 }}>
              {t('productManagement.images')}
            </Title>
            
            {/* 绑定方式说明 */}
            <div style={{ 
              backgroundColor: '#e6f7ff', 
              border: '1px solid #91d5ff', 
              borderRadius: '4px', 
              padding: '12px', 
              marginBottom: '20px' 
            }}>
              <div style={{ 
                color: '#1890ff', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <InfoCircleOutlined style={{ marginRight: '8px' }} />
                {t('productManagement.imageBindingNotice')}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>• {t('storeManagement.woocommerceAuth')}：</span>
                  {t('productManagement.imageWooCommerceNotice')}
                </div>
                <div>
                  <span style={{ fontWeight: 'bold' }}>• {t('storeManagement.wordpressAuth')}：</span>
                  {t('productManagement.imageWordPressNotice')}
                </div>
              </div>
            </div>
            
            {formData.images.map((image, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <Space style={{ display: 'flex', marginBottom: 8 }} align="start">
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 4 }}>
                      <span>{t('productManagement.imageURL')}</span>
                      <span style={{ color: '#999', fontSize: '12px', marginLeft: 8 }}>
                        ({t('productManagement.imageURLDescription')})
                      </span>
                    </div>
                    <Input
                      placeholder={t('productManagement.imageURL')}
                      value={image.src || ''}
                      onChange={(e) => handleImageChange(index, 'src', e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 4 }}>
                      <span>{t('productManagement.imageName')}</span>
                      <span style={{ color: '#999', fontSize: '12px', marginLeft: 8 }}>
                        ({t('productManagement.imageNameDescription')})
                      </span>
                    </div>
                    <Input
                      placeholder={t('productManagement.imageName')}
                      value={image.name || ''}
                      onChange={(e) => handleImageChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <Button 
                    type="primary" 
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeImage(index)}
                  />
                </Space>
                {/* 图片预览 */}
                {image.src && (
                  <div style={{ marginTop: 8 }}>
                    <img 
                      src={image.src} 
                      alt={image.alt || image.name || 'Product image'} 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        objectFit: 'contain',
                        border: '1px solid #f0f0f0',
                        borderRadius: '4px',
                        padding: '4px'
                      }} 
                    />
                  </div>
                )}
              </div>
            ))}
            
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addImage}
              style={{ width: '100%' }}
            >
              {t('productManagement.addImage')}
            </Button>
          </div>
        </TabPane>
        
        <TabPane 
          key="5" 
          tab={
            <span>
              <DollarOutlined />
              {t('productManagement.pricingAndInventory')}
            </span>
          }
        >
          <div style={{ padding: 20 }}>
            <ProForm 
              submitter={false}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <ProFormDigit
                    label={t('productManagement.stockQuantity')}
                    name="stockQuantity"
                    initialValue={formData.stockQuantity}
                    fieldProps={{
                      onChange: (value) => handleChange('stockQuantity', value || 0),
                      value: formData.stockQuantity
                    }}
                  />
                </Col>
                <Col span={12}>
                  <ProFormSwitch
                    label={t('productManagement.manageStock')}
                    name="manageStock"
                    initialValue={formData.manageStock}
                    fieldProps={{
                      onChange: (checked) => handleChange('manageStock', checked),
                      checked: formData.manageStock
                    }}
                  />
                </Col>
              </Row>
              
              <ProFormSelect
                label={t('productManagement.stockStatus')}
                name="stockStatus"
                initialValue={formData.stockStatus}
                fieldProps={{
                  onChange: (value) => handleChange('stockStatus', value),
                  value: formData.stockStatus
                }}
                options={[
                  { label: t('productManagement.stockStatus.instock'), value: 'instock' },
                  { label: t('productManagement.stockStatus.outofstock'), value: 'outofstock' },
                  { label: t('productManagement.stockStatus.onbackorder'), value: 'onbackorder' }
                ]}
              />
            </ProForm>
          </div>
        </TabPane>
      </Tabs>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 20 }}>
        <Button onClick={onCancel} icon={<CloseOutlined />}>
          {t('common.cancel')}
        </Button>
        <Button type="primary" onClick={handleSubmit} icon={<SaveOutlined />}>
          {t('common.save')}
        </Button>
      </div>
    </Card>
  )
}

export default ProductForm
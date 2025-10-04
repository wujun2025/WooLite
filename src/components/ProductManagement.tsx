import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Input,
  Typography,
  Alert,
  Dropdown,
  Pagination,
  Table,
  Tag,
  Modal,
  Select,
  Popover,
  Image,
  Checkbox,
  MenuProps,
  message
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  MoreOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  UploadOutlined,
  FilterOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store'
import { Product, TranslationKeys, ProductCategory } from '../types'
import ProductForm from './ProductForm'
import WooCommerceAPI from '../services/api'

const { Title, Text } = Typography
const { Option } = Select

const ProductManagement: React.FC = () => {
  const { t } = useTranslation()
  const products = useAppStore(state => state.products)
  const setProducts = useAppStore(state => state.setProducts)
  const selectedProductIds = useAppStore(state => state.selectedProductIds)
  const toggleProductSelection = useAppStore(state => state.toggleProductSelection)
  const stores = useAppStore(state => state.stores)
  const activeStoreId = useAppStore(state => state.activeStoreId)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('all') // 搜索类型：all, name, sku, category, tag
  const [isAdding, setIsAdding] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null)
  const [loading, setLoading] = useState(false)
  const [batchActionVisible, setBatchActionVisible] = useState(false)
  // 添加分页状态
  const [totalItems, setTotalItems] = useState(0)
  // 添加筛选状态
  const [filters, setFilters] = useState({
    status: '',
    stockStatus: '',
    category: '',
    tag: '',
    minPrice: '',
    maxPrice: ''
  })
  // 添加商品分类状态
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const activeStore = stores.find(store => store.id === activeStoreId)

  // 从API获取商品分类数据
  const fetchProductCategories = async () => {
    if (!activeStore) return
    
    try {
      const categories = await WooCommerceAPI.getProductCategories(activeStore)
      setProductCategories(categories)
    } catch (error) {
      console.error('Failed to fetch product categories:', error)
      message.error(t('productManagement.loadFailed'))
    }
  }

  // 从API获取商品数据
  const fetchProducts = async (page: number = 1, itemsPerPage: number = 10) => {
    if (!activeStore) return
    
    // 只有在不是第一页或者有搜索/筛选条件时才显示加载状态
    // 这样可以避免在简单翻页时出现闪烁
    const shouldShowLoading = page === 1 || searchTerm || filters.status || filters.stockStatus || filters.minPrice || filters.maxPrice;
    if (shouldShowLoading) {
      setLoading(true)
    }
    
    try {
      // 构建搜索参数
      const searchParams: any = {
        page,
        per_page: itemsPerPage
      }
      
      // 添加搜索条件
      if (searchTerm.trim()) {
        switch (searchType) {
          case 'name':
            searchParams.search = searchTerm
            break
          case 'sku':
            searchParams.sku = searchTerm
            break
          case 'category':
            searchParams.category = searchTerm
            break
          case 'tag':
            searchParams.tag = searchTerm
            break
          default: // 'all'
            searchParams.search = searchTerm
            break
        }
      }
      
      // 添加筛选条件
      if (filters.status) {
        searchParams.status = filters.status
      }
      
      if (filters.stockStatus) {
        searchParams.stock_status = filters.stockStatus
      }
      
      if (filters.minPrice) {
        searchParams.min_price = filters.minPrice
      }
      
      if (filters.maxPrice) {
        searchParams.max_price = filters.maxPrice
      }
      
      console.log('Fetching products with params:', searchParams); // 添加调试日志
      const result = await WooCommerceAPI.getProducts(activeStore, searchParams)
      console.log('Fetch result:', result); // 添加调试日志
      
      setProducts(result.products)
      setTotalItems(result.totalItems)
      setCurrentPage(result.currentPage)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      message.error(t('productManagement.loadFailed'))
    } finally {
      if (shouldShowLoading) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    // 当搜索条件或排序改变时，重新获取第一页数据
    setCurrentPage(1)
    fetchProducts(1, itemsPerPage)
    // 获取商品分类数据
    fetchProductCategories()
  }, [searchTerm, searchType, sortConfig, activeStore, itemsPerPage])

  // 计算分页数据 - 移除客户端分页，因为我们使用服务器端分页
  // const indexOfLastItem = currentPage * itemsPerPage
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage
  // const currentItems = products.slice(indexOfFirstItem, indexOfLastItem)
  const currentItems = products // 直接使用从API获取的产品列表

  // 处理分页变化
  const handlePageChange = (pageNumber: number) => {
    console.log('Changing to page:', pageNumber); // 添加调试日志
    fetchProducts(pageNumber, itemsPerPage)
  }

  // 处理每页数量变化
  const handlePageSizeChange = (pageSize: number) => {
    console.log('Changing page size to:', pageSize); // 添加调试日志
    setItemsPerPage(pageSize)
    setCurrentPage(1)
    fetchProducts(1, pageSize) // 重置到第一页
  }

  const handleAddProduct = () => {
    setEditingProduct({
      name: '',
      description: '',
      price: 0,
      regularPrice: 0,
      sku: '',
      stockQuantity: 0,
      manageStock: false,
      stockStatus: 'instock',
      categories: [],
      tags: [],
      images: [],
      status: 'draft',
      type: 'simple'
    })
    setIsAdding(true)
  }

  const handleEditProduct = (product: Product) => {
    console.log('Editing product:', product); // 添加调试日志
    setEditingProduct(product)
    setIsAdding(true)
  }

  const handleDeleteProduct = async (productId: number) => {
    Modal.confirm({
      title: t('common.confirm'),
      content: t('common.delete') + t('productManagement.title') + '?',
      onOk: async () => {
        if (!activeStore) {
          message.error(t('storeManagement.noStoreSelected'))
          return
        }
        
        setLoading(true)
        try {
          await WooCommerceAPI.deleteProduct(activeStore, productId)
          // 更新本地状态
          setProducts(products.filter(p => p.id !== productId))
          message.success(t('common.success'))
        } catch (error) {
          console.error('Failed to delete product:', error)
          message.error(t('productManagement.deleteFailed'))
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) {
      message.warning(t('productManagement.bulkActions') + t('common.required'))
      return
    }
    
    Modal.confirm({
      title: t('common.confirm'),
      content: `${t('common.delete')} ${selectedProductIds.length} ${t('productManagement.title')}?`,
      onOk: async () => {
        if (!activeStore) {
          message.error(t('storeManagement.noStoreSelected'))
          return
        }
        
        setLoading(true)
        try {
          // 批量删除商品
          const promises = selectedProductIds.map(id => 
            WooCommerceAPI.deleteProduct(activeStore, id)
          )
          
          await Promise.all(promises)
          // 更新本地状态
          setProducts(products.filter(p => !selectedProductIds.includes(p.id!)))
          message.success(t('common.success'))
        } catch (error) {
          console.error('Failed to bulk delete products:', error)
          message.error(t('productManagement.bulkDeleteFailed'))
        } finally {
          setLoading(false)
        }
      }
    })
    setBatchActionVisible(false)
  }

  const handleBulkPublish = async () => {
    if (selectedProductIds.length === 0) {
      message.warning(t('productManagement.bulkActions') + t('common.required'))
      return
    }
    
    if (!activeStore) {
      message.error(t('storeManagement.noStoreSelected'))
      return
    }
    
    setLoading(true)
    try {
      // 调用API批量更新商品状态
      await WooCommerceAPI.bulkUpdateProducts(activeStore, selectedProductIds, 'publish')
      // 更新本地状态
      const updatedProducts = products.map(product => {
        if (selectedProductIds.includes(product.id!)) {
          return { ...product, status: 'publish' as const }
        }
        return product
      })
      setProducts(updatedProducts)
      message.success(t('common.success'))
    } catch (error) {
      console.error('Failed to bulk publish products:', error)
      message.error(t('productManagement.bulkPublishFailed'))
    } finally {
      setLoading(false)
    }
    setBatchActionVisible(false)
  }

  const handleBulkUnpublish = async () => {
    if (selectedProductIds.length === 0) {
      message.warning(t('productManagement.bulkActions') + t('common.required'))
      return
    }
    
    if (!activeStore) {
      message.error(t('storeManagement.noStoreSelected'))
      return
    }
    
    setLoading(true)
    try {
      // 调用API批量更新商品状态
      await WooCommerceAPI.bulkUpdateProducts(activeStore, selectedProductIds, 'draft')
      // 更新本地状态
      const updatedProducts = products.map(product => {
        if (selectedProductIds.includes(product.id!)) {
          return { ...product, status: 'draft' as const }
        }
        return product
      })
      setProducts(updatedProducts)
      message.success(t('common.success'))
    } catch (error) {
      console.error('Failed to bulk unpublish products:', error)
      message.error(t('productManagement.bulkUnpublishFailed'))
    } finally {
      setLoading(false)
    }
    setBatchActionVisible(false)
  }

  // 处理保存商品
  const handleSaveProduct = async (product: Product) => {
    if (!activeStore) return
    
    setLoading(true)
    try {
      if (product.id) {
        // 更新现有商品
        await WooCommerceAPI.updateProduct(activeStore, product)
        message.success(t('common.success'))
      } else {
        // 创建新商品
        await WooCommerceAPI.createProduct(activeStore, product)
        message.success(t('common.success'))
      }
      
      // 重新获取商品列表
      await fetchProducts(currentPage, itemsPerPage)
      
      // 重新获取商品分类（可能有新的分类被创建）
      await fetchProductCategories()
      
      // 关闭表单
      setIsAdding(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Failed to save product:', error)
      message.error(t('productManagement.saveFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsAdding(false)
    setEditingProduct(null)
  }

  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortIndicator = (key: keyof Product) => {
    if (!sortConfig || sortConfig.key !== key) return null
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
  }

  // 导出商品功能
  const handleExportProducts = () => {
    if (products.length === 0) {
      message.warning(t('common.noData'))
      return
    }
    
    // 准备导出数据
    const exportData = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      regularPrice: product.regularPrice,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      manageStock: product.manageStock,
      stockStatus: product.stockStatus,
      categories: product.categories.map(cat => cat.name).join(', '),
      tags: product.tags.map(tag => tag.name).join(', '),
      status: product.status,
      type: product.type
    }))
    
    // 创建CSV内容
    const headers = Object.keys(exportData[0]).join(',')
    const rows = exportData.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    )
    
    const csvContent = [headers, ...rows].join('\n')
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `products_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 导入商品功能
  const handleImportProducts = () => {
    if (!activeStore) {
      message.error(t('storeManagement.noStoreSelected'))
      return
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    if (!file.name.endsWith('.csv')) {
      message.error(t('productManagement.importProducts') + ': ' + '请选择CSV文件')
      return
    }
    
    setLoading(true)
    try {
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      // 解析CSV数据
      const importedProducts: Product[] = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        const product: any = {}
        
        headers.forEach((header, index) => {
          const value = values[index]
          if (header === 'price' || header === 'regularPrice') {
            product[header] = parseFloat(value) || 0
          } else if (header === 'stockQuantity') {
            product[header] = parseInt(value) || 0
          } else if (header === 'manageStock') {
            product[header] = value === 'true'
          } else {
            product[header] = value
          }
        })
        
        // 转换categories和tags
        if (product.categories) {
          product.categories = product.categories.split(',').map((cat: string) => ({
            id: 0,
            name: cat.trim(),
            slug: cat.trim().toLowerCase().replace(/\s+/g, '-')
          }))
        } else {
          product.categories = []
        }
        
        if (product.tags) {
          product.tags = product.tags.split(',').map((tag: string) => ({
            id: 0,
            name: tag.trim(),
            slug: tag.trim().toLowerCase().replace(/\s+/g, '-')
          }))
        } else {
          product.tags = []
        }
        
        // 设置默认值
        product.images = []
        product.status = product.status || 'draft'
        product.type = product.type || 'simple'
        product.stockStatus = product.stockStatus || 'instock'
        
        importedProducts.push(product)
      }
      
      // 上传到WooCommerce
      const createdProducts: Product[] = []
      if (activeStore) {  // 添加类型检查
        for (const product of importedProducts) {
          try {
            const createdProduct = await WooCommerceAPI.createProduct(activeStore, product)
            createdProducts.push(createdProduct)
          } catch (error) {
            console.error('Failed to import product:', error)
          }
        }
      }
      
      // 更新本地状态
      setProducts([...products, ...createdProducts])
      message.success(`${t('productManagement.importProducts')}: ` + `成功导入 ${createdProducts.length} 个商品`)
    } catch (error) {
      console.error('Failed to import products:', error)
      message.error(t('productManagement.importProducts') + ': ' + '导入失败，请检查文件格式')
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  if (!activeStore) {
    return (
      <div style={{ padding: 20 }}>
        <ProCard>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Title level={4}>
              <DatabaseOutlined style={{ marginRight: 8 }} />
              {t('storeManagement.title')}
            </Title>
            <Text type="secondary">
              {t('storeManagement.noStoreMessage')}
            </Text>
          </div>
        </ProCard>
      </div>
    )
  }

  // 批量操作菜单
  const batchActionMenu: MenuProps['items'] = [
    {
      key: 'publish',
      icon: <CheckOutlined />,
      label: t('productManagement.bulkPublish'),
      onClick: handleBulkPublish
    },
    {
      key: 'unpublish',
      icon: <CloseOutlined />,
      label: t('productManagement.bulkUnpublish'),
      onClick: handleBulkUnpublish
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: t('common.delete'),
      danger: true,
      onClick: handleBulkDelete
    }
  ]

  // 表格列定义
  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => {
            if (e.target.checked) {
              // 选择所有当前页面的商品
              currentItems.forEach(p => toggleProductSelection(p.id!))
            } else {
              // 取消选择所有当前页面的商品
              currentItems.forEach(p => toggleProductSelection(p.id!))
            }
          }}
        />
      ),
      dataIndex: 'selection',
      width: 50,
      render: (_: any, record: Product) => (
        <Checkbox
          checked={selectedProductIds.includes(record.id!)}
          onChange={() => toggleProductSelection(record.id!)}
        />
      )
    },
    {
      title: (
        <span 
          onClick={() => handleSort('name')} 
          style={{ cursor: 'pointer' }}
        >
          {t('productManagement.productName')}{getSortIndicator('name')}
        </span>
      ),
      dataIndex: 'name',
      render: (text: string, record: Product) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {record.images && record.images.length > 0 && record.images[0].src ? (
            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Image
                    src={record.images[0].src}
                    alt={record.images[0].alt || record.images[0].name}
                    width={200}
                    height={200}
                    style={{ objectFit: 'contain' }}
                  />
                  <div style={{ marginTop: 8 }}>{t('productManagement.previewImage')}</div>
                </div>
              }
              trigger="hover"
            >
              <div style={{ width: 32, height: 32, overflow: 'hidden', borderRadius: 4 }}>
                <img 
                  src={record.images[0].src} 
                  alt={record.images[0].alt || record.images[0].name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Popover>
          ) : (
            <div style={{ width: 32, height: 32, backgroundColor: '#f0f0f0', borderRadius: 4 }} />
          )}
          <span>{text}</span>
        </div>
      )
    },
    {
      title: (
        <span 
          onClick={() => handleSort('sku')} 
          style={{ cursor: 'pointer' }}
        >
          {t('productManagement.sku')}{getSortIndicator('sku')}
        </span>
      ),
      dataIndex: 'sku'
    },
    {
      title: (
        <span 
          onClick={() => handleSort('price')} 
          style={{ cursor: 'pointer' }}
        >
          {t('productManagement.price')}{getSortIndicator('price')}
        </span>
      ),
      dataIndex: 'price',
      render: (price: number) => <span>¥{price.toFixed(2)}</span>
    },
    {
      title: t('productManagement.stockStatus'),
      dataIndex: 'stockStatus',
      render: (stockStatus: string) => {
        const key = `productManagement.stockStatus.${stockStatus}` as keyof TranslationKeys;
        return (
          <Tag 
            color={stockStatus === 'instock' ? 'green' : stockStatus === 'outofstock' ? 'red' : 'orange'}
          >
            {t(key)}
          </Tag>
        )
      }
    },
    {
      title: t('productManagement.productType'),
      dataIndex: 'type',
      render: (type: string) => {
        const key = `productManagement.type.${type}` as keyof TranslationKeys;
        return (
          <Tag 
            color={type === 'simple' ? 'blue' : 'purple'}
          >
            {t(key)}
          </Tag>
        )
      }
    },
    {
      title: t('productManagement.status'),
      dataIndex: 'status',
      render: (status: string) => {
        const key = `productManagement.status.${status}` as keyof TranslationKeys;
        return (
          <Tag 
            color={status === 'publish' ? 'green' : 'gray'}
          >
            {t(key)}
          </Tag>
        )
      }
    },
    {
      title: t('productManagement.actions'),
      dataIndex: 'actions',
      render: (_: any, record: Product) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditProduct(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteProduct(record.id!)}
          />
        </div>
      )
    }
  ]

  return (
    <div style={{ padding: '16px 0' }}>
      <ProCard style={{ marginBottom: 16, padding: '16px' }} bodyStyle={{ padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
            {t('productManagement.title')}
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
            size="small"
          >
            {t('productManagement.addProduct')}
          </Button>
        </div>
        
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <Input
            placeholder={t('productManagement.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            size="small"
          />
          
          <Select
            value={searchType}
            onChange={setSearchType}
            size="small"
            style={{ width: 120 }}
          >
            <Option value="all">{t('common.all')}</Option>
            <Option value="name">{t('productManagement.searchByName')}</Option>
            <Option value="sku">{t('productManagement.searchBySku')}</Option>
          </Select>
          
          <Popover
            content={
              <div style={{ width: 300 }}>
                <div style={{ marginBottom: 12 }}>
                  <Text style={{ display: 'block', marginBottom: 4, fontSize: '12px' }}>
                    {t('productManagement.status')}
                  </Text>
                  <Select
                    value={filters.status}
                    onChange={(value) => setFilters({...filters, status: value})}
                    style={{ width: '100%' }}
                    size="small"
                  >
                    <Option value="">{t('common.all')}</Option>
                    <Option value="draft">{t('productManagement.status.draft')}</Option>
                    <Option value="pending">{t('productManagement.status.pending')}</Option>
                    <Option value="private">{t('productManagement.status.private')}</Option>
                    <Option value="publish">{t('productManagement.status.publish')}</Option>
                  </Select>
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <Text style={{ display: 'block', marginBottom: 4, fontSize: '12px' }}>
                    {t('productManagement.stockStatus')}
                  </Text>
                  <Select
                    value={filters.stockStatus}
                    onChange={(value) => setFilters({...filters, stockStatus: value})}
                    style={{ width: '100%' }}
                    size="small"
                  >
                    <Option value="">{t('common.all')}</Option>
                    <Option value="instock">{t('productManagement.stockStatus.instock')}</Option>
                    <Option value="outofstock">{t('productManagement.stockStatus.outofstock')}</Option>
                    <Option value="onbackorder">{t('productManagement.stockStatus.onbackorder')}</Option>
                  </Select>
                </div>
                
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <Text style={{ display: 'block', marginBottom: 4, fontSize: '12px' }}>
                      {t('productManagement.price')} {t('common.min')}
                    </Text>
                    <Input
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      placeholder="0"
                      size="small"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text style={{ display: 'block', marginBottom: 4, fontSize: '12px' }}>
                      {t('productManagement.price')} {t('common.max')}
                    </Text>
                    <Input
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      placeholder="1000"
                      size="small"
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      setFilters({
                        status: '',
                        stockStatus: '',
                        category: '',
                        tag: '',
                        minPrice: '',
                        maxPrice: ''
                      })
                    }}
                  >
                    {t('common.reset')}
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => fetchProducts(1, itemsPerPage)}
                  >
                    {t('common.apply')}
                  </Button>
                </div>
              </div>
            }
            title={t('productManagement.filter')}
            trigger="click"
          >
            <Button icon={<FilterOutlined />} size="small">
              {t('productManagement.filter')}
            </Button>
          </Popover>
          
          <Button icon={<DownloadOutlined />} onClick={handleExportProducts} size="small">
            {t('productManagement.exportProducts')}
          </Button>
          
          <Button icon={<UploadOutlined />} onClick={handleImportProducts} size="small">
            {t('productManagement.importProducts')}
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            style={{ display: 'none' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          {selectedProductIds.length > 0 && (
            <>
              <Text style={{ fontSize: '12px' }}>
                已选择 {selectedProductIds.length} 项
              </Text>
              <Dropdown 
                menu={{ items: batchActionMenu }}
                trigger={['click']}
                onOpenChange={setBatchActionVisible}
                open={batchActionVisible}
              >
                <Button icon={<MoreOutlined />} size="small">
                  批量操作
                </Button>
              </Dropdown>
            </>
          )}
        </div>
      </ProCard>
      
      {loading && (
        <div style={{ marginBottom: 16 }}>
          <Alert message={t('common.loading')} type="info" />
        </div>
      )}
      
      {isAdding && editingProduct && (
        <ProductForm 
          product={editingProduct}
          productCategories={productCategories}
          onSave={handleSaveProduct}
          onCancel={handleCancelEdit}
        />
      )}
      
      {products.length === 0 && !isAdding ? (
        <ProCard style={{ maxWidth: 500, margin: '0 auto', padding: '24px 16px' }} ghost>
          <div style={{ textAlign: 'center' }}>
            <DatabaseOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 12 }} />
            <Title level={5} style={{ marginBottom: 8 }}>
              {t('productManagement.noProducts')}
            </Title>
            <Text type="secondary" style={{ marginBottom: 16, display: 'block', fontSize: '13px' }}>
              {t('productManagement.addFirstProduct')}
            </Text>
            <Button 
              type="primary" 
              onClick={handleAddProduct}
              icon={<PlusOutlined />}
              size="small"
            >
              {t('productManagement.addProduct')}
            </Button>
          </div>
        </ProCard>
      ) : (
        <>
          {/* 商品列表 */}
          <ProCard style={{ marginBottom: 16 }}>
            <Table
              columns={columns}
              dataSource={currentItems}
              pagination={false}
              rowKey="id"
              scroll={{ x: '100%' }}
              size="small"
            />
            
            {/* 分页控件 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <Pagination
                total={totalItems}
                current={currentPage}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                showTotal={(total) => `共 ${total} 条`}
                showQuickJumper
                size="small"
                showSizeChanger
                pageSizeOptions={['10', '20', '50', '100']}
                onShowSizeChange={handlePageSizeChange}
              />
            </div>
          </ProCard>
        </>
      )}
    </div>
  )
}

export default ProductManagement
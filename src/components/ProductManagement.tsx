import React, { useState, useEffect } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store'
import { Product } from '../types'
import ProductForm from './ProductForm'

const ProductManagement: React.FC = () => {
  const { t } = useTranslation()
  const products = useAppStore(state => state.products)
  const setProducts = useAppStore(state => state.setProducts)
  const selectedProductIds = useAppStore(state => state.selectedProductIds)
  const toggleProductSelection = useAppStore(state => state.toggleProductSelection)
  const stores = useAppStore(state => state.stores)
  const activeStoreId = useAppStore(state => state.activeStoreId)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  
  const activeStore = stores.find(store => store.id === activeStoreId)

  useEffect(() => {
    // 过滤商品
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [products, searchTerm])

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
    setEditingProduct(product)
    setIsAdding(true)
  }

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm(t('common.delete') + '?')) {
      // 在实际实现中，这里会调用API删除商品
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return
    
    if (window.confirm(`${t('common.delete')} ${selectedProductIds.length} ${t('productManagement.title')}?`)) {
      // 在实际实现中，这里会调用API批量删除商品
      setProducts(products.filter(p => !selectedProductIds.includes(p.id!)))
    }
  }

  const handleBulkPublish = () => {
    if (selectedProductIds.length === 0) return
    
    // 在实际实现中，这里会调用API批量更新商品状态
    const updatedProducts = products.map(product => {
      if (selectedProductIds.includes(product.id!)) {
        return { ...product, status: 'publish' as const }
      }
      return product
    })
    setProducts(updatedProducts)
  }

  const handleBulkUnpublish = () => {
    if (selectedProductIds.length === 0) return
    
    // 在实际实现中，这里会调用API批量更新商品状态
    const updatedProducts = products.map(product => {
      if (selectedProductIds.includes(product.id!)) {
        return { ...product, status: 'draft' as const }
      }
      return product
    })
    setProducts(updatedProducts)
  }

  const handleSaveProduct = (product: Product) => {
    if (product.id) {
      // 更新现有商品
      const updatedProducts = products.map(p => 
        p.id === product.id ? product : p
      )
      setProducts(updatedProducts)
    } else {
      // 添加新商品
      const newProduct = { ...product, id: Date.now() }
      setProducts([...products, newProduct])
    }
    
    setIsAdding(false)
    setEditingProduct(null)
  }

  const handleCancelEdit = () => {
    setIsAdding(false)
    setEditingProduct(null)
  }

  if (!activeStore) {
    return (
      <div className="product-management">
        <p>请先绑定店铺</p>
      </div>
    )
  }

  return (
    <div className="product-management">
      <div className="header">
        <h2>{t('productManagement.title')}</h2>
        <button onClick={handleAddProduct}>
          {t('productManagement.addProduct')}
        </button>
      </div>
      
      <div className="toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder={t('productManagement.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="bulk-actions">
          <select 
            onChange={(e) => {
              switch (e.target.value) {
                case 'publish':
                  handleBulkPublish()
                  break
                case 'unpublish':
                  handleBulkUnpublish()
                  break
                case 'delete':
                  handleBulkDelete()
                  break
              }
              e.target.value = ''
            }}
          >
            <option value="">{t('productManagement.bulkActions')}</option>
            <option value="publish">{t('productManagement.bulkPublish')}</option>
            <option value="unpublish">{t('productManagement.bulkUnpublish')}</option>
            <option value="delete">{t('productManagement.bulkDelete')}</option>
          </select>
        </div>
      </div>
      
      {isAdding && editingProduct && (
        <ProductForm 
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelEdit}
        />
      )}
      
      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      // 选择所有商品
                      products.forEach(p => toggleProductSelection(p.id!))
                    } else {
                      // 取消选择所有商品
                      selectedProductIds.forEach(id => toggleProductSelection(id))
                    }
                  }}
                />
              </th>
              <th>{t('productManagement.productName')}</th>
              <th>{t('productManagement.sku')}</th>
              <th>{t('productManagement.price')}</th>
              <th>{t('productManagement.stockStatus')}</th>
              <th>{t('productManagement.productType')}</th>
              <th>{t('productManagement.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(product.id!)}
                    onChange={() => toggleProductSelection(product.id!)}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.price}</td>
                <td>{product.stockStatus}</td>
                <td>{product.type}</td>
                <td>
                  <button onClick={() => handleEditProduct(product)}>
                    {t('common.edit')}
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id!)}>
                    {t('common.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManagement
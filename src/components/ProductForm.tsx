import React, { useState } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Product } from '../types'

interface ProductFormProps {
  product: Product
  onSave: (product: Product) => void
  onCancel: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Product>(product)

  const handleChange = (field: keyof Product, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="product-form">
      <h3>{product.id ? t('productManagement.editProduct') : t('productManagement.addProduct')}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('productManagement.productName')}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>{t('productManagement.sku')}</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>{t('productManagement.price')}</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            step="0.01"
          />
        </div>
        
        <div className="form-group">
          <label>{t('productManagement.productType')}</label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as any)}
          >
            <option value="simple">Simple Product</option>
            <option value="external">External Product</option>
            <option value="variable" disabled>Variable Product (待开发)</option>
            <option value="grouped" disabled>Grouped Product (待开发)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>{t('productManagement.stockStatus')}</label>
          <select
            value={formData.stockStatus}
            onChange={(e) => handleChange('stockStatus', e.target.value as any)}
          >
            <option value="instock">In Stock</option>
            <option value="outofstock">Out of Stock</option>
            <option value="onbackorder">On Backorder</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Stock Quantity</label>
          <input
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => handleChange('stockQuantity', parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit">{t('common.save')}</button>
          <button type="button" onClick={onCancel}>{t('common.cancel')}</button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
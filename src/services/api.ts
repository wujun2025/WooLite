import { StoreConfig, Product, OrderNotification, Order, PaginatedProducts, ProductCategory } from '../types'

class WooCommerceAPI {
  private static instance: WooCommerceAPI

  private constructor() {}

  static getInstance(): WooCommerceAPI {
    if (!WooCommerceAPI.instance) {
      WooCommerceAPI.instance = new WooCommerceAPI()
    }
    return WooCommerceAPI.instance
  }

  // 生成认证URL参数
  private getAuthParams(store: StoreConfig): string {
    if (store.authType === 'wordpress' && store.credentials.username && store.credentials.password) {
      // WordPress应用密码认证
      const credentials = btoa(`${store.credentials.username}:${store.credentials.password}`)
      return `consumer_key=${credentials}&consumer_secret=`
    } else if (store.authType === 'woocommerce' && (store.credentials.consumerKey || store.credentials.consumerSecret)) {
      // WooCommerce API密钥认证 - 只要有一个字段就尝试认证
      const consumerKey = store.credentials.consumerKey || ''
      const consumerSecret = store.credentials.consumerSecret || ''
      return `consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`
    }
    return ''
  }

  // 生成完整的API URL
  private getApiUrl(store: StoreConfig, endpoint: string, params: Record<string, any> = {}): string {
    const baseUrl = store.url.endsWith('/') ? store.url.slice(0, -1) : store.url
    const apiUrl = `${baseUrl}/wp-json/wc/v3/${endpoint}`
    
    // 添加认证参数
    const authParams = this.getAuthParams(store)
    const paramArray = []
    
    if (authParams) {
      paramArray.push(authParams)
    }
    
    // 添加其他参数
    Object.keys(params).forEach(key => {
      paramArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    })
    
    const queryString = paramArray.join('&')
    return queryString ? `${apiUrl}?${queryString}` : apiUrl
  }

  // 发送HTTP请求
  private async sendRequest(url: string, options: RequestInit = {}): Promise<any> {
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
    const finalOptions = { ...defaultOptions, ...options }
    
    try {
      console.log('Sending request to:', url) // 添加调试日志
      const response = await fetch(url, finalOptions)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API request failed with status:', response.status, 'Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      // 获取分页头信息
      const total = response.headers.get('X-WP-Total')
      const totalPages = response.headers.get('X-WP-TotalPages')
      
      const data = await response.json()
      
      // 如果有分页信息，添加到响应中
      if (total && totalPages) {
        data._pagination = {
          total: parseInt(total, 10),
          totalPages: parseInt(totalPages, 10)
        }
      }
      
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // 测试店铺连接
  async testConnection(store: StoreConfig): Promise<boolean> {
    try {
      const url = this.getApiUrl(store, 'system_status')
      console.log('Testing connection with URL:', url) // 添加调试日志
      console.log('Store config:', store) // 添加调试日志
      const response = await this.sendRequest(url)
      console.log('Connection test response:', response) // 添加调试日志
      return true
    } catch (error) {
      console.error('Connection test failed:', error)
      // 添加更详细的错误信息
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      return false
    }
  }

  // 获取商品列表
  async getProducts(store: StoreConfig, params?: any): Promise<PaginatedProducts> {
    try {
      const url = this.getApiUrl(store, 'products', params)
      console.log('Fetching products with URL:', url) // 添加调试日志
      const response = await this.sendRequest(url)
      console.log('API response:', response); // 添加调试日志
      
      // 转换API响应为Product对象
      const products = response.map((product: any) => {
        console.log('Processing product:', product); // 添加调试日志
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          shortDescription: product.short_description,
          price: parseFloat(product.price) || 0,
          regularPrice: parseFloat(product.regular_price) || 0,
          salePrice: parseFloat(product.sale_price) || 0,
          sku: product.sku,
          stockQuantity: product.stock_quantity || 0,
          manageStock: product.manage_stock || false,
          stockStatus: product.stock_status || 'instock',
          categories: product.categories || [],
          tags: product.tags || [],
          images: product.images || [],
          status: product.status || 'draft',
          type: product.type || 'simple',
          attributes: product.attributes || [],
          variations: product.variations || []
        }
      })
      
      // 获取分页信息
      const pagination = response._pagination || {}
      const totalItems = pagination.total || 0
      const totalPages = pagination.totalPages || 0
      
      // 从params中获取分页参数，如果没有则使用默认值
      const page = params?.page || 1
      const perPage = params?.per_page || 10
      
      console.log('Pagination info:', { totalItems, totalPages, page, perPage }); // 添加调试日志
      
      // 返回产品和分页信息
      return {
        products,
        totalPages,
        totalItems,
        currentPage: page,
        itemsPerPage: perPage
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      throw new Error('Failed to fetch products')
    }
  }

  // 获取商品分类
  async getProductCategories(store: StoreConfig): Promise<ProductCategory[]> {
    try {
      const url = this.getApiUrl(store, 'products/categories', { per_page: 100 })
      const response = await this.sendRequest(url)
      
      // 转换API响应为ProductCategory对象
      return response.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug
      }))
    } catch (error) {
      console.error('Failed to fetch product categories:', error)
      throw new Error('Failed to fetch product categories')
    }
  }

  // 创建商品
  async createProduct(store: StoreConfig, product: Product): Promise<Product> {
    try {
      const url = this.getApiUrl(store, 'products')
      
      // 准备发送给API的数据
      const productData = {
        name: product.name,
        description: product.description,
        short_description: product.shortDescription,
        price: product.price.toString(),
        regular_price: product.regularPrice.toString(),
        sale_price: product.salePrice?.toString() || '',
        sku: product.sku,
        stock_quantity: product.stockQuantity,
        manage_stock: product.manageStock,
        stock_status: product.stockStatus,
        categories: product.categories,
        tags: product.tags,
        images: product.images,
        status: product.status,
        type: product.type,
        attributes: product.attributes,
        default_attributes: product.attributes?.filter(attr => attr.variation).map(attr => ({
          name: attr.name,
          option: attr.options[0] || ''
        })) || []
      }
      
      const createdProduct = await this.sendRequest(url, {
        method: 'POST',
        body: JSON.stringify(productData)
      })
      
      // 转换响应为Product对象
      return {
        id: createdProduct.id,
        name: createdProduct.name,
        description: createdProduct.description,
        shortDescription: createdProduct.short_description,
        price: parseFloat(createdProduct.price) || 0,
        regularPrice: parseFloat(createdProduct.regular_price) || 0,
        salePrice: parseFloat(createdProduct.sale_price) || 0,
        sku: createdProduct.sku,
        stockQuantity: createdProduct.stock_quantity || 0,
        manageStock: createdProduct.manage_stock || false,
        stockStatus: createdProduct.stock_status || 'instock',
        categories: createdProduct.categories || [],
        tags: createdProduct.tags || [],
        images: createdProduct.images || [],
        status: createdProduct.status || 'draft',
        type: createdProduct.type || 'simple',
        attributes: createdProduct.attributes || [],
        variations: createdProduct.variations || []
      }
    } catch (error) {
      console.error('Failed to create product:', error)
      throw new Error('Failed to create product')
    }
  }

  // 更新商品
  async updateProduct(store: StoreConfig, product: Product): Promise<Product> {
    try {
      if (!product.id) {
        throw new Error('Product ID is required for update')
      }
      
      const url = this.getApiUrl(store, `products/${product.id}`)
      
      // 准备发送给API的数据
      const productData = {
        name: product.name,
        description: product.description,
        short_description: product.shortDescription,
        price: product.price.toString(),
        regular_price: product.regularPrice.toString(),
        sale_price: product.salePrice?.toString() || '',
        sku: product.sku,
        stock_quantity: product.stockQuantity,
        manage_stock: product.manageStock,
        stock_status: product.stockStatus,
        categories: product.categories,
        tags: product.tags,
        images: product.images,
        status: product.status,
        type: product.type,
        attributes: product.attributes,
        default_attributes: product.attributes?.filter(attr => attr.variation).map(attr => ({
          name: attr.name,
          option: attr.options[0] || ''
        })) || []
      }
      
      const updatedProduct = await this.sendRequest(url, {
        method: 'PUT',
        body: JSON.stringify(productData)
      })
      
      // 转换响应为Product对象
      return {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        shortDescription: updatedProduct.short_description,
        price: parseFloat(updatedProduct.price) || 0,
        regularPrice: parseFloat(updatedProduct.regular_price) || 0,
        salePrice: parseFloat(updatedProduct.sale_price) || 0,
        sku: updatedProduct.sku,
        stockQuantity: updatedProduct.stock_quantity || 0,
        manageStock: updatedProduct.manage_stock || false,
        stockStatus: updatedProduct.stock_status || 'instock',
        categories: updatedProduct.categories || [],
        tags: updatedProduct.tags || [],
        images: updatedProduct.images || [],
        status: updatedProduct.status || 'draft',
        type: updatedProduct.type || 'simple',
        attributes: updatedProduct.attributes || [],
        variations: updatedProduct.variations || []
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      throw new Error('Failed to update product')
    }
  }

  // 删除商品
  async deleteProduct(store: StoreConfig, productId: number): Promise<boolean> {
    try {
      const url = this.getApiUrl(store, `products/${productId}`, { force: true })
      await this.sendRequest(url, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw new Error('Failed to delete product')
    }
  }

  // 批量更新商品状态
  async bulkUpdateProducts(store: StoreConfig, productIds: number[], status: 'publish' | 'private' | 'draft'): Promise<boolean> {
    try {
      // WooCommerce API不直接支持批量更新，需要逐个更新
      const promises = productIds.map(id => 
        this.updateProduct(store, { id, status } as Product)
      )
      
      await Promise.all(promises)
      return true
    } catch (error) {
      console.error('Failed to bulk update products:', error)
      throw new Error('Failed to bulk update products')
    }
  }

  // 获取订单列表
  async getOrders(store: StoreConfig, params?: any): Promise<Order[]> {
    try {
      const url = this.getApiUrl(store, 'orders', params)
      const orders = await this.sendRequest(url)
      
      // 转换API响应为Order对象
      return orders.map((order: any) => ({
        id: order.id,
        number: order.number,
        status: order.status,
        currency: order.currency,
        total: order.total,
        customerNote: order.customer_note,
        dateCreated: order.date_created,
        dateModified: order.date_modified,
        billing: {
          firstName: order.billing?.first_name || '',
          lastName: order.billing?.last_name || '',
          company: order.billing?.company || '',
          address1: order.billing?.address_1 || '',
          address2: order.billing?.address_2 || '',
          city: order.billing?.city || '',
          state: order.billing?.state || '',
          postcode: order.billing?.postcode || '',
          country: order.billing?.country || '',
          email: order.billing?.email || '',
          phone: order.billing?.phone || ''
        },
        shipping: {
          firstName: order.shipping?.first_name || '',
          lastName: order.shipping?.last_name || '',
          company: order.shipping?.company || '',
          address1: order.shipping?.address_1 || '',
          address2: order.shipping?.address_2 || '',
          city: order.shipping?.city || '',
          state: order.shipping?.state || '',
          postcode: order.shipping?.postcode || '',
          country: order.shipping?.country || ''
        },
        lineItems: order.line_items?.map((item: any) => ({
          id: item.id,
          name: item.name,
          productId: item.product_id,
          variationId: item.variation_id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
          total: item.total
        })) || []
      }))
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      throw new Error('Failed to fetch orders')
    }
  }

  // 获取订单通知
  async getOrderNotifications(store: StoreConfig): Promise<OrderNotification> {
    try {
      // 获取待处理的订单
      const orders = await this.getOrders(store, { status: 'pending', per_page: 10 })
      
      // 计算未读订单数量
      const unreadCount = orders.length
      
      return {
        storeId: store.id,
        unreadCount,
        lastChecked: new Date().toISOString(),
        orders: unreadCount > 0 ? orders : undefined
      }
    } catch (error) {
      console.error('Failed to fetch order notifications:', error)
      throw new Error('Failed to fetch order notifications')
    }
  }
}

export default WooCommerceAPI.getInstance()
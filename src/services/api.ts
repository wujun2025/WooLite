import { StoreConfig, Product, OrderNotification } from '../types'

class WooCommerceAPI {
  private static instance: WooCommerceAPI
  // private baseUrl: string = '' // 暂时注释掉未使用的变量

  private constructor() {}

  static getInstance(): WooCommerceAPI {
    if (!WooCommerceAPI.instance) {
      WooCommerceAPI.instance = new WooCommerceAPI()
    }
    return WooCommerceAPI.instance
  }

  // 设置基础URL
  setBaseUrl(_url: string): void {
    // 在实际实现中，这里会设置基础URL
    // this.baseUrl = url.replace(/\/$/, '') // 移除末尾的斜杠
  }

  // 设置认证信息
  setAuth(_store: StoreConfig): void {
    // 在实际实现中，这里会设置认证头信息
    // 对于WordPress认证，使用Authorization头
    // 对于WooCommerce认证，使用consumer key和secret
  }

  // 测试店铺连接
  async testConnection(_store: StoreConfig): Promise<boolean> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return true
    } catch (error) {
      return false
    }
  }

  // 获取商品列表
  async getProducts(_store: StoreConfig, _params?: any): Promise<Product[]> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return []
    } catch (error) {
      throw new Error('Failed to fetch products')
    }
  }

  // 创建商品
  async createProduct(_store: StoreConfig, product: Product): Promise<Product> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return { ...product, id: Math.floor(Math.random() * 10000) }
    } catch (error) {
      throw new Error('Failed to create product')
    }
  }

  // 更新商品
  async updateProduct(_store: StoreConfig, product: Product): Promise<Product> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return product
    } catch (error) {
      throw new Error('Failed to update product')
    }
  }

  // 删除商品
  async deleteProduct(_store: StoreConfig, _productId: number): Promise<boolean> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return true
    } catch (error) {
      throw new Error('Failed to delete product')
    }
  }

  // 批量更新商品状态
  async bulkUpdateProducts(_store: StoreConfig, _productIds: number[], _status: 'publish' | 'private' | 'draft'): Promise<boolean> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return true
    } catch (error) {
      throw new Error('Failed to bulk update products')
    }
  }

  // 获取订单通知
  async getOrderNotifications(store: StoreConfig): Promise<OrderNotification> {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        storeId: store.id,
        unreadCount: Math.floor(Math.random() * 10),
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      throw new Error('Failed to fetch order notifications')
    }
  }
}

export default WooCommerceAPI.getInstance()
export interface StoreConfig {
  id: string
  name: string
  url: string
  authType: 'wordpress' | 'woocommerce'
  credentials: {
    username?: string           // WordPress用户名
    password?: string          // WordPress应用密码
    consumerKey?: string       // WooCommerce Consumer Key
    consumerSecret?: string    // WooCommerce Consumer Secret
  }
  isActive: boolean
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface ProductTag {
  id: number
  name: string
  slug: string
}

export interface ProductImage {
  id?: number
  src: string
  name?: string
  alt?: string
}

export interface Product {
  id?: number
  name: string
  description: string
  shortDescription?: string
  price: number
  regularPrice: number
  salePrice?: number
  sku: string
  stockQuantity: number
  manageStock: boolean
  stockStatus: 'instock' | 'outofstock' | 'onbackorder'
  categories: ProductCategory[]
  tags: ProductTag[]
  images: ProductImage[]
  status: 'draft' | 'pending' | 'private' | 'publish'
  type: 'simple' | 'grouped' | 'external' | 'variable'
}

export interface OrderNotification {
  storeId: string
  unreadCount: number
  lastChecked: string
}

export interface TranslationKeys {
  // 店铺管理相关
  'storeManagement.title': string
  'storeManagement.addStore': string
  'storeManagement.editStore': string
  'storeManagement.deleteStore': string
  'storeManagement.testConnection': string
  'storeManagement.setActive': string
  'storeManagement.storeName': string
  'storeManagement.storeUrl': string
  'storeManagement.authType': string
  'storeManagement.wordpressAuth': string
  'storeManagement.woocommerceAuth': string
  'storeManagement.username': string
  'storeManagement.password': string
  'storeManagement.consumerKey': string
  'storeManagement.consumerSecret': string
  'storeManagement.maxStoresReached': string
  
  // 商品管理相关
  'productManagement.title': string
  'productManagement.search': string
  'productManagement.filter': string
  'productManagement.addProduct': string
  'productManagement.editProduct': string
  'productManagement.deleteProduct': string
  'productManagement.bulkActions': string
  'productManagement.bulkPublish': string
  'productManagement.bulkUnpublish': string
  'productManagement.bulkDelete': string
  'productManagement.productName': string
  'productManagement.sku': string
  'productManagement.price': string
  'productManagement.stockStatus': string
  'productManagement.productType': string
  'productManagement.actions': string
  
  // 订单提醒相关
  'orderNotification.title': string
  'orderNotification.enable': string
  'orderNotification.disable': string
  'orderNotification.viewOrders': string
  
  // 通用
  'common.save': string
  'common.cancel': string
  'common.delete': string
  'common.edit': string
  'common.loading': string
  'common.error': string
  'common.success': string
}
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

// 添加变体属性接口
export interface ProductAttribute {
  id?: number
  name: string
  slug: string
  position: number
  visible: boolean
  variation: boolean
  options: string[]
}

// 添加变体接口
export interface ProductVariation {
  id?: number
  sku: string
  price: number
  regularPrice: number
  salePrice?: number
  stockQuantity: number
  manageStock: boolean
  stockStatus: 'instock' | 'outofstock' | 'onbackorder'
  attributes: Record<string, string> // 属性键值对
  image?: ProductImage
}

export interface PaginatedProducts {
  products: Product[]
  totalPages: number
  totalItems: number
  currentPage: number
  itemsPerPage: number
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
  // 添加变体相关字段
  attributes?: ProductAttribute[]
  variations?: ProductVariation[]
}

export interface Order {
  id: number
  number: string
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed'
  currency: string
  total: string
  customerNote: string
  dateCreated: string
  dateModified: string
  billing: {
    firstName: string
    lastName: string
    company: string
    address1: string
    address2: string
    city: string
    state: string
    postcode: string
    country: string
    email: string
    phone: string
  }
  shipping: {
    firstName: string
    lastName: string
    company: string
    address1: string
    address2: string
    city: string
    state: string
    postcode: string
    country: string
  }
  lineItems: Array<{
    id: number
    name: string
    productId: number
    variationId: number
    quantity: number
    price: string
    subtotal: string
    total: string
  }>
}

export interface OrderNotification {
  storeId: string
  unreadCount: number
  lastChecked: string
  orders?: Order[] // 添加订单详情
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
  'storeManagement.noStoreMessage': string
  'storeManagement.invalidUrl': string
  'storeManagement.credentialsRequired': string
  'storeManagement.description': string
  'storeManagement.addStoreFirst': string
  'storeManagement.noStores': string
  'storeManagement.addFirstStore': string
  'storeManagement.noStoreSelected': string
  'storeManagement.connectionFailed': string
  'storeManagement.connectionSuccess': string
  'storeManagement.level': string
  'storeManagement.pleaseFillAllFields': string
  'common.deleteConfirm': string
  // 添加新的翻译键定义
  'storeManagement.levelOneBinding': string
  'storeManagement.levelTwoBinding': string
  'storeManagement.levelOneDescription': string
  'storeManagement.levelTwoDescription': string
  'storeManagement.levelOneTitle': string
  'storeManagement.levelTwoTitle': string
  'storeManagement.levelOneBound': string
  'storeManagement.levelTwoBound': string
  // 添加新的翻译键定义
  'storeManagement.addLevelTwoBinding': string
  
  // 商品管理相关
  'productManagement.title': string
  'productManagement.search': string
  'productManagement.searchPlaceholder': string
  'productManagement.searchBy': string
  'productManagement.searchByName': string
  'productManagement.searchBySku': string
  'productManagement.searchByCategory': string
  'productManagement.searchByTag': string
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
  'productManagement.status': string
  'productManagement.actions': string
  'productManagement.stockStatus.instock': string
  'productManagement.stockStatus.outofstock': string
  'productManagement.stockStatus.onbackorder': string
  'productManagement.type.simple': string
  'productManagement.type.grouped': string
  'productManagement.type.external': string
  'productManagement.type.variable': string
  'productManagement.status.draft': string
  'productManagement.status.pending': string
  'productManagement.status.private': string
  'productManagement.status.publish': string
  'productManagement.basicInfo': string
  'productManagement.pricingAndInventory': string
  'productManagement.categoriesAndTags': string
  'productManagement.description': string
  'productManagement.productDescription': string
  'productManagement.regularPrice': string
  'productManagement.stockQuantity': string
  'productManagement.manageStock': string
  'productManagement.categories': string
  'productManagement.tags': string
  'productManagement.categoryName': string
  'productManagement.tagName': string
  'productManagement.addCategory': string
  'productManagement.addTag': string
  'productManagement.selectCategory': string
  'productManagement.images': string
  'productManagement.imageURL': string
  'productManagement.imageName': string
  'productManagement.imageAlt': string
  'productManagement.addImage': string
  'productManagement.deleteFailed': string
  'productManagement.bulkDeleteFailed': string
  'productManagement.bulkPublishFailed': string
  'productManagement.bulkUnpublishFailed': string
  'productManagement.saveFailed': string
  'productManagement.exportProducts': string
  'productManagement.importProducts': string
  'productManagement.noProducts': string
  'productManagement.addFirstProduct': string
  'productManagement.previewImage': string
  // 添加新的翻译键定义
  'productManagement.loadFailed': string
  
  // 新增的变体管理相关翻译键
  'productManagement.attributes': string
  'productManagement.variations': string
  'productManagement.attributeName': string
  'productManagement.attributeOptions': string
  'productManagement.optionValue': string
  'productManagement.addAttribute': string
  'productManagement.addVariation': string
  'productManagement.imageBindingNotice': string
  'productManagement.imageWooCommerceNotice': string
  'productManagement.imageWordPressNotice': string
  'productManagement.addOption': string
  'productManagement.attributeVisible': string
  'productManagement.usedForVariations': string
  'productManagement.generateVariations': string
  'productManagement.variation': string
  'productManagement.noAttributesForVariations': string
  'productManagement.imageURLDescription': string
  'productManagement.imageNameDescription': string
  
  // 订单提醒相关
  'orderNotification.title': string
  'orderNotification.enable': string
  'orderNotification.disable': string
  'orderNotification.viewOrders': string
  
  // 关于模块相关
  'about.title': string
  'about.description': string
  'about.projectHistory': string
  'about.projectHistoryContent': string
  'about.developerStory': string
  'about.developerStoryContent': string
  'about.features': string
  'about.feature1': string
  'about.feature2': string
  'about.feature3': string
  'about.feature4': string
  'about.support': string
  'about.supportDescription': string
  'about.donationQRCode': string
  'about.scanToSupport': string
  'about.version': string
  'about.technologyStack': string
  'about.freeToUse': string
  
  // 通用
  'common.save': string
  'common.cancel': string
  'common.delete': string
  'common.edit': string
  'common.loading': string
  'common.error': string
  'common.success': string
  'common.previous': string
  'common.next': string
  'common.required': string
  'common.comingSoon': string
  'common.remove': string
  'common.noData': string
  'common.confirm': string
  'common.warning': string
  'common.not': string
  'common.bound': string
  'common.all': string
  'common.min': string
  'common.max': string
  'common.reset': string
  'common.apply': string
  // 添加用户相关翻译键
  'common.user': string
  'common.logout': string
}
import { create } from 'zustand'
import { StoreConfig, Product, OrderNotification } from '../types'

interface AppState {
  // 店铺管理状态
  stores: StoreConfig[]
  activeStoreId: string | null
  
  // 商品管理状态
  products: Product[]
  selectedProductIds: number[]
  
  // 订单提醒状态
  orderNotifications: OrderNotification[]
  isOrderNotificationEnabled: boolean
  
  // UI状态
  isLoading: boolean
  language: 'zh-CN' | 'zh-TW' | 'en-US'
  
  // 状态更新方法
  addStore: (store: StoreConfig) => void
  removeStore: (storeId: string) => void
  setActiveStore: (storeId: string) => void
  setProducts: (products: Product[]) => void
  toggleProductSelection: (productId: number) => void
  setOrderNotificationEnabled: (enabled: boolean) => void
  updateOrderNotification: (notification: OrderNotification) => void
  setLoading: (loading: boolean) => void
  setLanguage: (language: 'zh-CN' | 'zh-TW' | 'en-US') => void
}

export const useAppStore = create<AppState>()((set, get) => ({
  // 初始状态
  stores: [],
  activeStoreId: null,
  products: [],
  selectedProductIds: [],
  orderNotifications: [],
  isOrderNotificationEnabled: false,
  isLoading: false,
  language: 'zh-CN',
  
  // 状态更新方法实现
  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
  removeStore: (storeId) => set((state) => ({ stores: state.stores.filter(s => s.id !== storeId) })),
  setActiveStore: (storeId) => set({ activeStoreId: storeId }),
  setProducts: (products) => set({ products }),
  toggleProductSelection: (productId) => set((state) => {
    const isSelected = state.selectedProductIds.includes(productId)
    return {
      selectedProductIds: isSelected
        ? state.selectedProductIds.filter(id => id !== productId)
        : [...state.selectedProductIds, productId]
    }
  }),
  setOrderNotificationEnabled: (enabled) => set({ isOrderNotificationEnabled: enabled }),
  updateOrderNotification: (notification) => set((state) => ({
    orderNotifications: [...state.orderNotifications.filter(n => n.storeId !== notification.storeId), notification]
  })),
  setLoading: (loading) => set({ isLoading: loading }),
  setLanguage: (language) => set({ language })
}))
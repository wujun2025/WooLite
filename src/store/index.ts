import { create } from 'zustand'
import { StoreConfig, Product, OrderNotification } from '../types'
import { persist, defaultPersistOptions } from './persist'

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

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
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
      addStore: (store: StoreConfig) => set((state: AppState) => ({ stores: [...state.stores, store] })),
      removeStore: (storeId: string) => set((state: AppState) => ({ stores: state.stores.filter(s => s.id !== storeId) })),
      setActiveStore: (storeId: string) => set({ activeStoreId: storeId }),
      setProducts: (products: Product[]) => set({ products }),
      toggleProductSelection: (productId: number) => set((state: AppState) => {
        const isSelected = state.selectedProductIds.includes(productId)
        return {
          selectedProductIds: isSelected
            ? state.selectedProductIds.filter((id: number) => id !== productId)
            : [...state.selectedProductIds, productId]
        }
      }),
      setOrderNotificationEnabled: (enabled: boolean) => set({ isOrderNotificationEnabled: enabled }),
      updateOrderNotification: (notification: OrderNotification) => set((state: AppState) => ({
        orderNotifications: [...state.orderNotifications.filter(n => n.storeId !== notification.storeId), notification]
      })),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setLanguage: (language: 'zh-CN' | 'zh-TW' | 'en-US') => set({ language })
    }),
    {
      ...defaultPersistOptions,
      name: 'woolite-app-state',
      partialize: (state: AppState) => ({
        stores: state.stores,
        activeStoreId: state.activeStoreId,
        language: state.language,
        isOrderNotificationEnabled: state.isOrderNotificationEnabled
      })
    }
  )
)
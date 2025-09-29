// 持久化存储增强器，支持多浏览器
import { StateCreator } from 'zustand';
import { browserAPI } from '../utils/browserApi';

// 持久化配置接口
export interface PersistOptions<T> {
  name: string; // 存储键名
  partialize?: (state: T) => Partial<T>; // 选择需要持久化的状态部分
  merge?: (persistedState: Partial<T>, currentState: T) => T; // 合并持久化状态和当前状态
}

// 持久化存储增强器
export const persist = <T extends Record<string, any>>(
  config: StateCreator<T>,
  options: PersistOptions<T>
): StateCreator<T> => {
  const { name, partialize = (state: T) => state, merge = (persistedState, currentState) => ({ ...currentState, ...persistedState }) } = options;

  return (set, get, api) => {
    // 创建内部状态设置函数
    const setWithPersistence: typeof set = (args) => {
      // 更新状态
      set(args);
      
      // 获取当前状态并持久化
      const state = get();
      const partialState = partialize(state);
      
      // 保存到浏览器存储
      browserAPI.storage.set({ [name]: partialState }).catch((error) => {
        console.error('Failed to persist state:', error);
      });
    };

    // 初始化时从存储中加载状态
    browserAPI.storage.get(name).then((result) => {
      const persistedState = result[name];
      if (persistedState) {
        const currentState = config(setWithPersistence, get, api);
        const mergedState = merge(persistedState, currentState);
        set(mergedState);
      }
    }).catch((error) => {
      console.error('Failed to load persisted state:', error);
      // 如果加载失败，仍然初始化状态
      config(setWithPersistence, get, api);
    });

    // 返回初始状态
    return config(setWithPersistence, get, api);
  };
};

// 默认持久化配置
export const defaultPersistOptions: PersistOptions<any> = {
  name: 'woolite-storage',
  partialize: (state) => state,
  merge: (persistedState, currentState) => ({ ...currentState, ...persistedState })
};
// 跨浏览器API适配层
// 统一Chrome和Edge扩展API的差异

// 声明全局变量类型
declare const browser: any;
declare const safari: any;

interface BrowserAPI {
  storage: {
    get: (key: string | string[] | Record<string, any>) => Promise<any>;
    set: (items: Record<string, any>) => Promise<void>;
    remove: (key: string | string[]) => Promise<void>;
  };
  notifications: {
    create: (id: string, options: any) => Promise<string>;
  };
  alarms: {
    create: (name: string, alarmInfo: any) => void;
    onAlarm: {
      addListener: (callback: (alarm: any) => void) => void;
    };
  };
  runtime: {
    onMessage: {
      addListener: (callback: (request: any, sender: any, sendResponse: any) => void) => void;
    };
    sendMessage: (message: any) => Promise<any>;
  };
}

// 检测当前浏览器环境 (仅支持Chrome和Edge)
const getBrowserType = (): 'chrome' => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    return 'chrome';
  }
  return 'chrome'; // 默认返回chrome
};

// 创建跨浏览器API适配器 (仅支持Chrome和Edge)
const createBrowserAPI = (): BrowserAPI => {
  // 只支持Chrome/Edge
  return {
    storage: {
      get: (key) => new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => resolve(result));
      }),
      set: (items) => new Promise((resolve) => {
        chrome.storage.local.set(items, () => resolve());
      }),
      remove: (key) => new Promise((resolve) => {
        chrome.storage.local.remove(key, () => resolve());
      })
    },
    notifications: {
      create: (id, options) => new Promise((resolve) => {
        chrome.notifications.create(id, options, (notificationId) => resolve(notificationId));
      })
    },
    alarms: {
      create: (name, alarmInfo) => {
        chrome.alarms.create(name, alarmInfo);
      },
      onAlarm: {
        addListener: (callback) => {
          chrome.alarms.onAlarm.addListener(callback);
        }
      }
    },
    runtime: {
      onMessage: {
        addListener: (callback) => {
          chrome.runtime.onMessage.addListener(callback);
        }
      },
      sendMessage: (message) => new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => resolve(response));
      })
    }
  };
};

// 导出浏览器API实例
export const browserAPI = createBrowserAPI();

// 导出浏览器类型，供其他模块使用
export const browserType = getBrowserType();
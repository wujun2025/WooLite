// 跨浏览器API适配层
// 统一Chrome、Firefox、Safari扩展API的差异

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

// 检测当前浏览器环境
const getBrowserType = (): 'chrome' | 'firefox' | 'safari' => {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    return 'chrome';
  } else if (typeof browser !== 'undefined' && browser.runtime) {
    return 'firefox';
  } else if (typeof safari !== 'undefined' && safari.extension) {
    return 'safari';
  }
  return 'chrome'; // 默认返回chrome
};

// 创建跨浏览器API适配器
const createBrowserAPI = (): BrowserAPI => {
  const browserType = getBrowserType();
  
  switch (browserType) {
    case 'firefox':
      return {
        storage: {
          get: (key) => browser.storage.local.get(key),
          set: (items) => browser.storage.local.set(items),
          remove: (key) => browser.storage.local.remove(key)
        },
        notifications: {
          create: (id, options) => browser.notifications.create(id, options)
        },
        alarms: {
          create: (name, alarmInfo) => browser.alarms.create(name, alarmInfo),
          onAlarm: {
            addListener: (callback) => browser.alarms.onAlarm.addListener(callback)
          }
        },
        runtime: {
          onMessage: {
            addListener: (callback) => browser.runtime.onMessage.addListener(callback)
          },
          sendMessage: (message) => browser.runtime.sendMessage(message)
        }
      };
      
    case 'safari':
      // Safari的API实现会有所不同，这里提供基本结构
      return {
        storage: {
          get: async (_key: string | string[] | Record<string, any>) => {
            // Safari的存储API实现
            return {};
          },
          set: async (_items: Record<string, any>) => {
            // Safari的存储API实现
          },
          remove: async (_key: string | string[]) => {
            // Safari的存储API实现
          }
        },
        notifications: {
          create: async (id: string, _options: any) => {
            // Safari的通知API实现
            return id;
          }
        },
        alarms: {
          create: (_name: string, _alarmInfo: any) => {
            // Safari的定时器API实现
          },
          onAlarm: {
            addListener: (_callback: (alarm: any) => void) => {
              // Safari的定时器监听实现
            }
          }
        },
        runtime: {
          onMessage: {
            addListener: (_callback: (request: any, sender: any, sendResponse: any) => void) => {
              // Safari的消息监听实现
            }
          },
          sendMessage: async (_message: any) => {
            // Safari的消息发送实现
            return {};
          }
        }
      };
      
    case 'chrome':
    default:
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
  }
};

// 导出浏览器API实例
export const browserAPI = createBrowserAPI();

// 导出浏览器类型，供其他模块使用
export const browserType = getBrowserType();
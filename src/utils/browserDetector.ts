// 浏览器检测和适配工具

// 浏览器类型枚举
export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'unknown';

// 检测当前浏览器类型
export function detectBrowser(): BrowserType {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('edg/') || userAgent.includes('edge/')) {
    return 'edge';
  }
  
  if (userAgent.includes('chrome') && !userAgent.includes('chromium')) {
    // Chrome和新的Edge都包含'chrome'，但新的Edge也包含'edg'
    // 我们已经在上面检查了Edge
    return 'chrome';
  }
  
  if (userAgent.includes('firefox')) {
    return 'firefox';
  }
  
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    // Chrome的userAgent也包含'safari'，所以我们需要排除Chrome
    return 'safari';
  }
  
  return 'unknown';
}

// 检测是否支持特定API
export function isApiSupported(apiName: string): boolean {
  switch (apiName) {
    case 'notifications':
      return typeof chrome !== 'undefined' && (chrome as any).notifications ||
             typeof window !== 'undefined' && (window as any).browser && (window as any).browser.notifications ||
             typeof Notification !== 'undefined';
    case 'storage':
      return typeof chrome !== 'undefined' && (chrome as any).storage ||
             typeof window !== 'undefined' && (window as any).browser && (window as any).browser.storage ||
             typeof localStorage !== 'undefined';
    case 'alarms':
      return typeof chrome !== 'undefined' && (chrome as any).alarms ||
             typeof window !== 'undefined' && (window as any).browser && (window as any).browser.alarms;
    default:
      return false;
  }
}

// 获取浏览器特定的API前缀
export function getBrowserApiPrefix(): string {
  const browser = detectBrowser();
  
  switch (browser) {
    case 'firefox':
      return 'browser';
    case 'chrome':
    case 'edge':
      return 'chrome';
    case 'safari':
      return 'safari';
    default:
      return 'chrome'; // 默认使用Chrome API
  }
}

// 浏览器兼容性检查
export interface BrowserCompatibility {
  browser: BrowserType;
  supportedApis: string[];
  manifestVersion: number;
}

export function checkBrowserCompatibility(): BrowserCompatibility {
  const browser = detectBrowser();
  const supportedApis: string[] = [];
  
  // 检查支持的API
  if (isApiSupported('notifications')) supportedApis.push('notifications');
  if (isApiSupported('storage')) supportedApis.push('storage');
  if (isApiSupported('alarms')) supportedApis.push('alarms');
  
  // 检查manifest版本
  let manifestVersion = 2;
  if (typeof chrome !== 'undefined' && (chrome as any).runtime && (chrome as any).runtime.getManifest) {
    const manifest = (chrome as any).runtime.getManifest();
    if (manifest && (manifest as any).manifest_version) {
      manifestVersion = (manifest as any).manifest_version;
    }
  }
  
  return {
    browser,
    supportedApis,
    manifestVersion
  };
}

// 导出默认浏览器类型
export const currentBrowser = detectBrowser();
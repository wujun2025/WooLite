// 后台脚本 - 处理订单提醒等后台任务
// 注意：Service Worker环境中不能使用import/export语句，需要通过构建工具处理

import { browserAPI } from '../utils/browserApi'
import WooCommerceAPI from '../services/api'

// 监听扩展图标点击事件
browserAPI.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'openMaximizedWindow') {
    // 打开最大化窗口
    openMaximizedWindow()
    sendResponse({ success: true })
    return true
  }
})

// 打开最大化窗口的函数
function openMaximizedWindow() {
  // 创建一个新窗口
  chrome.windows.create({
    url: chrome.runtime.getURL('src/maximized/index.html'),
    type: 'popup',
    width: 1200,
    height: 800
  })
}

browserAPI.alarms.create('orderNotificationCheck', {
  periodInMinutes: 15 // 每15分钟检查一次订单
})

browserAPI.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'orderNotificationCheck') {
    // 检查订单通知的逻辑
    checkOrderNotifications()
  }
})

// 检查订单通知
async function checkOrderNotifications() {
  try {
    // 这里会实现实际的订单检查逻辑
    // 通过browserAPI.storage获取店铺信息
    // 调用API检查每个店铺的新订单
    // 更新扩展图标上的徽章
    
    // 获取存储的店铺信息
    const result = await browserAPI.storage.get('woolite-app-state')
    if (result && result['woolite-app-state']) {
      const appState = result['woolite-app-state']
      const stores = appState.stores || []
      const isOrderNotificationEnabled = appState.isOrderNotificationEnabled || false
      
      // 只有当订单提醒功能启用时才检查
      if (isOrderNotificationEnabled && stores.length > 0) {
        let totalUnreadCount = 0
        let allNewOrders: any[] = [] // 存储所有新订单
        
        // 检查每个店铺的订单
        for (const store of stores) {
          try {
            const notification = await WooCommerceAPI.getOrderNotifications(store)
            totalUnreadCount += notification.unreadCount
            
            // 收集新订单信息
            if (notification.orders && notification.orders.length > 0) {
              allNewOrders.push(...notification.orders)
              
              // 为每个有新订单的店铺显示通知
              browserAPI.notifications.create(`order-notification-${store.id}`, {
                type: 'basic',
                iconUrl: 'src/assets/icons/icon48.png',
                title: '新订单提醒',
                message: `店铺 ${store.name} 有 ${notification.unreadCount} 个新订单`
              })
            }
          } catch (error) {
            console.error('检查店铺订单时出错:', store.name, error)
          }
        }
        
        // 如果有新订单，显示详细通知
        if (allNewOrders.length > 0) {
          // 显示一个汇总通知
          browserAPI.notifications.create('order-summary-notification', {
            type: 'basic',
            iconUrl: 'src/assets/icons/icon48.png',
            title: '新订单汇总',
            message: `您有 ${allNewOrders.length} 个新订单需要处理`
          })
        }
        
        // 更新扩展图标上的徽章
        if (totalUnreadCount > 0) {
          const badgeText = totalUnreadCount > 99 ? '99+' : totalUnreadCount.toString()
          // 注意：这里需要根据不同的浏览器使用不同的API
          if (typeof chrome !== 'undefined' && chrome.action) {
            chrome.action.setBadgeText({ text: badgeText })
            chrome.action.setBadgeBackgroundColor({ color: '#ff0000' })
          }
        } else {
          // 没有未读订单时清除徽章
          if (typeof chrome !== 'undefined' && chrome.action) {
            chrome.action.setBadgeText({ text: '' })
          }
        }
        
        // 将订单信息存储到本地存储，供popup和其他组件使用
        await browserAPI.storage.set({
          'woolite-order-data': {
            orders: allNewOrders,
            lastChecked: new Date().toISOString(),
            totalCount: totalUnreadCount
          }
        })
      }
    }
  } catch (error) {
    console.error('检查订单通知时出错:', error)
  }
}

// 监听来自内容脚本或popup的消息
browserAPI.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  switch (request.action) {
    case 'enableOrderNotification':
      // 启用订单通知
      checkOrderNotifications() // 立即检查一次
      sendResponse({ success: true })
      break
    case 'disableOrderNotification':
      // 禁用订单通知
      // 清除徽章
      if (typeof chrome !== 'undefined' && chrome.action) {
        chrome.action.setBadgeText({ text: '' })
      }
      // 清除存储的订单数据
      browserAPI.storage.remove('woolite-order-data')
      sendResponse({ success: true })
      break
    case 'checkOrderNotifications':
      // 手动触发订单检查
      checkOrderNotifications()
      sendResponse({ success: true })
      break
    case 'getOrderData':
      // 获取存储的订单数据
      browserAPI.storage.get('woolite-order-data').then((result) => {
        sendResponse({ success: true, data: result['woolite-order-data'] || null })
      })
      return true // 保持消息通道开放以进行异步响应
    case 'openMaximizedWindow':
      // 打开最大化窗口
      openMaximizedWindow()
      sendResponse({ success: true })
      return true
    default:
      sendResponse({ success: false, message: 'Unknown action' })
      break
  }
  
  // 返回true表示异步响应
  return true
})
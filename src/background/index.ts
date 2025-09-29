// 后台脚本 - 处理订单提醒等后台任务
import { browserAPI } from '../utils/browserApi';

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
  } catch (error) {
    console.error('检查订单通知时出错:', error)
  }
}

// 监听来自内容脚本或popup的消息
browserAPI.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  switch (request.action) {
    case 'enableOrderNotification':
      // 启用订单通知
      break
    case 'disableOrderNotification':
      // 禁用订单通知
      break
    default:
      break
  }
})

export {}
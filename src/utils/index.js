/**
 * 工具函数入口
 * 汉字认字量检测小程序
 */

// 导出分层配置
export * from './levelConfig.js'

// 导出计算工具
export * from './calculate.js'

// 导出存储工具
export * from './storage.js'

/**
 * 格式化日期时间
 * @param {string|Date} dateStr - 日期字符串或 Date 对象
 * @param {string} format - 格式化模板，默认 'YYYY-MM-DD HH:mm'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDateTime(dateStr, format = 'YYYY-MM-DD HH:mm') {
  const date = new Date(dateStr)
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise} Promise 对象
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 显示 Toast 提示
 * @param {string} title - 提示内容
 * @param {string} icon - 图标类型 'success' | 'error' | 'loading' | 'none'
 * @param {number} duration - 显示时长（毫秒）
 */
export function showToast(title, icon = 'none', duration = 2000) {
  uni.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示加载提示
 * @param {string} title - 提示内容
 */
export function showLoading(title = '加载中...') {
  uni.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
export function hideLoading() {
  uni.hideLoading()
}

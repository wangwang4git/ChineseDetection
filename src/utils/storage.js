/**
 * 本地存储工具
 * 汉字认字量检测小程序
 */

// 存储键名
const STORAGE_KEYS = {
  TEST_RECORDS: 'TEST_RECORDS',
  USER_INFO: 'USER_INFO'
}

/**
 * 获取检测记录列表
 * @returns {Array} 检测记录列表
 */
export function getRecords() {
  try {
    const records = uni.getStorageSync(STORAGE_KEYS.TEST_RECORDS)
    return records ? JSON.parse(records) : []
  } catch (e) {
    console.error('获取检测记录失败:', e)
    return []
  }
}

/**
 * 保存检测记录
 * @param {Object} record - 检测记录
 * @returns {boolean} 是否保存成功
 */
export function saveRecord(record) {
  try {
    const records = getRecords()
    records.unshift(record) // 新记录放在最前面
    uni.setStorageSync(STORAGE_KEYS.TEST_RECORDS, JSON.stringify(records))
    return true
  } catch (e) {
    console.error('保存检测记录失败:', e)
    return false
  }
}

/**
 * 获取单条检测记录
 * @param {string} id - 记录 ID
 * @returns {Object|null} 检测记录
 */
export function getRecordById(id) {
  try {
    const records = getRecords()
    return records.find(r => r.id === id) || null
  } catch (e) {
    console.error('获取检测记录失败:', e)
    return null
  }
}

/**
 * 获取统计数据
 * @returns {{testCount: number, maxScore: number, avgScore: number}} 统计数据
 */
export function getStatistics() {
  try {
    const records = getRecords()
    
    if (records.length === 0) {
      return { testCount: 0, maxScore: 0, avgScore: 0 }
    }

    const scores = records.map(r => r.estimatedVocabulary)
    const testCount = records.length
    const maxScore = Math.max(...scores)
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / testCount)

    return { testCount, maxScore, avgScore }
  } catch (e) {
    console.error('获取统计数据失败:', e)
    return { testCount: 0, maxScore: 0, avgScore: 0 }
  }
}

/**
 * 获取用户信息（Mock）
 * @returns {Object} 用户信息
 */
export function getUserInfo() {
  try {
    const userInfo = uni.getStorageSync(STORAGE_KEYS.USER_INFO)
    if (userInfo) {
      return JSON.parse(userInfo)
    }
    // 返回默认 Mock 用户
    return {
      id: 'user_001',
      nickname: '小朋友',
      avatar: '👦',
      account: 'user_001'
    }
  } catch (e) {
    console.error('获取用户信息失败:', e)
    return {
      id: 'user_001',
      nickname: '小朋友',
      avatar: '👦',
      account: 'user_001'
    }
  }
}

/**
 * 清除所有数据（用于测试）
 */
export function clearAllData() {
  try {
    uni.removeStorageSync(STORAGE_KEYS.TEST_RECORDS)
    uni.removeStorageSync(STORAGE_KEYS.USER_INFO)
    return true
  } catch (e) {
    console.error('清除数据失败:', e)
    return false
  }
}

/**
 * 本地存储工具
 * 汉字认字量检测小程序
 */

// 存储键名
const STORAGE_KEYS = {
  TEST_RECORDS: 'TEST_RECORDS',
  USER_INFO: 'USER_INFO',
  USER_OPENID: 'USER_OPENID',  // 单独存储 OpenID
  PROFILE_GUIDE_SHOWN: 'PROFILE_GUIDE_SHOWN'  // 个人页引导提示状态
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
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
export function getUserInfo() {
  try {
    const userInfo = uni.getStorageSync(STORAGE_KEYS.USER_INFO)
    if (userInfo) {
      const parsed = JSON.parse(userInfo)
      // 验证数据完整性
      if (parsed && typeof parsed === 'object') {
        return parsed
      }
    }
    return null
  } catch (e) {
    console.error('获取用户信息失败:', e)
    return null
  }
}

/**
 * 保存用户信息
 * @param {Object} userInfo - 用户信息
 * @returns {boolean} 是否保存成功
 */
export function setUserInfo(userInfo) {
  try {
    if (!userInfo || typeof userInfo !== 'object') {
      console.error('用户信息格式无效')
      return false
    }

    uni.setStorageSync(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
    
    // 同时单独存储 OpenID（便于快速访问）
    if (userInfo.openid) {
      uni.setStorageSync(STORAGE_KEYS.USER_OPENID, userInfo.openid)
    }
    
    return true
  } catch (e) {
    console.error('保存用户信息失败:', e)
    return false
  }
}

/**
 * 获取用户 OpenID
 * @returns {string|null} OpenID
 */
export function getUserOpenId() {
  try {
    const openid = uni.getStorageSync(STORAGE_KEYS.USER_OPENID)
    return openid || null
  } catch (e) {
    console.error('获取用户 OpenID 失败:', e)
    return null
  }
}

/**
 * 清除用户信息
 * @returns {boolean} 是否清除成功
 */
export function clearUserInfo() {
  try {
    uni.removeStorageSync(STORAGE_KEYS.USER_INFO)
    uni.removeStorageSync(STORAGE_KEYS.USER_OPENID)
    return true
  } catch (e) {
    console.error('清除用户信息失败:', e)
    return false
  }
}

/**
 * 清除所有数据（用于测试）
 */
export function clearAllData() {
  try {
    uni.removeStorageSync(STORAGE_KEYS.TEST_RECORDS)
    uni.removeStorageSync(STORAGE_KEYS.USER_INFO)
    uni.removeStorageSync(STORAGE_KEYS.USER_OPENID)
    uni.removeStorageSync(STORAGE_KEYS.PROFILE_GUIDE_SHOWN)
    return true
  } catch (e) {
    console.error('清除数据失败:', e)
    return false
  }
}

/**
 * 获取个人页引导提示显示状态
 * @returns {boolean} 是否已显示过引导提示
 */
export function getProfileGuideShown() {
  try {
    const shown = uni.getStorageSync(STORAGE_KEYS.PROFILE_GUIDE_SHOWN)
    return Boolean(shown)
  } catch (e) {
    console.error('获取引导提示状态失败:', e)
    return false
  }
}

/**
 * 设置个人页引导提示显示状态
 * @param {boolean} shown - 是否已显示
 * @returns {boolean} 是否设置成功
 */
export function setProfileGuideShown(shown = true) {
  try {
    uni.setStorageSync(STORAGE_KEYS.PROFILE_GUIDE_SHOWN, shown)
    return true
  } catch (e) {
    console.error('设置引导提示状态失败:', e)
    return false
  }
}

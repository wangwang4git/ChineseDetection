/**
 * 用户信息管理器
 * 汉字认字量检测小程序
 * 
 * 优化策略：
 * 1. 先返回本地缓存数据，快速显示 UI
 * 2. 后台异步获取/更新 OpenID，不阻塞页面渲染
 */

import { getUserInfo, setUserInfo, clearUserInfo, getUserOpenId } from './storage.js'

/**
 * 用户信息数据结构
 * @typedef {Object} UserInfo
 * @property {string} openid - 微信 OpenID（必需）
 * @property {string} nickname - 用户昵称
 * @property {string} avatar - 头像 URL 或 emoji
 * @property {number} age - 用户年龄（1-15岁，0表示未设置）
 * @property {boolean} hasAuthorized - 是否已授权
 * @property {number} lastUpdated - 最后更新时间戳
 * @property {'wechat'|'default'} source - 数据来源
 */

/**
 * 用户信息管理器类
 */
class UserManager {
  constructor() {
    this.userInfo = null
    this.isInitialized = false
    this.isRefreshingOpenId = false // 是否正在后台刷新 OpenID
  }

  /**
   * 初始化用户信息（优化版）
   * 策略：先返回本地缓存，后台异步获取 OpenID
   * @returns {Promise<UserInfo>} 用户信息
   */
  async initUserInfo() {
    try {
      // 1. 先从本地存储快速加载（同步操作，几乎无延迟）
      let userInfo = this.loadUserInfo()
      
      // 2. 如果本地有完整数据，立即返回并后台刷新
      if (userInfo && userInfo.openid) {
        this.userInfo = userInfo
        this.isInitialized = true
        
        // 后台异步刷新 OpenID（不阻塞返回）
        this.refreshOpenIdInBackground()
        
        return userInfo
      }
      
      // 3. 本地没有数据，需要获取 OpenID
      const openid = await this.getOpenId()
      if (openid) {
        userInfo = {
          openid,
          nickname: userInfo?.nickname || '点击设置小朋友昵称',
          avatar: userInfo?.avatar || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
          age: userInfo?.age || 0,
          hasAuthorized: false,
          lastUpdated: Date.now(),
          source: 'wechat'
        }
        this.saveUserInfo(userInfo)
      } else {
        // 使用默认信息
        userInfo = this.getDefaultUserInfo()
      }

      this.userInfo = userInfo
      this.isInitialized = true
      return userInfo
    } catch (error) {
      console.error('初始化用户信息失败:', error)
      const defaultInfo = this.getDefaultUserInfo()
      this.userInfo = defaultInfo
      this.isInitialized = true
      return defaultInfo
    }
  }

  /**
   * 后台异步刷新 OpenID（不阻塞 UI）
   * 适用于本地已有缓存但需要验证/更新 OpenID 的场景
   */
  async refreshOpenIdInBackground() {
    // 防止重复刷新
    if (this.isRefreshingOpenId) {
      return
    }
    
    this.isRefreshingOpenId = true
    
    try {
      // #ifdef MP-WEIXIN
      const newOpenId = await this.getOpenIdFromCloud()
      
      if (newOpenId && this.userInfo) {
        // 如果 OpenID 有变化，更新本地数据
        if (newOpenId !== this.userInfo.openid) {
          console.log('🔄 后台更新 OpenID')
          this.userInfo.openid = newOpenId
          this.userInfo.lastUpdated = Date.now()
          this.saveUserInfo(this.userInfo)
        }
      }
      // #endif
    } catch (error) {
      // 后台刷新失败不影响用户使用，静默处理
      console.warn('后台刷新 OpenID 失败:', error.message)
    } finally {
      this.isRefreshingOpenId = false
    }
  }

  /**
   * 从云函数获取 OpenID（纯网络请求）
   * @returns {Promise<string|null>} OpenID
   */
  async getOpenIdFromCloud() {
    // #ifdef MP-WEIXIN
    try {
      const res = await wx.cloud.callFunction({
        name: 'baseFunctions',
        data: { type: 'getOpenId' }
      })
      
      if (res.result && res.result.success && res.result.data) {
        return res.result.data.openid
      }
      return null
    } catch (error) {
      console.warn('云函数获取 OpenID 失败:', error.message)
      return null
    }
    // #endif
    
    // #ifndef MP-WEIXIN
    return null
    // #endif
  }

  /**
   * 获取 OpenID（优化版：优先使用本地缓存）
   * @returns {Promise<string|null>} OpenID
   */
  async getOpenId() {
    // 1. 优先检查本地缓存的 OpenID（同步，无延迟）
    const cachedOpenId = getUserOpenId()
    if (cachedOpenId && this.validateOpenId(cachedOpenId)) {
      console.log('✅ 使用缓存的 OpenID')
      return cachedOpenId
    }
    
    // 2. 本地没有缓存，从云函数获取
    // #ifdef MP-WEIXIN
    try {
      console.log('☁️ 从云函数获取 OpenID...')
      const res = await wx.cloud.callFunction({
        name: 'baseFunctions',
        data: { type: 'getOpenId' }
      })
      
      if (res.result && res.result.success && res.result.data) {
        return res.result.data.openid
      } else {
        console.warn('OpenID 获取失败:', res.result?.errMsg)
        return this.generateFallbackId()
      }
    } catch (error) {
      console.error('调用云函数获取 OpenID 失败:', error)
      return this.generateFallbackId()
    }
    // #endif
    
    // #ifdef H5
    // H5 环境使用本地生成的唯一 ID
    return this.generateFallbackId()
    // #endif
  }

  /**
   * 验证 OpenID 有效性
   * @param {string} openid - OpenID
   * @returns {boolean} 是否有效
   */
  validateOpenId(openid) {
    return typeof openid === 'string' && 
           openid.length > 0 && 
           openid.length <= 50
  }

  /**
   * 生成备用 ID
   * @returns {string} 备用 ID
   */
  generateFallbackId() {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `local_${timestamp}_${random}`
  }

  /**
   * 更新头像
   * @param {string} avatar - 头像 URL 或 emoji
   * @returns {Promise<boolean>} 是否更新成功
   */
  async updateAvatar(avatar) {
    try {
      if (!this.userInfo) {
        await this.initUserInfo()
      }

      this.userInfo.avatar = avatar
      this.userInfo.lastUpdated = Date.now()
      this.userInfo.hasAuthorized = true
      
      return this.saveUserInfo(this.userInfo)
    } catch (error) {
      console.error('更新头像失败:', error)
      return false
    }
  }

  /**
   * 更新昵称
   * @param {string} nickname - 昵称
   * @returns {Promise<boolean>} 是否更新成功
   */
  async updateNickname(nickname) {
    try {
      if (!this.userInfo) {
        await this.initUserInfo()
      }

      // 昵称验证
      if (!nickname || nickname.trim().length === 0) {
        console.warn('昵称不能为空')
        return false
      }

      if (nickname.length > 20) {
        console.warn('昵称长度不能超过20个字符')
        return false
      }

      this.userInfo.nickname = nickname.trim()
      this.userInfo.lastUpdated = Date.now()
      this.userInfo.hasAuthorized = true
      
      return this.saveUserInfo(this.userInfo)
    } catch (error) {
      console.error('更新昵称失败:', error)
      return false
    }
  }

  /**
   * 更新年龄
   * @param {number} age - 年龄（1-15岁）
   * @returns {Promise<boolean>} 是否更新成功
   */
  async updateAge(age) {
    try {
      if (!this.userInfo) {
        await this.initUserInfo()
      }

      // 年龄验证
      if (typeof age !== 'number' || age < 1 || age > 15) {
        console.warn('年龄必须在1-15岁范围内')
        return false
      }

      this.userInfo.age = age
      this.userInfo.lastUpdated = Date.now()
      
      return this.saveUserInfo(this.userInfo)
    } catch (error) {
      console.error('更新年龄失败:', error)
      return false
    }
  }

  /**
   * 获取掩码 OpenID
   * @param {string} openid - OpenID
   * @returns {string} 掩码后的 OpenID（最长16个字符）
   */
  getMaskedOpenId(openid) {
    if (!openid || openid.length < 8) {
      return '****'
    }
    
    // 限制最长显示16个字符
    let displayOpenId = openid
    if (openid.length > 16) {
      displayOpenId = openid.substring(0, 16)
    }
    
    // 显示前4位和后4位，中间用星号替代
    const start = displayOpenId.substring(0, 4)
    const end = displayOpenId.substring(displayOpenId.length - 4)
    const middle = '*'.repeat(Math.max(4, displayOpenId.length - 8))
    
    return `${start}${middle}${end}`
  }

  /**
   * 保存用户信息
   * @param {UserInfo} userInfo - 用户信息
   * @returns {boolean} 是否保存成功
   */
  saveUserInfo(userInfo) {
    try {
      if (!this.validateUserInfo(userInfo)) {
        console.error('用户信息格式无效')
        return false
      }

      const success = setUserInfo(userInfo)
      if (success) {
        this.userInfo = userInfo
      }
      return success
    } catch (error) {
      console.error('保存用户信息失败:', error)
      return false
    }
  }

  /**
   * 加载用户信息
   * @returns {UserInfo|null} 用户信息
   */
  loadUserInfo() {
    try {
      const userInfo = getUserInfo()
      
      // 如果是旧版本的 Mock 数据，进行迁移
      if (userInfo && userInfo.id === 'user_001') {
        return this.migrateUserData(userInfo)
      }

      return this.validateUserInfo(userInfo) ? userInfo : null
    } catch (error) {
      console.error('加载用户信息失败:', error)
      return null
    }
  }

  /**
   * 获取当前用户信息
   * @returns {Promise<UserInfo>} 用户信息
   */
  async getCurrentUserInfo() {
    if (!this.isInitialized || !this.userInfo) {
      return await this.initUserInfo()
    }
    return this.userInfo
  }

  /**
   * 验证用户信息格式
   * @param {UserInfo} userInfo - 用户信息
   * @returns {boolean} 是否有效
   */
  validateUserInfo(userInfo) {
    // 基础验证
    const isValid = userInfo && 
           typeof userInfo.openid === 'string' &&
           userInfo.openid.length > 0 &&
           typeof userInfo.nickname === 'string' &&
           typeof userInfo.avatar === 'string' &&
           typeof userInfo.hasAuthorized === 'boolean' &&
           typeof userInfo.lastUpdated === 'number' &&
           ['wechat', 'default'].includes(userInfo.source)
    
    if (!isValid) return false
    
    // 兼容旧数据：如果没有 age 字段，自动补充
    if (userInfo.age === undefined) {
      userInfo.age = 0
    }
    
    return true
  }

  /**
   * 数据迁移（兼容旧版本）
   * @param {Object} oldData - 旧版本数据
   * @returns {UserInfo} 迁移后的用户信息
   */
  migrateUserData(oldData) {
    return {
      openid: this.generateFallbackId(),
      nickname: oldData.nickname || '点击设置小朋友昵称',
      avatar: oldData.avatar || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      age: oldData.age || 0,
      hasAuthorized: false,
      lastUpdated: Date.now(),
      source: 'default'
    }
  }

  /**
   * 获取默认用户信息
   * @returns {UserInfo} 默认用户信息
   */
  getDefaultUserInfo() {
    return {
      openid: this.generateFallbackId(),
      nickname: '点击设置小朋友昵称',
      avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      age: 0,
      hasAuthorized: false,
      lastUpdated: Date.now(),
      source: 'default'
    }
  }

  /**
   * 清除用户信息
   * @returns {boolean} 是否清除成功
   */
  clearUserInfo() {
    try {
      const success = clearUserInfo()
      if (success) {
        this.userInfo = null
        this.isInitialized = false
      }
      return success
    } catch (error) {
      console.error('清除用户信息失败:', error)
      return false
    }
  }
}

// 创建单例实例
const userManager = new UserManager()

export default userManager

// 导出常用方法
export const {
  initUserInfo,
  updateAvatar,
  updateNickname,
  updateAge,
  getMaskedOpenId,
  getCurrentUserInfo,
  clearUserInfo: clearUser
} = userManager
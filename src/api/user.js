/**
 * 用户相关 API 接口
 * 汉字认字量检测小程序
 */

/**
 * 获取用户 OpenID
 * @returns {Promise<{success: boolean, data?: any, errMsg?: string}>} API 响应
 */
export async function getOpenId() {
  try {
    // #ifdef MP-WEIXIN
    const res = await wx.cloud.callFunction({
      name: 'baseFunctions',
      data: { type: 'getOpenId' }
    })
    
    if (res.result) {
      return res.result
    } else {
      return {
        success: false,
        errMsg: '云函数调用失败',
        data: null
      }
    }
    // #endif
    
    // #ifdef H5
    // H5 环境模拟响应
    return {
      success: true,
      data: {
        openid: `h5_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        appid: 'h5_app',
        unionid: null
      }
    }
    // #endif
  } catch (error) {
    console.error('获取 OpenID 失败:', error)
    return {
      success: false,
      errMsg: error.message || '获取 OpenID 失败',
      data: null
    }
  }
}

/**
 * 验证 OpenID 有效性
 * @param {string} openid - OpenID
 * @returns {boolean} 是否有效
 */
export function validateOpenId(openid) {
  if (!openid || typeof openid !== 'string') {
    return false
  }
  
  // OpenID 基本格式验证
  return openid.length > 0 && openid.length <= 50
}

/**
 * 处理微信头像选择
 * @param {Event} event - 头像选择事件
 * @returns {Promise<{success: boolean, data?: string, errMsg?: string}>} 处理结果
 */
export async function handleChooseAvatar(event) {
  try {
    // #ifdef MP-WEIXIN
    const { avatarUrl } = event.detail
    if (avatarUrl) {
      return {
        success: true,
        data: avatarUrl
      }
    } else {
      return {
        success: false,
        errMsg: '未获取到头像地址'
      }
    }
    // #endif
    
    // #ifdef H5
    // H5 环境提供默认头像选项
    const defaultAvatars = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🐰', '🐻']
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]
    
    return {
      success: true,
      data: randomAvatar
    }
    // #endif
  } catch (error) {
    console.error('处理头像选择失败:', error)
    return {
      success: false,
      errMsg: error.message || '头像选择失败'
    }
  }
}

/**
 * 处理昵称输入
 * @param {string} nickname - 昵称
 * @returns {Promise<{success: boolean, data?: string, errMsg?: string}>} 处理结果
 */
export async function handleNicknameInput(nickname) {
  try {
    // 昵称验证
    if (!nickname || typeof nickname !== 'string') {
      return {
        success: false,
        errMsg: '昵称不能为空'
      }
    }
    
    const trimmedNickname = nickname.trim()
    
    if (trimmedNickname.length === 0) {
      return {
        success: false,
        errMsg: '昵称不能为空'
      }
    }
    
    if (trimmedNickname.length > 20) {
      return {
        success: false,
        errMsg: '昵称长度不能超过20个字符'
      }
    }
    
    // 简单的敏感词过滤（可根据需要扩展）
    const forbiddenWords = ['admin', 'test', '测试']
    const lowerNickname = trimmedNickname.toLowerCase()
    
    for (const word of forbiddenWords) {
      if (lowerNickname.includes(word)) {
        return {
          success: false,
          errMsg: '昵称包含不允许的内容'
        }
      }
    }
    
    return {
      success: true,
      data: trimmedNickname
    }
  } catch (error) {
    console.error('处理昵称输入失败:', error)
    return {
      success: false,
      errMsg: error.message || '昵称处理失败'
    }
  }
}

/**
 * 生成掩码 OpenID
 * @param {string} openid - 原始 OpenID
 * @returns {string} 掩码后的 OpenID（最长16个字符）
 */
export function getMaskedOpenId(openid) {
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
 * 检查用户授权状态
 * @returns {Promise<{success: boolean, data?: any, errMsg?: string}>} 授权状态
 */
export async function checkAuthStatus() {
  try {
    // #ifdef MP-WEIXIN
    const setting = await wx.getSetting()
    
    return {
      success: true,
      data: {
        hasUserInfo: setting.authSetting['scope.userInfo'] === true,
        hasUserProfile: setting.authSetting['scope.userProfile'] !== false
      }
    }
    // #endif
    
    // #ifdef H5
    // H5 环境默认已授权
    return {
      success: true,
      data: {
        hasUserInfo: true,
        hasUserProfile: true
      }
    }
    // #endif
  } catch (error) {
    console.error('检查授权状态失败:', error)
    return {
      success: false,
      errMsg: error.message || '检查授权状态失败'
    }
  }
}
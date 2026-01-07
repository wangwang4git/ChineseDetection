/**
 * 环境变量配置
 * 汉字认字量检测小程序
 */

// 环境变量缓存
let envCache = null

/**
 * 从 .env 文件读取环境变量（仅在需要时加载）
 * @returns {Object} 环境变量对象
 */
function loadEnvFromFile() {
  if (envCache !== null) {
    return envCache
  }
  
  envCache = {}
  
  try {
    // #ifdef H5
    // H5 环境下使用 Vite 的环境变量
    envCache = import.meta.env || {}
    // #endif
    
    // #ifdef MP-WEIXIN || APP-PLUS
    // 小程序和 App 环境下使用编译时注入的全局变量
    if (typeof __ENV__ !== 'undefined') {
      envCache = __ENV__
    } else if (typeof process !== 'undefined' && process.env) {
      envCache = process.env
    } else {
      // 兜底配置
      envCache = {
        VITE_WX_CLOUD_ENV: 'cloud-XXXX',
        NODE_ENV: 'development'
      }
    }
    // #endif
    
    console.log('📦 Loaded environment variables:', Object.keys(envCache))
  } catch (error) {
    console.warn('⚠️ 读取环境变量失败:', error)
    envCache = {
      VITE_WX_CLOUD_ENV: 'cloud-XXXX',
      NODE_ENV: 'development'
    }
  }
  
  return envCache
}

/**
 * 获取环境变量
 * @param {string} key - 环境变量 key
 * @param {string} defaultValue - 默认值
 * @returns {string} 环境变量值
 */
function getEnvVar(key, defaultValue = '') {
  const envVars = loadEnvFromFile()
  
  // 优先级：环境变量 > 默认值
  const value = envVars[key] || defaultValue
  
  // 开发环境下打印获取的环境变量（便于调试）
  if (envVars.NODE_ENV === 'development') {
    console.log(`🔧 ENV[${key}]:`, value)
  }
  
  return value
}

/**
 * 环境配置
 */
export const ENV_CONFIG = {
  // 微信云开发环境 ID
  WX_CLOUD_ENV: getEnvVar('VITE_WX_CLOUD_ENV', 'cloud-XXXX'),
  
  // API 基础 URL
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', ''),
  
  // 应用版本
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  
  // 是否为开发环境
  IS_DEV: getEnvVar('NODE_ENV', 'development') === 'development'
}

/**
 * 获取微信云开发环境 ID
 * @returns {string} 云开发环境 ID
 */
export function getCloudEnv() {
  return ENV_CONFIG.WX_CLOUD_ENV
}

/**
 * 打印环境信息（仅开发环境）
 */
export function logEnvInfo() {
  if (ENV_CONFIG.IS_DEV) {
    console.log('🌍 Environment Config:', ENV_CONFIG)
  }
}
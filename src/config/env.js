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
        console.log('🔍 开始加载环境变量...')

        // #ifdef H5
        // H5 环境下使用 Vite 的环境变量
        console.log('🌐 H5 环境：使用 import.meta.env')
        envCache = import.meta.env || {}
        console.log('📦 H5 环境变量:', envCache)
        // #endif

        // #ifdef MP-WEIXIN || APP-PLUS
        // 小程序和 App 环境下使用编译时注入的全局变量
        console.log('📱 小程序环境：检查全局变量注入')
        console.log('🔧 __ENV__ 是否存在:', typeof __ENV__ !== 'undefined')

        if (typeof __ENV__ !== 'undefined') {
            envCache = __ENV__
            console.log('✅ 使用编译时注入的 __ENV__:', envCache)
        } else if (typeof process !== 'undefined' && process.env) {
            envCache = process.env
            console.log('⚡ 使用 process.env:', Object.keys(envCache))
        } else {
            // 兜底配置
            console.warn('⚠️ 未找到环境变量，使用兜底配置')
            envCache = {
                VITE_WX_CLOUD_ENV: 'cloud-XXXX',
                NODE_ENV: 'development'
            }
        }
        // #endif

        console.log('📦 最终加载的环境变量键:', Object.keys(envCache))
    } catch (error) {
        console.error('❌ 读取环境变量失败:', error)
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
        console.log(`🔧 ENV[${key}]:`, value === defaultValue ? `${value} (默认值)` : value)
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
    IS_DEV: getEnvVar('NODE_ENV', 'development') === 'development',

    // Tavily Search API Key（用于 AI 联网搜索）
    TAVILY_API_KEY: getEnvVar('VITE_TAVILY_API_KEY', '')
}

/**
 * 获取微信云开发环境 ID
 * @returns {string} 云开发环境 ID
 */
export function getCloudEnv() {
    const cloudEnv = ENV_CONFIG.WX_CLOUD_ENV
    return cloudEnv
}

/**
 * 打印环境信息（仅开发环境）
 */
export function logEnvInfo() {
    if (ENV_CONFIG.IS_DEV) {
        console.log('📋 环境变量详情:')
        console.log('  - 云开发环境:', ENV_CONFIG.WX_CLOUD_ENV)
        console.log('  - API地址:', ENV_CONFIG.API_BASE_URL || '未配置')
        console.log('  - 应用版本:', ENV_CONFIG.APP_VERSION)
        console.log('  - 开发模式:', ENV_CONFIG.IS_DEV ? '是' : '否')
    }
}
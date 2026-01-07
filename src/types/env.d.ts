/**
 * 环境变量类型声明
 */

// 全局环境变量对象类型
interface EnvConfig {
  VITE_WX_CLOUD_ENV: string
  VITE_API_BASE_URL: string
  VITE_APP_VERSION: string
  NODE_ENV: string
}

// 声明全局变量（编译时注入）
declare const __ENV__: EnvConfig

// 扩展 ImportMeta 接口（Vite 环境变量）
interface ImportMetaEnv {
  readonly VITE_WX_CLOUD_ENV: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_VERSION: string
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
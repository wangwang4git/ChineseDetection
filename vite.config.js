import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import fs from 'fs-extra' // fs-extra 为第三方依赖，需要安装
import path from 'path'

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  // 调试：打印环境变量加载情况
  console.log('🔧 Vite 构建模式:', mode)
  console.log('🔧 当前平台:', process.env.UNI_PLATFORM)
  console.log('🔧 加载的环境变量:', {
    VITE_WX_CLOUD_ENV: env.VITE_WX_CLOUD_ENV ? '***已配置***' : '未配置',
    VITE_API_BASE_URL: env.VITE_API_BASE_URL ? '***已配置***' : '未配置',
    VITE_APP_VERSION: env.VITE_APP_VERSION ? '***已配置***' : '未配置',
    VITE_TAVILY_API_KEY: env.VITE_TAVILY_API_KEY ? '***已配置***' : '未配置'
  })

  const plugins = [uni()]

  // 仅微信小程序生效
  if (process.env.UNI_PLATFORM === 'mp-weixin') {
    plugins.push({
      name: 'copy-cloudfunctions',
      buildStart() {
        fs.copySync(
          path.join(process.env.UNI_INPUT_DIR, 'cloudfunctions'),
          path.join(process.env.UNI_OUTPUT_DIR, 'cloudfunctions')
        )
      },
    })
  }

  // 构建注入的环境变量对象，确保不会有undefined值
  const envToInject = {
    VITE_WX_CLOUD_ENV: env.VITE_WX_CLOUD_ENV || 'cloud-XXXX',
    VITE_API_BASE_URL: env.VITE_API_BASE_URL || '',
    VITE_APP_VERSION: env.VITE_APP_VERSION || '1.0.0',
    VITE_TAVILY_API_KEY: env.VITE_TAVILY_API_KEY || '',
    NODE_ENV: mode
  }

  console.log('🚀 注入到代码中的环境变量:', envToInject)

  return {
    plugins,
    // 定义全局常量，将环境变量注入到代码中
    define: {
      // 将 VITE_ 开头的环境变量注入到全局
      __ENV__: JSON.stringify(envToInject)
    },
    // 环境变量配置
    envPrefix: 'VITE_', // 只有以 VITE_ 开头的变量会被暴露
  }
})

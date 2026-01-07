import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import fs from 'fs-extra' // fs-extra 为第三方依赖，需要安装
import path from 'path'

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
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

  return {
    plugins,
    // 定义全局常量，将环境变量注入到代码中
    define: {
      // 将 VITE_ 开头的环境变量注入到全局
      __ENV__: JSON.stringify({
        VITE_WX_CLOUD_ENV: env.VITE_WX_CLOUD_ENV,
        VITE_API_BASE_URL: env.VITE_API_BASE_URL,
        VITE_APP_VERSION: env.VITE_APP_VERSION,
        NODE_ENV: mode
      })
    },
    // 环境变量配置
    envPrefix: 'VITE_', // 只有以 VITE_ 开头的变量会被暴露
  }
})

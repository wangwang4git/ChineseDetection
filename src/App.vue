<script>
import { getCloudEnv, logEnvInfo } from '@/config/env.js'

export default {
  // 确保globalData在App实例创建时就存在
  globalData: {
    env: '', // 初始化为空字符串
    userInfo: null,
    isReady: false // 添加就绪状态标识
  },

  onLaunch: function () {
    console.log('🚀 App Launch - 汉字认字量检测小程序')

    // 打印环境信息（仅开发环境）
    logEnvInfo()

    // 从环境变量获取云开发环境 ID
    const cloudEnv = getCloudEnv()

    // 验证环境ID是否有效
    if (!cloudEnv || cloudEnv === 'cloud-XXXX') {
      console.error('❌ 云开发环境ID无效:', cloudEnv)
      console.error('请检查以下配置:')
      console.error('1. .env 文件是否存在且包含 VITE_WX_CLOUD_ENV')
      console.error('2. vite.config.js 中的 __ENV__ 注入是否正确')
      console.error('3. 编译环境是否正确')
    }

    // 更新 globalData（确保使用正确的方式）
    this.globalData.env = cloudEnv
    this.globalData.isReady = true

    // #ifdef MP-WEIXIN
    if (!wx.cloud) {
      console.error("❌ 请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      console.log('☁️ 准备初始化微信云开发...')

      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });

      console.log("✅ 微信云开发能力初始化成功， env：" + this.globalData.env);
    }
    // #endif
  },
  onShow: function () {
    console.log('👁️ App Show')
  },
  onHide: function () {
    console.log('👋 App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
</style>

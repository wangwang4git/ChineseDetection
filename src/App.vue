<script>
import { getCloudEnv, logEnvInfo } from '@/config/env.js'
import userManager from '@/utils/userManager.js'

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

    // 保存 this 引用
    const app = this

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
      
      // 云开发初始化完成后，异步获取用户信息
      // 使用 setTimeout 确保异步执行，避免 this 绑定问题
      setTimeout(() => {
        app.initUserInfo()
      }, 100)
    }
    // #endif
    
    // #ifdef H5
    // H5 环境直接初始化用户信息
    setTimeout(() => {
      app.initUserInfo()
    }, 100)
    // #endif
  },

  onShow: function () {
    console.log('👁️ App Show')
    
    // 保存 this 引用并异步调用
    const app = this
    setTimeout(() => {
      app.checkUserInfoUpdate()
    }, 0)
  },

  onHide: function () {
    console.log('👋 App Hide')
  },

  methods: {
    /**
     * 初始化用户信息
     * 异步获取 OpenID 和用户信息，不阻塞应用启动
     */
    async initUserInfo() {
      try {
        console.log('👤 开始初始化用户信息...')
        
        // 异步获取用户信息
        const userInfo = await userManager.initUserInfo()
        
        if (userInfo) {
          // 更新全局用户信息
          this.globalData.userInfo = userInfo
          console.log('✅ 用户信息初始化成功:', {
            openid: userManager.getMaskedOpenId(userInfo.openid),
            nickname: userInfo.nickname,
            hasAuthorized: userInfo.hasAuthorized,
            source: userInfo.source
          })
        } else {
          console.warn('⚠️ 用户信息初始化失败，使用默认信息')
        }
      } catch (error) {
        console.error('❌ 用户信息初始化异常:', error)
        // 不影响应用正常启动，继续使用默认信息
      }
    },

    /**
     * 检查用户信息更新
     * 当应用从后台切换到前台时调用
     */
    async checkUserInfoUpdate() {
      try {
        // 如果用户信息存在且距离上次更新超过24小时，尝试刷新
        if (this.globalData.userInfo && this.globalData.userInfo.lastUpdated) {
          const twentyFourHours = 24 * 60 * 60 * 1000
          const now = Date.now()
          
          if (now - this.globalData.userInfo.lastUpdated > twentyFourHours) {
            console.log('🔄 检查用户信息更新...')
            const updatedUserInfo = await userManager.getCurrentUserInfo()
            if (updatedUserInfo) {
              this.globalData.userInfo = updatedUserInfo
            }
          }
        }
      } catch (error) {
        console.error('检查用户信息更新失败:', error)
      }
    }
  }
}
</script>

<style>
/*每个页面公共css */
</style>

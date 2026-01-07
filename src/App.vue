<script>
import { getCloudEnv, logEnvInfo } from '@/config/env.js'

export default {
  onLaunch: function () {
    console.log('App Launch')
    
    // 打印环境信息（仅开发环境）
    logEnvInfo()
    
    // 从环境变量获取云开发环境 ID
    const cloudEnv = getCloudEnv()
    
    this.globalData = {
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处从环境变量读取，避免敏感信息硬编码
      env: cloudEnv
    };
    
    // #ifdef MP-WEIXIN
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }
    // #endif
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
</style>

/**
 * 分享工具模块
 * 封装微信小程序分享配置生成函数
 * 
 * 注意：分享图片规范
 * - 分享好友：推荐 5:4 比例，最小 500x400 像素
 * - 分享朋友圈：推荐 1:1 比例
 * - 如不设置 imageUrl，微信会自动截取页面截图
 */

/**
 * 分享图片路径
 * 当前未设置自定义图片，使用微信默认页面截图
 * 如需自定义，请准备 500x400 或 750x600 尺寸的图片
 */
const SHARE_IMAGE_URL = ''  // 暂不设置，使用页面截图

/**
 * 获取默认分享配置（小程序介绍）
 * @returns {Object} 分享配置对象
 */
export const getDefaultShareConfig = () => {
  const config = {
    title: '🎓 汉字认字量检测 - 测测孩子认识多少字',
    path: '/pages/home/home'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取结果分享配置
 * @param {number} vocabulary - 认字量
 * @returns {Object} 分享配置对象
 */
export const getResultShareConfig = (vocabulary) => {
  const config = {
    title: `🎊 我家宝贝认识 ${vocabulary} 个汉字！快来测测你家孩子`,
    path: '/pages/home/home'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取历史记录分享配置
 * @param {number} vocabulary - 认字量
 * @returns {Object} 分享配置对象
 */
export const getHistoryShareConfig = (vocabulary) => {
  const config = {
    title: `📊 检测记录：认识 ${vocabulary} 个汉字`,
    path: '/pages/home/home'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取默认朋友圈分享配置
 * @returns {Object} 朋友圈分享配置对象
 */
export const getDefaultTimelineConfig = () => {
  const config = {
    title: '汉字认字量检测 - 科学评估识字水平'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取结果朋友圈分享配置
 * @param {number} vocabulary - 认字量
 * @returns {Object} 朋友圈分享配置对象
 */
export const getResultTimelineConfig = (vocabulary) => {
  const config = {
    title: `我家宝贝认识 ${vocabulary} 个汉字`
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取历史记录朋友圈分享配置
 * @param {number} vocabulary - 认字量
 * @returns {Object} 朋友圈分享配置对象
 */
export const getHistoryTimelineConfig = (vocabulary) => {
  const config = {
    title: `检测记录：认识 ${vocabulary} 个汉字`
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取 AI 助手分享配置
 * @returns {Object} 分享配置对象
 */
export const getAIAssistantShareConfig = () => {
  const config = {
    title: '🤖 AI 识字小助手 - 智能分析孩子识字水平',
    path: '/pages/home/home'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取 AI 助手朋友圈分享配置
 * @returns {Object} 朋友圈分享配置对象
 */
export const getAIAssistantTimelineConfig = () => {
  const config = {
    title: 'AI 识字小助手 - 智能识字辅导'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取检测页分享配置
 * @param {string} mode - 模式：'test' 检测模式, 'learn' 学习模式
 * @returns {Object} 分享配置对象
 */
export const getTestShareConfig = (mode = 'test') => {
  const titles = {
    test: '🎯 正在进行汉字认字量检测，快来测测你家孩子！',
    learn: '📖 正在学习汉字，和我一起识字吧！'
  }
  const config = {
    title: titles[mode] || titles.test,
    path: '/pages/home/home'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取检测页朋友圈分享配置
 * @param {string} mode - 模式：'test' 检测模式, 'learn' 学习模式
 * @returns {Object} 朋友圈分享配置对象
 */
export const getTestTimelineConfig = (mode = 'test') => {
  const titles = {
    test: '汉字认字量检测 - 科学评估识字水平',
    learn: '汉字学习中 - 一起来识字吧'
  }
  const config = {
    title: titles[mode] || titles.test
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取生字本分享配置
 * @param {number} count - 生字数量
 * @returns {Object} 分享配置对象
 */
export const getVocabularyNotebookShareConfig = (count = 0) => {
  const title = count > 0 
    ? `📚 我的生字本有 ${count} 个汉字待学习，一起加油！`
    : '🎉 生字本已清空！快来测试你的认字量'
  const config = {
    title,
    path: '/pages/home/home'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取生字本朋友圈分享配置
 * @param {number} count - 生字数量
 * @returns {Object} 朋友圈分享配置对象
 */
export const getVocabularyNotebookTimelineConfig = (count = 0) => {
  const title = count > 0 
    ? `生字本：${count} 个汉字待学习`
    : '生字本已清空！来测试认字量吧'
  const config = {
    title
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

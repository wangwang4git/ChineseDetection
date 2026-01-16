<template>
  <!-- AI 助手页面 - 智能对话辅导 -->
  <view class="ai-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @tap="goBack">
          <text class="back-text">← 返回</text>
        </view>
        <text class="nav-title">🤖 AI小助手</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>
    
    <!-- 消息列表区域 -->
    <scroll-view 
      class="message-list" 
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="false"
      :style="{ 
        paddingTop: navBarHeight + 'px',
        height: scrollViewHeight + 'px'
      }"
      @scrolltoupper="onScrollToUpper"
    >
      <!-- 欢迎消息 -->
      <view v-if="messages.length === 0" class="welcome-section">
        <view class="welcome-avatar">🤖</view>
        <text class="welcome-title">你好！我是识字小助手</text>
        <text class="welcome-desc">基于孩子的检测数据，我可以为你提供专业的识字辅导建议。</text>
        <text class="welcome-hint">点击下方发送按钮，开始获取个性化分析报告吧～</text>
      </view>
      
      <!-- 消息列表 -->
      <view v-for="msg in messages" :key="msg.id" class="message-wrapper">
        <!-- 时间戳 -->
        <view v-if="msg.showTime" class="time-stamp">
          <text class="time-text">{{ msg.time }}</text>
        </view>
        
        <!-- AI 消息 -->
        <view v-if="msg.role === 'ai'" class="ai-message">
          <view class="ai-avatar">🤖</view>
          <view class="ai-bubble">
            <!-- 加载状态 -->
            <view v-if="msg.isLoading" class="loading-dots">
              <text class="dot">●</text>
              <text class="dot">●</text>
              <text class="dot">●</text>
            </view>
            <!-- Markdown 内容渲染（流式 + 完成后都使用 rich-text） -->
            <rich-text 
              v-else-if="msg.htmlContent"
              class="markdown-content"
              :nodes="msg.htmlContent"
              :user-select="true"
            />
            <!-- 无内容占位 -->
            <text v-else-if="!msg.isLoading && !msg.content" class="empty-hint">暂无内容</text>
            <!-- 打字机光标 -->
            <text v-if="msg.isStreaming" class="typing-cursor">|</text>
          </view>
        </view>
        
        <!-- 用户消息 -->
        <view v-else class="user-message">
          <view class="user-bubble">
            <text class="user-text">{{ msg.content }}</text>
          </view>
        </view>
      </view>
      
      <!-- 底部占位 - 用于滚动定位 -->
      <view class="message-bottom-space"></view>
    </scroll-view>
    
    <!-- 底部输入区域 -->
    <view class="input-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="input-wrapper">
        <textarea
          class="message-input"
          v-model="inputText"
          placeholder="输入消息..."
          :maxlength="2000"
          :auto-height="true"
          :show-confirm-bar="false"
          :adjust-position="true"
          :cursor-spacing="20"
          :hold-keyboard="true"
          @confirm="sendMessage"
        />
        <view 
          class="send-btn" 
          :class="{ active: canSend, disabled: !canSend }"
          @tap="sendMessage"
        >
          <text class="send-icon">➤</text>
        </view>
      </view>
    </view>
    
    <!-- H5 平台提示 -->
    <!-- #ifdef H5 -->
    <view v-if="showH5Tip" class="h5-tip-modal" @tap="showH5Tip = false">
      <view class="h5-tip-content" @tap.stop>
        <text class="h5-tip-icon">📱</text>
        <text class="h5-tip-title">功能提示</text>
        <text class="h5-tip-text">AI 辅导功能仅支持微信小程序环境使用。</text>
        <text class="h5-tip-text">请在微信中打开小程序体验完整功能。</text>
        <view class="h5-tip-btn" @tap="showH5Tip = false">我知道了</view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup>
/**
 * AI 助手页面 v2.0
 * 智能对话辅导，支持流式输出和 Markdown 渲染
 * 使用 markdown-it + rich-text 方案
 */
import { ref, computed, onMounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getRecordList } from '@/api/record.js'
import userManager from '@/utils/userManager.js'
import { 
  getSystemPrompt, 
  buildUserPrompt, 
  getAgeStage, 
  getTargetByAge,
  analyzeCharGroup,
  extractUnknownChars
} from '@/utils/aiPrompt.js'
import { getAITools } from '@/utils/aiTools.js'
import { ENV_CONFIG } from '@/config/env.js'
import MarkdownIt from 'markdown-it'

// 初始化 markdown-it 实例
const md = new MarkdownIt({
  html: false,        // 禁用 HTML 标签
  breaks: true,       // 将 \n 转换为 <br>
  linkify: true       // 自动转换 URL 为链接
})

// 状态栏高度
const statusBarHeight = ref(0)
// 导航栏总高度
const navBarHeight = ref(88)
// 安全区域底部
const safeAreaBottom = ref(0)
// scroll-view 高度
const scrollViewHeight = ref(0)
// 滚动位置
const scrollTop = ref(0)
// 输入内容
const inputText = ref('')
// 消息列表
const messages = ref([])
// 对话历史（用于 AI 接口）
const conversationHistory = ref([])
// System Prompt
const systemPrompt = ref('')
// 是否正在发送
const isSending = ref(false)
// H5 提示弹窗
const showH5Tip = ref(false)
// 用户数据
const userData = ref({
  age: 0,
  actualCount: 0,
  unknownChars: [],
  charGroup: ''
})

// 是否可以发送
const canSend = computed(() => {
  return inputText.value.trim() && !isSending.value
})

/**
 * 页面加载
 */
onLoad(() => {
  initPage()
})

/**
 * 页面挂载
 */
onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
  navBarHeight.value = statusBarHeight.value + 44
  safeAreaBottom.value = systemInfo.safeAreaInsets?.bottom || 0
  
  // 计算 scroll-view 高度 = 屏幕高度 - 输入栏高度（约 120px）
  const inputBarHeight = 60 + (safeAreaBottom.value || 0)
  scrollViewHeight.value = systemInfo.windowHeight - inputBarHeight
  
  // 初始化 System Prompt
  systemPrompt.value = getSystemPrompt()
})

/**
 * 初始化页面
 */
const initPage = async () => {
  try {
    // 加载用户数据
    await loadUserData()
    
    // 构造预填充提示词
    const prompt = buildUserPrompt({
      age: userData.value.age,
      actualCount: userData.value.actualCount,
      unknownChars: userData.value.unknownChars,
      charGroup: userData.value.charGroup
    })
    
    // 预填充到输入框
    inputText.value = prompt
  } catch (error) {
    console.error('初始化页面失败:', error)
  }
}

/**
 * 加载用户数据
 * 基于所有检测记录（而非仅最后一次）计算实测认字量、不认识汉字列表和聚集分组
 */
const loadUserData = async () => {
  try {
    // 获取用户信息
    const userInfo = await userManager.getCurrentUserInfo()
    userData.value.age = userInfo?.age || 6
    
    // 获取所有检测记录
    const recordsRes = await getRecordList()
    if (recordsRes.errCode === 0 && recordsRes.data.length > 0) {
      const allRecords = recordsRes.data
      
      // 1. 实测认字量：取所有记录的平均值
      const vocabularySum = allRecords.reduce(
        (sum, record) => sum + (record.estimatedVocabulary || 0), 0
      )
      userData.value.actualCount = Math.round(vocabularySum / allRecords.length)
      
      // 2. 不认识汉字列表：合并所有记录中的不认识汉字（去重）
      const allUnknownChars = new Set()
      allRecords.forEach(record => {
        const unknownChars = extractUnknownChars(record)
        unknownChars.forEach(char => allUnknownChars.add(char))
      })
      userData.value.unknownChars = Array.from(allUnknownChars)
      
      // 3. 分析汉字聚集分组（基于合并后的不认识汉字列表）
      if (userData.value.unknownChars.length > 0) {
        try {
          const charData = await loadCharData()
          userData.value.charGroup = analyzeCharGroup(
            userData.value.unknownChars.map(char => ({ char })),
            charData
          )
        } catch (e) {
          userData.value.charGroup = '常用字'
        }
      }
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

/**
 * 加载汉字数据
 */
const loadCharData = async () => {
  return new Promise((resolve, reject) => {
    try {
      // 尝试从静态资源加载
      const data = require('@/static/top_2500_chars_with_literacy.json')
      resolve(data)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 返回上一页
 */
const goBack = () => {
  uni.navigateBack()
}

/**
 * 发送消息
 */
const sendMessage = async () => {
  if (!canSend.value) return
  
  const content = inputText.value.trim()
  if (!content) return
  
  // 清空输入框
  inputText.value = ''
  
  // 添加用户消息
  addMessage('user', content)
  
  // 标记正在发送
  isSending.value = true
  
  // #ifdef MP-WEIXIN
  // 微信小程序：调用 AI 接口
  await sendToAI(content)
  // #endif
  
  // #ifdef H5
  // H5：显示提示
  showH5Tip.value = true
  addMessage('ai', '此功能仅支持微信小程序环境，请在微信中打开小程序体验 AI 辅导功能。')
  isSending.value = false
  // #endif
}

/**
 * 添加消息
 */
const addMessage = (role, content, isLoading = false) => {
  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  // 判断是否需要显示时间（首条消息或距上条消息超5分钟）
  const lastMsg = messages.value[messages.value.length - 1]
  const showTime = !lastMsg || (now.getTime() - new Date(lastMsg.timestamp).getTime() > 5 * 60 * 1000)
  
  const msg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role,
    content: content || '',
    htmlContent: content ? renderMarkdown(content) : '', // Markdown 转 HTML
    time: timeStr,
    timestamp: now.toISOString(),
    showTime,
    isLoading,        // 等待响应中（显示加载动画）
    isStreaming: false // 流式输出中（显示光标）
  }
  
  messages.value.push(msg)
  nextTick(scrollToBottom)
  return msg.id
}

/**
 * 将 Markdown 转换为带样式的 HTML
 */
const renderMarkdown = (content) => {
  if (!content) return ''
  // 使用 markdown-it 转换，并包裹样式容器
  const html = md.render(content)
  // 添加内联样式确保在小程序中正确显示
  return wrapWithStyles(html)
}

/**
 * 为 HTML 添加内联样式（rich-text 不支持外部样式）
 */
const wrapWithStyles = (html) => {
  return html
    // 段落
    .replace(/<p>/g, '<p style="margin:6px 0;line-height:1.7;font-size:14px;color:#1E2939;">')
    // 标题
    .replace(/<h1>/g, '<h1 style="font-size:20px;font-weight:700;color:#1E2939;margin:12px 0 8px 0;">')
    .replace(/<h2>/g, '<h2 style="font-size:18px;font-weight:600;color:#1E2939;margin:10px 0 7px 0;">')
    .replace(/<h3>/g, '<h3 style="font-size:16px;font-weight:600;color:#1E2939;margin:9px 0 6px 0;">')
    // 加粗
    .replace(/<strong>/g, '<strong style="font-weight:600;color:#1E2939;">')
    // 斜体
    .replace(/<em>/g, '<em style="font-style:italic;">')
    // 列表
    .replace(/<ul>/g, '<ul style="padding-left:20px;margin:6px 0;">')
    .replace(/<ol>/g, '<ol style="padding-left:20px;margin:6px 0;">')
    .replace(/<li>/g, '<li style="margin:4px 0;line-height:1.6;">')
    // 引用块
    .replace(/<blockquote>/g, '<blockquote style="margin:8px 0;padding:8px 10px;background:rgba(194,122,255,0.1);border-left:3px solid #C27AFF;border-radius:0 6px 6px 0;color:#4A5565;font-style:italic;">')
    // 代码
    .replace(/<code>/g, '<code style="font-family:Consolas,Monaco,monospace;font-size:13px;background:rgba(194,122,255,0.15);padding:2px 6px;border-radius:4px;color:#9810FA;">')
    .replace(/<pre>/g, '<pre style="margin:8px 0;padding:10px;background:#1E2939;border-radius:6px;overflow-x:auto;color:#E5E7EB;">')
    // 链接
    .replace(/<a /g, '<a style="color:#51A2FF;text-decoration:underline;" ')
    // 水平线
    .replace(/<hr>/g, '<hr style="height:1px;background:#E5E7EB;margin:12px 0;border:none;">')
    .replace(/<hr\/>/g, '<hr style="height:1px;background:#E5E7EB;margin:12px 0;border:none;"/>')
}

/**
 * 更新消息内容（流式更新）
 */
const updateMessageContent = (msgId, content) => {
  const idx = messages.value.findIndex(m => m.id === msgId)
  if (idx !== -1) {
    // 转换 Markdown 为 HTML
    const htmlContent = renderMarkdown(content)
    // 小程序中需要替换整个对象才能触发响应式更新
    messages.value[idx] = {
      ...messages.value[idx],
      content,
      htmlContent,
      isLoading: false,
      isStreaming: true
    }
    // 强制数组更新（小程序兼容）
    messages.value = [...messages.value]
    scrollToBottom()
  }
}

/**
 * 标记消息完成
 */
const markMessageComplete = (msgId) => {
  const idx = messages.value.findIndex(m => m.id === msgId)
  if (idx !== -1) {
    messages.value[idx] = {
      ...messages.value[idx],
      isStreaming: false
    }
    // 强制数组更新
    messages.value = [...messages.value]
  }
}

// 滚动节流定时器
let scrollTimer = null
// 滚动计数器（用于强制触发更新）
let scrollCounter = 0

/**
 * 滚动到底部（带节流）
 * 使用大数值 + 微小变化，确保小程序能检测到值变化
 */
const scrollToBottom = () => {
  // 节流：100ms 内只执行一次滚动
  if (scrollTimer) return
  
  scrollTimer = setTimeout(() => {
    scrollTimer = null
    // 每次滚动使用不同的值，确保触发响应式更新
    scrollCounter++
    // 使用一个足够大的值，加上计数器确保每次不同
    scrollTop.value = 100000 + scrollCounter
  }, 100)
}

/**
 * 滚动到顶部事件（预留）
 */
const onScrollToUpper = () => {
  // 可用于加载历史消息
}

// #ifdef MP-WEIXIN
/**
 * 发送消息到 AI（微信小程序）
 * 集成工具调用机制，支持联网搜索
 */
const sendToAI = async (userMessage) => {
  // 添加空的 AI 消息（加载状态）
  const aiMsgId = addMessage('ai', '', true)
  
  try {
    // 构建消息历史
    const messageHistory = [
      { role: 'system', content: systemPrompt.value },
      ...conversationHistory.value,
      { role: 'user', content: userMessage }
    ]
    
    // 获取 AI 工具（仅当配置了 Tavily API Key 时启用）
    const tools = getAITools({ tavilyApiKey: ENV_CONFIG.TAVILY_API_KEY })
    
    let fullContent = ''
    
    // 构建调用参数
    const streamParams = {
      data: {
        model: 'deepseek-v3.2',
        messages: messageHistory
      },
      onText: (text) => {
        if (text) {
          fullContent += text
          updateMessageContent(aiMsgId, fullContent)
        }
      },
      onFinish: () => {
        markMessageComplete(aiMsgId)
        isSending.value = false
        // 添加到对话历史
        conversationHistory.value.push(
          { role: 'user', content: userMessage },
          { role: 'assistant', content: fullContent }
        )
      },
      onError: (error) => {
        console.error('[AI] 错误:', error)
        handleAIError(aiMsgId, error)
      }
    }
    
    // 若有可用工具，注册到调用参数中
    if (tools.length > 0) {
      streamParams.data.tools = tools
      console.log('[AI] 已注册工具:', tools.map(t => t.name).join(', '))
    }
    
    // 调用微信云开发 AI 接口
    await wx.cloud.extend.AI.createModel("deepseek").streamText(streamParams)
  } catch (error) {
    console.error('[AI] 异常:', error)
    handleAIError(aiMsgId, error)
  }
}

/**
 * 处理 AI 错误
 */
const handleAIError = (msgId, error) => {
  isSending.value = false
  
  let errorMsg = '抱歉，AI 暂时无法回复，请稍后重试。'
  
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network')) {
    errorMsg = '网络连接失败，请检查网络后重试。'
  } else if (error?.code === 'RATE_LIMIT') {
    errorMsg = '请求过于频繁，请稍后再试。'
  }
  
  updateMessageContent(msgId, errorMsg)
  markMessageComplete(msgId)
  
  uni.showToast({
    title: 'AI 服务暂时不可用',
    icon: 'none',
    duration: 2000
  })
}
// #endif
</script>

<style scoped>
.ai-page {
  min-height: 100vh;
  /* 设计稿：135deg 渐变方向 */
  background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
  display: flex;
  flex-direction: column;
  /* 防止水平滚动 */
  overflow-x: hidden;
  /* 确保背景覆盖完整 */
  width: 100%;
  position: relative;
}

/* 导航栏 */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  /* 改为透明背景，与其他页面保持一致 */
  background: transparent;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
}

/* 返回按钮 - 与历史详情页对齐 */
.back-btn {
  display: inline-flex;
  align-items: center;
  padding: 14rpx 36rpx;
  background: rgba(255, 255, 255, 0.90);
  border-radius: 9999rpx;
  border: 3rpx solid #DAB2FF;
  box-shadow: 0 8rpx 12rpx -8rpx rgba(0, 0, 0, 0.10), 0 20rpx 30rpx -6rpx rgba(0, 0, 0, 0.10);
}

.back-btn:active {
  opacity: 0.8;
}

.back-text {
  font-size: 32rpx;
  color: #6E11B0;
  font-weight: 500;
}

.nav-title {
  /* 设计稿：20px, font-weight 500 */
  font-size: 40rpx;
  font-weight: 500;
  color: #6E11B0;
}

.nav-placeholder {
  width: 120rpx;
}

/* 消息列表 */
.message-list {
  /* 高度通过 JS 动态计算设置 */
  /* 上下 padding 保留，左右 padding 移至 message-wrapper */
  padding: 24rpx 0;
  box-sizing: border-box;
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
  text-align: center;
}

.welcome-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #C27AFF 0%, #FB64B6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx;
  margin-bottom: 32rpx;
  border: 6rpx solid #FFF;
  box-shadow: 0 16rpx 32rpx rgba(194, 122, 255, 0.3);
}

.welcome-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #6E11B0;
  margin-bottom: 16rpx;
}

.welcome-desc {
  font-size: 28rpx;
  color: #364153;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.welcome-hint {
  font-size: 26rpx;
  color: #6A7282;
  font-style: italic;
}

/* 消息样式 */
.message-wrapper {
  margin-bottom: 24rpx;
  /* 设计稿：左右间距 16px，确保消息不贴边 */
  padding: 0 32rpx;
}

.time-stamp {
  display: flex;
  justify-content: center;
  margin: 24rpx 0;
}

.time-text {
  font-size: 24rpx;
  /* 设计稿：#99A1AF */
  color: #99A1AF;
  background: rgba(255, 255, 255, 0.6);
  padding: 8rpx 24rpx;
  border-radius: 20rpx;
}

/* AI 消息 */
.ai-message {
  display: flex;
  align-items: flex-start;
}

.ai-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #C27AFF 0%, #FB64B6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
  border: 3rpx solid #FFF;
  /* 设计稿：阴影颜色为黑色透明 */
  box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.10), 0 4rpx 8rpx -4rpx rgba(0, 0, 0, 0.10);
}

.ai-bubble {
  max-width: 70%;
  /* 设计稿：padding 13.566px 17.566px */
  padding: 27rpx 35rpx;
  background: linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%);
  border: 3rpx solid #E9D4FF;
  border-radius: 12rpx 32rpx 32rpx 32rpx;
  /* 设计稿：阴影 */
  box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.10), 0 4rpx 8rpx -4rpx rgba(0, 0, 0, 0.10);
}

/* 加载动画 */
.loading-dots {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.dot {
  font-size: 24rpx;
  color: #C27AFF;
  animation: blink 1.4s infinite both;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
}

/* Markdown 内容样式 */
.markdown-content {
  font-size: 28rpx;
  color: #1E2939;
  line-height: 1.7;
  word-break: break-all;
}

/* 打字机光标 */
.typing-cursor {
  display: inline;
  font-size: 28rpx;
  color: #C27AFF;
  font-weight: bold;
  animation: cursor-blink 0.8s infinite;
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* 用户消息 */
.user-message {
  display: flex;
  justify-content: flex-end;
}

.user-bubble {
  max-width: 70%;
  /* 设计稿：padding 12px 16px */
  padding: 24rpx 32rpx;
  background: linear-gradient(135deg, #51A2FF 0%, #C27AFF 100%);
  border-radius: 32rpx 12rpx 32rpx 32rpx;
  /* 设计稿：阴影为黑色透明 */
  box-shadow: 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.10), 0 4rpx 8rpx -4rpx rgba(0, 0, 0, 0.10);
}

.user-text {
  font-size: 28rpx;
  color: #FFF;
  line-height: 1.6;
  word-break: break-all;
  white-space: pre-wrap;
}

.message-bottom-space {
  height: 40rpx;
}

/* 输入区域 */
.input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  /* 设计稿：纯白背景 */
  background: #FFF;
  backdrop-filter: blur(20rpx);
  padding: 35rpx 32rpx;
  /* 设计稿：边框颜色 #E9D4FF */
  border-top: 3rpx solid #E9D4FF;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 16rpx;
}

.message-input {
  flex: 1;
  min-height: 72rpx;
  max-height: 200rpx;
  /* 调整内边距：上下10rpx，左右2rpx */
  padding: 10rpx 2rpx;
  background: #F3F4F6;
  /* 进一步降低圆角效果 */
  border-radius: 20rpx;
  /* 设计稿：边框 1.567px solid #E5E7EB */
  border: 3rpx solid #E5E7EB;
  font-size: 28rpx;
  color: #1E2939;
  line-height: 1.5;
}

.send-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(90deg, #E0E0E0 0%, #CCCCCC 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.send-btn.active {
  /* 设计稿：渐变方向 90deg */
  background: linear-gradient(90deg, #C27AFF 0%, #FB64B6 100%);
  /* 设计稿：阴影 */
  box-shadow: 0 20rpx 30rpx -6rpx rgba(0, 0, 0, 0.10), 0 8rpx 12rpx -8rpx rgba(0, 0, 0, 0.10);
}

.send-btn.disabled {
  /* 设计稿：opacity 0.5 */
  opacity: 0.5;
}

.send-btn:active:not(.disabled) {
  transform: scale(0.95);
}

.send-icon {
  font-size: 36rpx;
  color: #FFF;
}

/* 空内容占位 */
.empty-hint {
  font-size: 28rpx;
  color: #9CA3AF;
}

/* H5 提示弹窗 */
.h5-tip-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.h5-tip-content {
  background: #FFF;
  border-radius: 32rpx;
  padding: 48rpx;
  margin: 0 48rpx;
  max-width: 560rpx;
  text-align: center;
}

.h5-tip-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 24rpx;
}

.h5-tip-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1E2939;
  display: block;
  margin-bottom: 24rpx;
}

.h5-tip-text {
  font-size: 28rpx;
  color: #4A5565;
  line-height: 1.6;
  display: block;
  margin-bottom: 12rpx;
}

.h5-tip-btn {
  margin-top: 32rpx;
  padding: 24rpx 48rpx;
  background: linear-gradient(135deg, #C27AFF 0%, #FB64B6 100%);
  color: #FFF;
  font-size: 30rpx;
  font-weight: 500;
  border-radius: 24rpx;
}
</style>

<!-- 非 scoped 样式：设置 page 背景防止弹性滚动露白 -->
<style>
page {
  background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
  overflow-x: hidden;
}
</style>

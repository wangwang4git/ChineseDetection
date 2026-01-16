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
            <!-- 加载状态：仅当 isLoading 为 true 且无内容时显示 -->
            <view v-if="msg.isLoading && !msg.displayContent" class="loading-dots">
              <text class="dot">●</text>
              <text class="dot">●</text>
              <text class="dot">●</text>
            </view>
            <!-- 流式输出时直接使用 text 渲染，避免 mp-html 更新问题 -->
            <view v-else-if="msg.displayContent && msg.isTyping" class="streaming-content">
              <text class="streaming-text">{{ msg.displayContent }}</text>
            </view>
            <!-- 完成后使用 ua-markdown 组件渲染 Markdown -->
            <!-- 添加 :key 强制组件重新挂载 -->
            <ua-markdown 
              v-else-if="msg.displayContent && !msg.isTyping && msg.isComplete" 
              :key="'md-' + msg.id + '-' + msg.displayContent.length"
              :source="msg.displayContent" 
              :selectable="true"
              @ready="() => console.log('[ai-assistant] ua-markdown ready for msg:', msg.id)"
              @error="(e) => console.error('[ai-assistant] ua-markdown error:', e)"
            />
            <!-- 备用：如果 isComplete 为 false 但有内容且不在打字 -->
            <view v-else-if="msg.displayContent && !msg.isTyping && !msg.isComplete" class="streaming-content">
              <text class="streaming-text">{{ msg.displayContent }}</text>
            </view>
            <!-- 打字机光标效果 -->
            <text v-if="msg.isTyping" class="typing-cursor">|</text>
            <text v-if="!msg.displayContent && !msg.isLoading" class="empty-content">等待回复...</text>
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
 * AI 助手页面 v1.0
 * 智能对话辅导，支持流式输出和 Markdown 渲染
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
  
  // 判断是否需要显示时间
  const showTime = messages.value.length === 0 || 
    (messages.value.length > 0 && 
     new Date().getTime() - new Date(messages.value[messages.value.length - 1].timestamp).getTime() > 5 * 60 * 1000)
  
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const msg = {
    id: msgId,
    role,
    content,           // 完整内容（用于存储）
    displayContent: content || '', // 显示内容（用于打字机效果），确保不是 undefined
    time: timeStr,
    timestamp: now.toISOString(),
    showTime,
    isLoading,
    isTyping: false,   // 是否正在打字
    isComplete: !isLoading
  }
  
  messages.value.push(msg)
  
  console.log('[addMessage] 添加消息:', JSON.stringify({ id: msgId, role, isLoading, displayContent: content?.substring(0, 20) }))
  console.log('[addMessage] 当前消息数量:', messages.value.length)
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
  
  // 返回消息ID，而不是对象引用
  return { id: msgId, ...msg }
}

/**
 * 更新消息内容（流式更新 - 打字机效果）
 * 直接更新显示内容，实现实时流式展示
 */
const updateMessageContent = (msgId, newContent) => {
  // console.log('[updateMessageContent] 开始更新, msgId:', msgId, ', newContent长度:', newContent?.length)
  // console.log('[updateMessageContent] 当前messages数量:', messages.value.length)
  
  const msgIndex = messages.value.findIndex(m => m.id === msgId)
  // console.log('[updateMessageContent] 找到索引:', msgIndex)
  
  if (msgIndex !== -1) {
    const msg = messages.value[msgIndex]
    // console.log('[updateMessageContent] 原消息:', JSON.stringify({ 
    //   id: msg.id, 
    //   displayContent: msg.displayContent?.substring(0, 50),
    //   isLoading: msg.isLoading 
    // }))
    
    // 直接修改数组元素的属性，而不是替换整个对象
    // 在小程序中，这种方式可能更可靠地触发响应式更新
    messages.value[msgIndex] = {
      ...msg,
      content: newContent,        // 存储完整内容
      displayContent: newContent, // 直接显示完整内容（流式更新）
      isLoading: false,
      isTyping: true              // 标记正在打字
    }
    
    // 强制触发数组更新（小程序兼容）
    messages.value = [...messages.value]
    
    // console.log('[updateMessageContent] 更新后消息:', JSON.stringify({
    //   id: messages.value[msgIndex].id,
    //   displayContent: messages.value[msgIndex].displayContent?.substring(0, 50),
    //   isLoading: messages.value[msgIndex].isLoading
    // }))
    
    // 滚动到底部
    scrollToBottom()
  } else {
    console.error('[updateMessageContent] 未找到消息, msgId:', msgId)
    console.error('[updateMessageContent] 所有消息ID:', messages.value.map(m => m.id))
  }
}

/**
 * 标记消息完成（停止打字机效果）
 */
const markMessageComplete = (msgId) => {
  console.log('[markMessageComplete] msgId:', msgId)
  const msgIndex = messages.value.findIndex(m => m.id === msgId)
  if (msgIndex !== -1) {
    const msg = messages.value[msgIndex]
    console.log('[markMessageComplete] 更新前消息状态:', JSON.stringify({
      id: msg.id,
      displayContent: msg.displayContent?.substring(0, 50),
      displayContentLength: msg.displayContent?.length,
      isTyping: msg.isTyping,
      isLoading: msg.isLoading
    }))
    
    messages.value[msgIndex] = {
      ...msg,
      isComplete: true,
      isLoading: false,
      isTyping: false  // 停止打字机效果
    }
    // 强制触发数组更新（小程序兼容）
    messages.value = [...messages.value]
    
    const updatedMsg = messages.value[msgIndex]
    console.log('[markMessageComplete] 更新后消息状态:', JSON.stringify({
      id: updatedMsg.id,
      displayContent: updatedMsg.displayContent?.substring(0, 50),
      displayContentLength: updatedMsg.displayContent?.length,
      isTyping: updatedMsg.isTyping,
      isLoading: updatedMsg.isLoading,
      shouldShowMarkdown: !!(updatedMsg.displayContent && !updatedMsg.isTyping)
    }))
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
 */
const sendToAI = async (userMessage) => {
  // 添加空的 AI 消息（加载状态）
  const aiMessage = addMessage('ai', '', true)
  
  console.log('[AI Debug] 开始发送消息到 AI')
  console.log('[AI Debug] 用户消息:', userMessage)
  
  try {
    // 构建消息历史
    const messageHistory = [
      { role: 'system', content: systemPrompt.value },
      ...conversationHistory.value,
      { role: 'user', content: userMessage }
    ]
    
    console.log('[AI Debug] 消息历史长度:', messageHistory.length)
    console.log('[AI Debug] System Prompt 长度:', systemPrompt.value?.length || 0)
    
    let fullContent = ''
    let chunkCount = 0
    
    // 调用微信云开发 AI 接口
    // 根据官方文档：onText 回调参数是增量文本字符串，需要累加
    console.log('[AI Debug] 准备调用 wx.cloud.extend.AI.createModel("deepseek").streamText()')
    
    const result = await wx.cloud.extend.AI.createModel("deepseek").streamText({
      data: {
        model: 'deepseek-v3.2',
        messages: messageHistory
      },
      onText: (text) => {
        chunkCount++
        // console.log(`[AI Debug] onText 第${chunkCount}次回调, 类型: ${typeof text}, 内容:`, text)
        // text 是增量文本，需要累加到 fullContent
        if (text) {
          fullContent += text
          updateMessageContent(aiMessage.id, fullContent)
        }
      },
      onEvent: (event) => {
        // console.log('[AI Debug] onEvent 回调:', event)
      },
      onFinish: (finalText) => {
        console.log('[AI Debug] onFinish 回调, 类型:', typeof finalText, ', 内容:', finalText)
        console.log('[AI Debug] 累计内容长度:', fullContent.length)
        console.log('[AI Debug] 总共收到', chunkCount, '次 onText 回调')
        // finalText 是完整文本
        markMessageComplete(aiMessage.id)
        isSending.value = false
        
        // 添加到对话历史
        conversationHistory.value.push(
          { role: 'user', content: userMessage },
          { role: 'assistant', content: fullContent || finalText || '' }
        )
      },
      onError: (error) => {
        console.error('[AI Debug] onError 回调:', error)
        handleAIError(aiMessage.id, error)
      }
    })
    
    console.log('[AI Debug] streamText 返回值:', result)
  } catch (error) {
    console.error('[AI Debug] AI 调用异常:', error)
    console.error('[AI Debug] 异常堆栈:', error?.stack)
    handleAIError(aiMessage.id, error)
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
  padding: 20rpx 36rpx;
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
  padding-bottom: 200rpx;
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
  0%, 80%, 100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}

/* 流式输出内容样式 */
.streaming-content {
  display: inline;
}

.streaming-text {
  font-size: 28rpx;
  color: #1E2939;
  line-height: 1.7;
  word-break: break-all;
  white-space: pre-wrap;
}

/* 打字机光标效果 */
.typing-cursor {
  display: inline;
  font-size: 28rpx;
  color: #C27AFF;
  font-weight: bold;
  animation: cursor-blink 0.8s infinite;
}

@keyframes cursor-blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.empty-content {
  font-size: 28rpx;
  color: #6A7282;
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

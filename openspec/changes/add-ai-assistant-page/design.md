# Design: add-ai-assistant-page

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AI 助手页面架构                        │
├─────────────────────────────────────────────────────────┤
│  profile.vue ──(点击AI辅导)──> ai-assistant.vue         │
│                                     │                    │
│                              ┌──────┴──────┐            │
│                              │  消息管理    │            │
│                              └──────┬──────┘            │
│                                     │                    │
│                    ┌────────────────┼────────────────┐  │
│                    │                │                │  │
│              ┌─────┴─────┐   ┌──────┴──────┐  ┌────────────┐
│              │ aiPrompt  │   │ streamText  │  │ua-markdown │
│              │ 提示词构造 │   │ 流式对话    │  │  MD渲染    │
│              └───────────┘   └─────────────┘  └────────────┘
└─────────────────────────────────────────────────────────┘
```

## Component Design

### 1. 个人页更新 - profile.vue

```vue
<!-- 历史记录区域标题更新 -->
<view class="history-header">
  <text class="section-title">📚 历史检测记录</text>
  <view class="ai-tutor-btn" @tap="goToAiAssistant">
    <text class="ai-tutor-text">🤖 AI辅导</text>
  </view>
</view>
```

样式设计：
```css
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.ai-tutor-btn {
  display: flex;
  align-items: center;
  padding: 16rpx 28rpx;
  border-radius: 9999rpx;
  background: linear-gradient(90deg, #C27AFF 0%, #FB64B6 100%);
  border: 3rpx solid #FFF;
  box-shadow: 0 16rpx 24rpx rgba(0, 0, 0, 0.1);
}

.ai-tutor-text {
  color: #FFF;
  font-size: 28rpx;
  font-weight: 500;
}
```

### 2. AI 助手页面 - ai-assistant.vue

#### 页面结构
```vue
<template>
  <view class="ai-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">← 返回</view>
      <text class="nav-title">🤖 AI小助手</text>
    </view>
    
    <!-- 消息列表区域 -->
    <scroll-view class="message-list" scroll-y :scroll-top="scrollTop">
      <view v-for="msg in messages" :key="msg.id" class="message-wrapper">
        <!-- 时间戳 -->
        <view v-if="msg.showTime" class="time-stamp">{{ msg.time }}</view>
        
        <!-- AI 消息 -->
        <view v-if="msg.role === 'ai'" class="ai-message">
          <view class="ai-avatar">🤖</view>
          <view class="ai-bubble">
            <!-- 使用 ua-markdown 组件渲染 Markdown -->
            <ua-markdown :source="msg.content" :showLine="false" />
          </view>
        </view>
        
        <!-- 用户消息 -->
        <view v-else class="user-message">
          <view class="user-bubble">{{ msg.content }}</view>
        </view>
      </view>
    </scroll-view>
    
    <!-- 底部输入区域 -->
    <view class="input-bar">
      <input 
        class="message-input" 
        v-model="inputText" 
        placeholder="输入消息..."
        @confirm="sendMessage"
      />
      <view class="send-btn" :class="{ active: inputText }" @tap="sendMessage">
        <text class="send-icon">➤</text>
      </view>
    </view>
  </view>
</template>
```

### 3. 提示词构造 - aiPrompt.js

```javascript
// src/utils/aiPrompt.js

import systemPromptContent from '@/static/幼儿及青少年识字教育专家.md?raw'

/**
 * 获取 System Prompt
 */
export function getSystemPrompt() {
  return systemPromptContent
}

/**
 * 构造 User Prompt
 * @param {Object} params - 用户参数
 * @param {number} params.age - 用户年龄
 * @param {string} params.ageStage - 年龄阶段描述
 * @param {number} params.targetMin - 目标认字量最小值
 * @param {number} params.targetMax - 目标认字量最大值
 * @param {number} params.actualCount - 实测认字量
 * @param {Array<string>} params.unknownChars - 不认识汉字列表
 * @param {string} params.charGroup - 汉字聚集分组
 */
export function buildUserPrompt(params) {
  const {
    age = 6,
    ageStage = '幼小衔接阶段',
    targetMin = 300,
    targetMax = 500,
    actualCount = 0,
    unknownChars = [],
    charGroup = '常用字'
  } = params

  return `孩子基本信息：${age}岁，正处于${ageStage}。
目标认字量：${targetMin}-${targetMax}字。
实测认字量：${actualCount}字。
不认识汉字列表：${unknownChars.length > 0 ? unknownChars.join('、') : '暂无数据'}。
不认识汉字聚集分组：${charGroup}。`
}

/**
 * 根据年龄获取阶段描述
 */
export function getAgeStage(age) {
  if (age <= 3) return '启蒙阶段'
  if (age <= 5) return '幼儿园阶段'
  if (age === 6) return '幼小衔接阶段'
  if (age <= 8) return '小学低年级阶段'
  if (age <= 10) return '小学中年级阶段'
  return '小学高年级阶段'
}
```

### 4. AI 接口调用逻辑

```javascript
// #ifdef MP-WEIXIN
/**
 * 发送消息到 AI
 */
const sendToAI = async (userMessage) => {
  const aiMessage = addMessage('ai', '', true) // 添加空的 AI 消息
  
  try {
    const result = await wx.cloud.extend.AI.streamText({
      data: {
        model: 'deepseek-v3.2',
        messages: [
          { role: 'system', content: systemPrompt.value },
          ...conversationHistory.value,
          { role: 'user', content: userMessage }
        ]
      },
      onText: (text) => {
        // 流式更新 AI 消息内容
        updateMessageContent(aiMessage.id, text.text)
      },
      onFinish: (res) => {
        // 标记消息完成
        markMessageComplete(aiMessage.id)
        // 添加到对话历史
        conversationHistory.value.push(
          { role: 'user', content: userMessage },
          { role: 'assistant', content: res.text }
        )
      }
    })
  } catch (error) {
    console.error('AI 调用失败:', error)
    updateMessageContent(aiMessage.id, '抱歉，AI 暂时无法回复，请稍后重试。')
  }
}
// #endif
```

### 5. 消息样式设计

```css
/* AI 消息气泡 */
.ai-bubble {
  max-width: 70%;
  padding: 24rpx 28rpx;
  background: linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%);
  border: 3rpx solid #E9D4FF;
  border-radius: 12rpx 32rpx 32rpx 32rpx;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
}

/* 用户消息气泡 */
.user-bubble {
  max-width: 70%;
  padding: 24rpx 28rpx;
  background: linear-gradient(135deg, #51A2FF 0%, #C27AFF 100%);
  border-radius: 32rpx 12rpx 32rpx 32rpx;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
  color: #FFF;
}

/* AI 头像 */
.ai-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #C27AFF 0%, #FB64B6 100%);
  border: 3rpx solid #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
}
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         数据流向                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 页面加载                                                    │
│     ├── userManager.getCurrentUserInfo() → age                 │
│     ├── levelConfig.getTargetByAge(age) → targetMin/Max        │
│     ├── getRecordList() → unknownChars                         │
│     └── calculateCharGroup(unknownChars) → charGroup           │
│                           │                                     │
│                           ▼                                     │
│  2. 构造提示词                                                   │
│     └── buildUserPrompt(params) → inputText (预填充)            │
│                           │                                     │
│                           ▼                                     │
│  3. 用户发送消息                                                 │
│     └── sendToAI(inputText) → wx.cloud.extend.AI.streamText()  │
│                           │                                     │
│                           ▼                                     │
│  4. 流式接收响应                                                 │
│     └── onText(text) → updateMessageContent() → UI 更新         │
│                           │                                     │
│                           ▼                                     │
│  5. 完成响应                                                    │
│     └── onFinish(res) → Markdown 渲染 → 保存对话历史            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Platform Compatibility

| 功能 | 微信小程序 | H5 |
|------|-----------|-----|
| AI 对话 | ✅ wx.cloud.extend.AI | ❌ 显示提示 |
| 流式输出 | ✅ onText 回调 | ❌ |
| Markdown 渲染 | ✅ ua-markdown | ✅ ua-markdown |
| 导航栏 | ✅ 自定义 | ✅ 自定义 |

## ua-markdown 组件说明

### 插件信息
- **插件名称**：UNIAPP MARKDOWN语法渲染及代码高亮
- **插件ID**：13307
- **技术栈**：uniapp + vue3
- **包体积**：92.4KB
- **许可协议**：MIT
- **兼容性**：H5、微信/支付宝/抖音/百度小程序、App

### 安装方式
1. 从 DCloud 插件市场下载：https://ext.dcloud.net.cn/plugin?id=13307
2. 将 `ua-markdown` 组件放入 `src/components/` 目录
3. 组件符合 easycom 规范，无需手动 import，直接使用即可

### API 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| source | String | - | **必填**。需要渲染的 Markdown 内容字符串 |
| showLine | Boolean | true | 是否显示代码块行号，AI 对话场景建议设为 false |

### 使用示例

```vue
<template>
  <view class="ai-bubble">
    <!-- 基础用法 -->
    <ua-markdown :source="markdownContent" />
    
    <!-- 隐藏代码行号 -->
    <ua-markdown :source="markdownContent" :showLine="false" />
  </view>
</template>

<script setup>
import { ref } from 'vue'

const markdownContent = ref(`
### AI 回复示例

这是一段 **加粗** 和 *斜体* 文本。

- 列表项 1
- 列表项 2

\`\`\`javascript
console.log('代码高亮')
\`\`\`
`)
</script>
```

### 支持的 Markdown 语法
- 标题（# ~ ######）
- 加粗（**text**）
- 斜体（*text*）
- 有序/无序列表
- 代码块及语法高亮
- 行内代码
- 链接和图片
- 引用块

### 流式输出注意事项
由于 AI 回复采用流式输出，`source` 属性会频繁更新：
```javascript
// 流式更新时，ua-markdown 会自动重新渲染
const updateMessageContent = (msgId, newContent) => {
  const msg = messages.value.find(m => m.id === msgId)
  if (msg) {
    msg.content = newContent  // ua-markdown 响应式更新
  }
}
```

## Error Handling

```javascript
const errorMessages = {
  NETWORK_ERROR: '网络连接失败，请检查网络后重试',
  API_ERROR: 'AI 服务暂时不可用，请稍后重试',
  RATE_LIMIT: '请求过于频繁，请稍后再试',
  UNKNOWN: '发生未知错误，请重试'
}

const handleError = (error) => {
  const code = error.code || 'UNKNOWN'
  const message = errorMessages[code] || errorMessages.UNKNOWN
  
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}
```

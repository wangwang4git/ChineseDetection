# add-ai-tool-calling 技术设计

## 架构概述

```
┌─────────────────────────────────────────────────────────────┐
│                     ai-assistant.vue                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    sendToAI()                        │    │
│  │  1. 构建 messages 数组                               │    │
│  │  2. 注册 tools 数组（search_web）                    │    │
│  │  3. 调用 wx.cloud.extend.AI.streamText()            │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              CloudBase AI (deepseek-v3.2)                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  模型判断是否需要调用工具                            │    │
│  │  - 需要搜索 → 返回 tool_call                        │    │
│  │  - 不需要 → 直接生成回复                            │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │ (if tool_call)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   aiTools.js - search_web                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  fn: async ({ query }) => {                          │    │
│  │    // 使用 uni.request 调用 Tavily HTTP API        │    │
│  │    const response = await tavilySearch(query)       │    │
│  │    return JSON.stringify(results)                    │    │
│  │  }                                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Tavily Search API                          │
│  POST https://api.tavily.com/search                         │
│  Authorization: Bearer {TAVILY_API_KEY}                     │
└─────────────────────────────────────────────────────────────┘
```

## 工具定义规范

遵循 CloudBase AI 工具调用格式，使用小程序 HTTP 请求调用 Tavily API：

```javascript
/**
 * 调用 Tavily Search API
 * @param {string} query - 搜索关键词
 * @param {string} apiKey - Tavily API Key
 * @returns {Promise<Object>} 搜索结果
 */
function tavilySearch(query, apiKey) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://api.tavily.com/search',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        query: query,
        search_depth: 'basic',
        max_results: 3,
        include_answer: false,
        include_raw_content: false,
        include_images: false
      },
      success: (res) => resolve(res.data),
      fail: (err) => reject(err)
    })
  })
}

const searchWebTool = {
  name: "search_web",
  description: "搜索网络获取最新的教育资讯、学习资源和识字教学方法。当用户询问最新信息、需要外部资源或你不确定的事实时使用此工具。",
  fn: async ({ query }) => {
    // 使用小程序 HTTP 请求调用 Tavily API
    const response = await tavilySearch(query, TAVILY_API_KEY)
    // 提取搜索结果
    const results = response.results?.slice(0, 3).map(r => ({
      title: r.title,
      url: r.url,
      content: r.content
    })) || []
    return JSON.stringify(results)
  },
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "搜索关键词，如'幼儿识字教学方法'、'儿童阅读绘本推荐'"
      }
    },
    required: ["query"]
  }
}
```

## 环境变量配置

### .env 文件新增配置

```bash
# Tavily Search API Key（用于 AI 联网搜索）
VITE_TAVILY_API_KEY=tvly-xxx
```

### env.js 新增导出

```javascript
export const ENV_CONFIG = {
  // ... 现有配置
  TAVILY_API_KEY: getEnvVar('VITE_TAVILY_API_KEY', '')
}
```

## API 调用流程

### 1. 初始化工具

```javascript
import { getSearchWebTool } from '@/utils/aiTools.js'
import { ENV_CONFIG } from '@/config/env.js'

// 获取工具实例（需要 API Key）
const searchWebTool = getSearchWebTool(ENV_CONFIG.TAVILY_API_KEY)
```

### 2. 调用带工具的 AI 接口

```javascript
await wx.cloud.extend.AI.createModel("deepseek").streamText({
  data: {
    model: 'deepseek-v3.2',
    messages: messageHistory,
    tools: [searchWebTool]  // 注册工具
  },
  onText: (text) => { /* 处理文本 */ },
  onFinish: () => { /* 完成处理 */ },
  onError: (error) => { /* 错误处理 */ }
})
```

## 错误处理策略

| 错误场景 | 处理方式 |
|---------|---------|
| Tavily API Key 未配置 | 不注册 search_web 工具，AI 仅使用基础对话能力 |
| Tavily API 调用失败 | 工具返回错误信息，AI 基于错误信息继续回复 |
| 网络超时 | 工具返回超时提示，AI 告知用户搜索失败 |
| API 限流 | 工具返回限流提示，建议用户稍后再试 |

## 安全考虑

1. **API Key 保护**：Tavily API Key 通过环境变量管理，不硬编码在代码中
2. **搜索内容过滤**：Tavily 返回结果限制为 3 条，减少无关信息
3. **请求频率**：依赖 AI 模型的自然调用频率，无额外限制

## 平台兼容性

- **微信小程序**：完整支持工具调用
- **H5**：保持现有降级逻辑，显示"此功能仅支持微信小程序"提示

## 依赖关系

- **无新增 npm 依赖**
- 使用小程序内置 `uni.request` 调用 Tavily HTTP API

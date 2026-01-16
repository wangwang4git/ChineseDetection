# add-ai-tool-calling

## Why

当前 AI 助手页面仅支持基于对话历史的文本生成，无法获取实时信息（如最新教育资讯、学习资源等）。通过集成 Tavily Search API 作为工具调用，可以让 AI 具备联网搜索能力，为家长提供更全面、更及时的识字教育建议和学习资源推荐。

## What Changes

1. **环境变量扩展**：在 `config/env.js` 中新增 Tavily API Key 配置项，通过环境变量管理敏感信息
2. **工具定义模块**：创建 `utils/aiTools.js`，通过小程序 HTTP 请求调用 Tavily Search API
3. **AI 调用重构**：修改 `ai-assistant.vue` 中的 `sendToAI` 函数，集成 CloudBase AI 工具调用机制
4. **规范更新**：更新 ai-assistant 规范，添加工具调用相关需求

## Scope

- **涉及文件**：
  - `src/config/env.js` - 新增环境变量
  - `src/utils/aiTools.js` - 新建工具定义模块
  - `src/pages/ai-assistant/ai-assistant.vue` - 集成工具调用
  - `.env.example` - 添加配置模板
- **涉及规范**：ai-assistant

## Out of Scope

- 其他工具（如天气、计算器等）的集成
- 工具调用结果的缓存机制
- 工具调用的频率限制策略

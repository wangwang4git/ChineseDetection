# ai-assistant Specification Delta

## ADDED Requirements

### Requirement: AI 工具调用能力

AI 助手 SHALL 支持通过工具调用机制获取外部信息，增强回复质量。

#### Scenario: 联网搜索工具注册

- **Given** 系统配置了有效的 Tavily API Key（环境变量 `VITE_TAVILY_API_KEY`）
- **When** 用户发送消息触发 AI 调用
- **Then** 系统 SHALL 在 AI 请求中注册 `search_web` 工具
- **And** 工具定义包含 name、description、parameters 和 fn 执行函数

#### Scenario: 工具调用触发

- **Given** AI 助手已注册 `search_web` 工具
- **And** 用户提问涉及需要外部信息的内容（如"最新的识字教学方法"、"推荐儿童阅读绘本"）
- **When** AI 模型判断需要搜索外部信息
- **Then** 系统 SHALL 调用 `search_web` 工具的 `fn` 函数
- **And** 工具函数调用 Tavily Search API 获取搜索结果
- **And** 搜索结果返回给 AI 模型用于生成最终回复

#### Scenario: 工具调用结果处理

- **Given** `search_web` 工具已执行并返回搜索结果
- **When** AI 模型收到工具返回的结果
- **Then** AI 模型 SHALL 基于搜索结果生成增强的回复内容
- **And** 回复内容整合搜索到的最新信息和专业建议

#### Scenario: API Key 未配置降级

- **Given** 系统未配置 Tavily API Key（环境变量为空）
- **When** 用户发送消息触发 AI 调用
- **Then** 系统 SHALL NOT 注册 `search_web` 工具
- **And** AI 仅使用基础对话能力回复
- **And** 用户体验不受影响

---

### Requirement: Tavily API 集成

系统 SHALL 通过小程序 HTTP 请求调用 Tavily Search API 实现联网搜索功能。

#### Scenario: HTTP 请求调用

- **Given** 系统配置了有效的 Tavily API Key
- **And** `search_web` 工具被调用
- **When** 工具执行函数发起搜索请求
- **Then** 系统 SHALL 使用 `uni.request` 发送 POST 请求到 `https://api.tavily.com/search`
- **And** 请求头包含 `Authorization: Bearer {API_KEY}` 和 `Content-Type: application/json`
- **And** 请求体包含精简参数：`query`、`search_depth: "basic"`、`max_results: 3`、`include_answer: false`、`include_raw_content: false`、`include_images: false`

#### Scenario: 响应处理

- **Given** Tavily API 返回搜索结果
- **When** 工具处理响应数据
- **Then** 系统 SHALL 提取 `response.results` 数组中的搜索结果
- **And** 系统 SHALL 限制返回最多 3 条结果（title、url、content）
- **And** 系统 SHALL 将结果序列化为 JSON 字符串返回给 AI 模型

#### Scenario: API 调用失败处理

- **Given** Tavily API 调用失败（网络错误、超时、限流等）
- **When** 工具执行函数捕获错误
- **Then** 系统 SHALL 返回包含错误信息的 JSON 字符串
- **And** AI 模型基于错误信息告知用户搜索暂时不可用
- **And** AI 模型继续使用已有知识进行回复

---

### Requirement: 环境变量安全配置

Tavily API Key SHALL 通过环境变量管理，不硬编码在代码中。

#### Scenario: 环境变量配置

- **Given** 开发者需要配置 Tavily API Key
- **When** 开发者编辑 `.env` 文件
- **Then** 开发者 SHALL 设置 `VITE_TAVILY_API_KEY` 环境变量
- **And** `src/config/env.js` 的 `ENV_CONFIG.TAVILY_API_KEY` 能正确读取该值

#### Scenario: 配置模板

- **Given** 新开发者克隆项目
- **When** 开发者查看 `.env.example` 文件
- **Then** 文件 SHALL 包含 `VITE_TAVILY_API_KEY=` 配置模板
- **And** 模板注释说明该配置用于 AI 联网搜索功能

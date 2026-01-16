# ai-assistant Specification

## Purpose
TBD - created by archiving change add-ai-assistant-page. Update Purpose after archive.
## Requirements
### Requirement: AI 辅导入口

个人页历史检测记录区域 SHALL 显示 AI 辅导入口按钮。

#### Scenario: 显示 AI 辅导按钮

- **Given** 用户在个人页
- **When** 页面加载完成
- **Then** 系统 SHALL 在历史检测记录标题右侧显示"🤖 AI辅导"按钮
- **And** 按钮样式为紫粉渐变背景（#C27AFF → #FB64B6）
- **And** 按钮为圆角胶囊形状

#### Scenario: 点击 AI 辅导按钮

- **Given** 用户在个人页
- **When** 用户点击"🤖 AI辅导"按钮
- **Then** 系统 SHALL 跳转到 AI 助手页面（`/pages/ai-assistant/ai-assistant`）

---

### Requirement: AI 助手页面布局

AI 助手页面 SHALL 包含顶部导航栏、消息列表和底部输入框。

#### Scenario: 页面基本结构

- **Given** 用户在 AI 助手页
- **When** 页面加载完成
- **Then** 系统 SHALL 显示顶部导航栏，包含返回按钮和"🤖 AI小助手"标题
- **And** 系统 SHALL 显示消息列表区域
- **And** 系统 SHALL 显示底部输入框和发送按钮
- **And** 页面背景为三色渐变（#FCCEE8 → #E9D4FF → #BEDBFF）

#### Scenario: 返回功能

- **Given** 用户在 AI 助手页
- **When** 用户点击返回按钮
- **Then** 系统 SHALL 返回到上一页（个人页）

---

### Requirement: 提示词预填充

进入 AI 助手页时，系统 SHALL 自动构造并预填充用户提示词。

#### Scenario: 自动构造提示词

- **Given** 用户从个人页跳转到 AI 助手页
- **And** 用户已设置年龄信息
- **And** 用户有历史检测记录
- **When** AI 助手页加载完成
- **Then** 系统 SHALL 在底部输入框预填充构造的提示词
- **And** 提示词包含：孩子年龄、年龄阶段、目标认字量、实测认字量、不认识汉字列表、汉字聚集分组

#### Scenario: 提示词数据来源

- **Given** 用户有多条历史检测记录
- **When** 系统构造提示词
- **Then** 实测认字量 SHALL 取所有检测记录的平均值（四舍五入取整）
- **And** 不认识汉字列表 SHALL 合并所有检测记录中的不认识汉字（去重）
- **And** 汉字聚集分组 SHALL 基于合并后的不认识汉字列表进行分析

#### Scenario: 提示词格式

- **Given** 用户年龄为 6 岁
- **And** 目标认字量为 300-500 字
- **And** 实测认字量为 320 字（所有记录平均值）
- **And** 不认识汉字列表为"琴、棋、书、画、剑"（所有记录合并去重）
- **When** 系统构造提示词
- **Then** 提示词格式 SHALL 为：
  ```
  孩子基本信息：6岁，正处于幼小衔接阶段。
  目标认字量：300-500字。
  实测认字量：320字。
  不认识汉字列表：琴、棋、书、画、剑。
  不认识汉字聚集分组：中频常用字。
  ```

---

### Requirement: AI 对话功能

微信小程序环境下，系统 SHALL 支持与 AI 进行对话交互。

#### Scenario: 发送消息

- **Given** 用户在 AI 助手页
- **And** 输入框有内容
- **When** 用户点击发送按钮或按下确认键
- **Then** 系统 SHALL 在消息列表添加用户消息气泡
- **And** 用户消息气泡显示在右侧
- **And** 用户消息气泡为蓝紫渐变背景（#51A2FF → #C27AFF）
- **And** 系统 SHALL 清空输入框
- **And** 系统 SHALL 调用 wx.cloud.extend.AI.streamText() 发送请求

#### Scenario: 接收 AI 回复

- **Given** 用户已发送消息
- **When** AI 开始回复
- **Then** 系统 SHALL 在消息列表添加 AI 消息气泡
- **And** AI 消息气泡显示在左侧
- **And** AI 消息气泡左侧显示 AI 头像（🤖 紫粉渐变圆形）
- **And** AI 消息气泡为紫粉渐变背景（#F3E8FF → #FCE7F3）

---

### Requirement: 流式输出展示

微信小程序环境下，AI 回复 SHALL 以流式方式逐步展示，实现 ChatGPT 风格打字机效果。

#### Scenario: 流式输出效果

- **Given** 用户已发送消息
- **When** AI 开始回复
- **Then** 系统 SHALL 通过 onText 回调逐步更新 AI 消息内容
- **And** 消息内容实时展示，呈现 ChatGPT 风格打字机效果
- **And** 系统 SHALL 显示闪烁光标表示正在输入
- **And** 消息列表自动滚动到最新消息

#### Scenario: 流式输出完成

- **Given** AI 正在流式回复
- **When** 回复完成（onFinish 回调触发）
- **Then** 系统 SHALL 标记消息为完成状态
- **And** 系统 SHALL 隐藏打字机光标
- **And** 系统 SHALL 将对话添加到对话历史

---

### Requirement: Markdown 渲染

AI 回复内容 SHALL 使用 markdown-it + 小程序 rich-text 组件实现 Markdown 格式渲染。

#### Scenario: Markdown 渲染技术方案

- **Given** AI 回复包含 Markdown 格式内容
- **When** 消息需要在小程序中渲染
- **Then** 系统 SHALL 使用 markdown-it 库将 Markdown 转换为 HTML 字符串
- **And** 系统 SHALL 使用小程序原生 rich-text 组件渲染 HTML 内容
- **And** 系统 SHALL 通过 tagStyle 配置实现与设计稿一致的样式

#### Scenario: Markdown 内容渲染

- **Given** AI 回复包含 Markdown 格式内容
- **When** 消息显示在气泡中
- **Then** 系统 SHALL 支持标题（#）、列表（- 或 1.）、加粗（**）、斜体（*）等格式
- **And** 系统 SHALL 支持代码块（```）渲染
- **And** 系统 SHALL 支持引用块（>）、链接等格式
- **And** rich-text 组件设置 user-select 属性允许长按选中文本

#### Scenario: 流式输出打字机效果

- **Given** AI 正在流式回复
- **When** 系统收到增量文本
- **Then** 系统 SHALL 实时将累积的 Markdown 内容转换为 HTML
- **And** 系统 SHALL 使用 rich-text 组件实时渲染更新的 HTML 内容
- **And** 系统 SHALL 在内容末尾显示闪烁的光标（|）表示正在输入
- **And** 回复完成后光标消失

---

### Requirement: System Prompt 配置

AI 对话 SHALL 使用预设的教育专家角色提示词。

#### Scenario: System Prompt 来源

- **Given** 用户发送消息触发 AI 调用
- **When** 系统构造 AI 请求
- **Then** 系统 SHALL 将"幼儿及青少年识字教育专家.md"内容作为 system 角色消息
- **And** 系统 SHALL 使用 deepseek-v3.2 模型

---

### Requirement: 错误处理

系统 SHALL 对 AI 调用失败进行友好处理。

#### Scenario: 网络错误

- **Given** 用户发送消息
- **When** 网络连接失败
- **Then** 系统 SHALL 在 AI 消息气泡显示"网络连接失败，请检查网络后重试"
- **And** 系统 SHALL 提供重试选项

#### Scenario: API 调用失败

- **Given** 用户发送消息
- **When** AI 服务返回错误
- **Then** 系统 SHALL 在 AI 消息气泡显示"AI 服务暂时不可用，请稍后重试"

---

### Requirement: 平台兼容

系统 SHALL 处理不同平台的兼容性。

#### Scenario: H5 平台降级

- **Given** 用户在 H5 环境使用 AI 助手
- **When** 用户尝试发送消息
- **Then** 系统 SHALL 显示"此功能仅支持微信小程序"提示
- **And** 系统 SHALL NOT 调用 AI 接口

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


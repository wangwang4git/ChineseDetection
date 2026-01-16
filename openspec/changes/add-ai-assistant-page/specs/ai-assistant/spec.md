# Spec: ai-assistant

AI 助手功能规格说明，包含对话交互、流式输出和 Markdown 渲染能力。

---

## ADDED Requirements

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

AI 回复内容 SHALL 使用基于 mp-html 的 ua-markdown 组件支持 Markdown 格式渲染。

#### Scenario: Markdown 内容渲染

- **Given** AI 回复包含 Markdown 格式内容
- **When** 消息显示在气泡中
- **Then** 系统 SHALL 使用 ua-markdown 组件（基于 mp-html）渲染 Markdown
- **And** 支持标题（#）、列表（- 或 1.）、加粗（**）、斜体（*）等格式
- **And** 支持代码块（```）渲染
- **And** 支持引用块（>）、链接、图片等格式
- **And** 组件允许长按选中文本内容

#### Scenario: 打字机效果

- **Given** AI 正在流式回复
- **When** 系统收到增量文本
- **Then** 系统 SHALL 实时更新 displayContent 显示内容
- **And** 系统 SHALL 显示闪烁的光标（|）表示正在输入
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

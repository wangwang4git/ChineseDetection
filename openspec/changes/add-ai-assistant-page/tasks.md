# Tasks: add-ai-assistant-page

## Phase 1: 个人页 UI 更新

- [x] **T1.1** 更新 `profile.vue` 历史检测记录区域
  - 在 `.section-title` 右侧添加"🤖 AI辅导"按钮
  - 样式：紫色渐变背景，圆角胶囊，白色文字
  - 点击事件：跳转到 `/pages/ai-assistant/ai-assistant`
  - 验证：按钮显示正确，点击可跳转

- [x] **T1.2** 注册 AI 助手页面路由
  - 在 `pages.json` 添加 `pages/ai-assistant/ai-assistant` 路由
  - 配置页面标题隐藏（自定义导航栏）
  - 验证：路由配置正确

## Phase 2: AI 助手页面基础框架

- [x] **T2.1** 创建 AI 助手页面基础结构
  - 创建 `src/pages/ai-assistant/ai-assistant.vue`
  - 实现页面布局：顶部导航栏 + 消息列表 + 底部输入框
  - 样式参考 Figma 设计稿
  - 验证：页面渲染正确

- [x] **T2.2** 实现顶部导航栏
  - 返回按钮（← 返回）
  - 标题（🤖 AI小助手）
  - 样式：白色半透明背景，紫色边框
  - 验证：返回功能正常

- [x] **T2.3** 实现消息列表组件
  - AI 消息气泡（左侧，紫粉渐变背景）
  - 用户消息气泡（右侧，蓝紫渐变背景）
  - 时间戳显示
  - 滚动到最新消息
  - 验证：消息展示正确

- [x] **T2.4** 实现底部输入框
  - 输入框样式：圆角胶囊，灰色背景
  - 发送按钮：紫粉渐变圆形
  - 输入内容双向绑定
  - 验证：输入和发送功能正常

## Phase 3: 提示词构造

- [x] **T3.1** 创建提示词构造工具函数
  - 创建 `src/utils/aiPrompt.js`
  - 实现 `getSystemPrompt()`: 返回"幼儿及青少年识字教育专家"角色设定
  - 实现 `buildUserPrompt(params)`: 构造用户提示词
  - 验证：提示词格式正确

- [x] **T3.2** 实现用户数据获取（基于所有检测记录）
  - 获取用户年龄（userManager）
  - 获取目标认字量（levelConfig）
  - **实测认字量**：取所有检测记录的平均值（四舍五入取整）
  - **不认识汉字列表**：合并所有检测记录中的不认识汉字（去重）
  - **汉字聚集分组**：基于合并后的不认识汉字列表分析（analyzeCharGroup）
  - 验证：数据获取正确

- [x] **T3.3** 页面加载时预填充提示词
  - 进入页面时自动构造 user prompt
  - 在输入框中预填充提示词内容
  - 验证：预填充显示正确

## Phase 4: 微信云开发 AI 接口集成

- [x] **T4.1** 集成 wx.cloud.extend.AI
  - 条件编译处理平台差异（#ifdef MP-WEIXIN）
  - 实现 `sendToAI()` 函数调用 `streamText()`
  - 配置 model: 'hunyuan-lite'
  - 验证：API 调用成功

- [x] **T4.2** 实现流式输出展示
  - 使用 onText 回调逐字显示 AI 回复
  - 实现打字机效果
  - 处理 onFinish 完成回调
  - 验证：流式输出效果正常

- [x] **T4.3** 错误处理
  - 处理网络错误、API 调用失败
  - 显示友好错误提示
  - handleAIError 函数实现
  - 验证：错误处理正确

## Phase 5: Markdown 渲染

- [x] **T5.1** 安装并配置 mp-html 组件
  - 通过 npm 安装 mp-html：`npm install mp-html`
  - 创建 `src/components/ua-markdown/ua-markdown.vue` 封装组件
  - 组件基于 mp-html 实现 Markdown 渲染
  - 验证：组件目录结构正确

- [x] **T5.2** 实现 ua-markdown 组件
  - 将 Markdown 转换为 HTML（自定义解析器）
  - 使用 mp-html 组件渲染 HTML 内容
  - 配置 tag-style 实现样式定制
  - 支持标题、列表、加粗、斜体、代码块、引用、链接等格式
  - 验证：Markdown 渲染正确

- [x] **T5.3** 实现 ChatGPT 打字机效果
  - 添加 displayContent 字段用于显示内容
  - 添加 isTyping 字段标记打字状态
  - 流式更新时直接更新 displayContent
  - 显示闪烁光标（|）表示正在输入
  - 回复完成后隐藏光标
  - 验证：打字机效果正常

## Phase 6: H5 兼容处理

- [x] **T6.1** H5 平台降级处理
  - H5 环境显示"此功能仅支持微信小程序"提示弹窗
  - 条件编译区分平台（#ifdef H5）
  - 验证：H5 环境不崩溃

## Validation Checklist
- [x] 个人页 AI 辅导按钮显示正确
- [x] 点击跳转到 AI 助手页
- [x] AI 助手页 UI 与设计稿一致
- [x] 预填充提示词正确
- [x] 发送消息后 AI 流式回复正常
- [x] Markdown 内容渲染正确
- [x] 返回功能正常
- [x] 无 linter 错误

# Proposal: add-ai-assistant-page

## Summary
新增 AI 助手页面，支持用户与微信云开发 AI LLM 进行对话交互，提供个性化识字辅导建议。

## Problem Statement
当前应用缺少 AI 辅导功能，用户在完成检测后无法获得针对性的识字学习建议。需要新增 AI 助手页，基于用户的年龄、目标认字量、实测认字量及不认识汉字列表，提供个性化辅导。

## Goals
1. 在个人页历史检测记录区域右侧添加"AI 辅导"按钮
2. 创建 AI 助手页面，支持对话式交互
3. 集成微信云开发 AI LLM 接口（wx.cloud.extend.AI）
4. 支持流式输出展示和 Markdown 渲染
5. 自动构造基于用户数据的提示词

## Non-Goals
- 不涉及后端云函数开发
- 不涉及用户付费或会员功能
- 不涉及对话历史持久化存储

## Technical Approach

### 1. 个人页 UI 更新
- 在历史检测记录标题行右侧添加"🤖 AI辅导"按钮
- 按钮样式：紫色渐变背景（#C27AFF → #FB64B6），圆角胶囊形状
- 点击跳转到 AI 助手页

### 2. AI 助手页面实现
- 新建 `src/pages/ai-assistant/ai-assistant.vue`
- 页面结构：顶部导航栏 + 消息列表 + 底部输入框
- 消息气泡样式区分 AI 消息（左侧紫粉渐变）和用户消息（右侧蓝紫渐变）

### 3. 微信云开发 AI 接口集成
- 使用 `wx.cloud.extend.AI.streamText()` 实现流式对话
- System Prompt 使用"幼儿及青少年识字教育专家.md"内容
- User Prompt 自动构造，包含：孩子年龄、目标认字量、实测认字量、不认识汉字列表、聚集分组

### 4. Markdown 渲染
- 使用 `ua-markdown` 组件渲染 AI 回复中的 Markdown 内容
- 插件来源：DCloud 插件市场（ID: 13307）
- 支持 H5、微信小程序等多端
- 符合 easycom 规范，无需手动引入

### 5. 提示词构造逻辑
- 从 userManager 获取用户年龄
- 从 levelConfig 获取目标认字量
- 从历史检测记录获取最新的不认识汉字列表
- 使用 calculate.js 中的逻辑进行聚集分组

## UI Design Reference
- 参考 Figma 设计稿 `127_70`
- 页面背景：三色渐变（#FCCEE8 → #E9D4FF → #BEDBFF）
- AI 头像：紫粉渐变圆形 🤖
- 输入框：灰色背景圆角胶囊，右侧发送按钮

## Dependencies
- 微信云开发 AI 能力（wx.cloud.extend.AI）
- ua-markdown 组件（Markdown 渲染，DCloud 插件 ID: 13307）

## Risks and Mitigations
| 风险 | 缓解措施 |
|------|----------|
| AI 接口调用失败 | 显示友好错误提示，支持重试 |
| 流式输出兼容性 | 使用条件编译处理 H5/小程序差异 |
| Markdown 渲染性能 | 使用轻量级组件，优化长文本渲染 |

## Success Metrics
- AI 辅导按钮点击率
- AI 对话完成率
- 用户满意度反馈

## Timeline
- Phase 1: 个人页 UI 更新 + AI 助手页基础框架
- Phase 2: AI 接口集成 + 流式输出
- Phase 3: Markdown 渲染 + 提示词构造

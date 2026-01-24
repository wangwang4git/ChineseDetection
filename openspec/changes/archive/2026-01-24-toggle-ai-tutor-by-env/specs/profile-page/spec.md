# 个人页 AI 辅导入口环境控制

## ADDED Requirements

### Requirement: AI 辅导入口环境控制

个人页 AI 辅导入口 SHALL 根据运行环境决定是否显示。

#### Scenario: development 环境显示 AI 辅导入口

- **Given**: 应用运行在 development 环境（NODE_ENV=development）
- **When**: 用户进入个人页
- **Then**: 显示 AI 辅导按钮（🤖 AI辅导）
- **And**: 按钮位于历史记录标题右侧

#### Scenario: production 环境隐藏 AI 辅导入口

- **Given**: 应用运行在 production 环境（NODE_ENV=production）
- **When**: 用户进入个人页
- **Then**: 不显示 AI 辅导按钮
- **And**: 历史记录标题右侧无按钮

#### Scenario: 点击 AI 辅导入口跳转

- **Given**: 应用运行在 development 环境
- **And**: 用户在个人页看到 AI 辅导按钮
- **When**: 用户点击 AI 辅导按钮
- **Then**: 跳转到 AI 助手页面 `/pages/ai-assistant/ai-assistant`

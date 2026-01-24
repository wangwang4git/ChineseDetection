# profile-page Specification

## Purpose
TBD - created by archiving change add-vocabulary-notebook. Update Purpose after archive.
## Requirements
### Requirement: 生字本入口

个人页 SHALL 增加生字本功能入口。

#### Scenario: 显示生字本入口卡片

- **Given**: 用户生字本中有 27 个待学习汉字
- **When**: 用户进入个人页
- **Then**: 在历史记录列表下方显示生字本入口卡片
- **And**: 卡片采用白色半透明背景，圆角矩形，蓝色边框
- **And**: 左侧显示渐变圆形图标和"生字本"文字
- **And**: 右侧显示蓝色渐变胶囊按钮，内含生字数量 27

#### Scenario: 点击生字本入口

- **Given**: 用户在个人页
- **When**: 用户点击生字本入口卡片
- **Then**: 跳转到生字本页面 `/pages/vocabulary-notebook/vocabulary-notebook`

#### Scenario: 生字本为空时显示

- **Given**: 用户生字本为空
- **When**: 用户进入个人页
- **Then**: 生字本入口显示数字 0

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


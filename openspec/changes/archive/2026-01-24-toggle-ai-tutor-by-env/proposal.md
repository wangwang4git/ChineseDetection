# 基于环境变量控制 AI 辅导入口显示

## Why

当前个人页的 AI 辅导入口在所有环境下都会显示。由于 AI 辅导功能尚在开发测试阶段，需要根据运行环境（development/production）来决定是否展示该入口：
- **development 环境**：显示 AI 辅导入口，供开发测试使用
- **production 环境**：隐藏 AI 辅导入口，待功能成熟后再开放给用户

## What Changes

1. **个人页 (profile.vue)**：根据 `ENV_CONFIG.IS_DEV` 环境变量控制 AI 辅导按钮的显示/隐藏
2. **利用现有环境配置**：复用 `config/env.js` 中已有的 `IS_DEV` 配置，无需新增环境变量

## Scope

- 仅影响个人页 AI 辅导入口的可见性
- 不影响 AI 助手页面本身的功能
- 不影响其他页面或组件

# 环境变量配置说明

## 📋 概述

本项目使用环境变量来管理敏感配置信息，确保敏感数据不会被提交到 git 仓库。通过 Vite 的环境变量系统和编译时注入，实现跨平台的环境变量支持。

## 🔧 配置步骤

### 1. 复制环境变量模板
```bash
cp .env.example .env
```

### 2. 编辑 .env 文件
```bash
# 微信云开发环境 ID（必填）
VITE_WX_CLOUD_ENV=your-actual-cloud-env-id

# API 基础 URL（可选）
VITE_API_BASE_URL=https://your-api-domain.com

# 应用版本（可选）
VITE_APP_VERSION=1.0.0

# Tavily Search API Key（可选，用于 AI 联网搜索功能）
VITE_TAVILY_API_KEY=tvly-xxx
```

### 3. 获取微信云开发环境 ID
1. 登录 [微信云开发控制台](https://console.cloud.tencent.com/tcb)
2. 选择你的云开发环境
3. 在概览页面复制环境 ID

### 4. 获取 Tavily API Key（可选）
AI 助手的联网搜索功能需要 Tavily API Key：
1. 访问 [Tavily 官网](https://tavily.com/) 注册账号
2. 在控制台创建 API Key
3. 将 Key 填入 `.env` 文件的 `VITE_TAVILY_API_KEY` 字段
4. 未配置时 AI 助手仍可正常使用，仅联网搜索功能不可用

## 📁 相关文件

| 文件 | 说明 | 是否提交到 git |
|------|------|----------------|
| `.env.example` | 环境变量模板 | ✅ 提交 |
| `.env` | 实际环境变量配置 | ❌ 不提交 |
| `src/config/env.js` | 环境变量读取逻辑 | ✅ 提交 |
| `src/types/env.d.ts` | TypeScript 类型声明 | ✅ 提交 |
| `vite.config.js` | Vite 配置（环境变量注入） | ✅ 提交 |

## 🔒 安全说明

- `.env` 文件已添加到 `.gitignore`，不会被提交到仓库
- 敏感信息通过环境变量注入，避免硬编码
- 开发环境会打印环境配置信息，生产环境不会
- 只有以 `VITE_` 开头的变量会被暴露到前端代码

## 🚀 使用方式

### 在代码中使用
```javascript
import { getCloudEnv, ENV_CONFIG } from '@/config/env.js'

// 获取云开发环境 ID
const cloudEnv = getCloudEnv()

// 获取其他配置
const apiUrl = ENV_CONFIG.API_BASE_URL
const appVersion = ENV_CONFIG.APP_VERSION
```

### 添加新的环境变量
1. 在 `.env.example` 中添加变量说明（以 `VITE_` 开头）
2. 在 `.env` 中添加实际值
3. 在 `vite.config.js` 的 `define.__ENV__` 中添加变量
4. 在 `src/config/env.js` 中添加读取逻辑
5. 在 `src/types/env.d.ts` 中添加类型声明

## 🔄 跨平台支持

### H5 环境
- 直接使用 `import.meta.env` 获取 Vite 环境变量
- 支持热重载，修改 `.env` 后自动更新

### 微信小程序 / App 环境
- 使用编译时注入的全局变量 `__ENV__`
- 通过 Vite 的 `define` 配置将环境变量注入到代码中
- 兼容小程序不支持 `process.env` 的限制

## 🛠️ 技术实现

### 环境变量加载优先级
1. **H5**: `import.meta.env` (Vite 原生支持)
2. **小程序/App**: `__ENV__` (编译时注入) → `process.env` (兜底) → 默认值

### 编译时注入
```javascript
// vite.config.js
define: {
  __ENV__: JSON.stringify({
    VITE_WX_CLOUD_ENV: env.VITE_WX_CLOUD_ENV,
    VITE_API_BASE_URL: env.VITE_API_BASE_URL,
    VITE_APP_VERSION: env.VITE_APP_VERSION,
    VITE_TAVILY_API_KEY: env.VITE_TAVILY_API_KEY,
    NODE_ENV: mode
  })
}
```

## ⚠️ 注意事项

- 环境变量名必须以 `VITE_` 开头才能在前端访问
- 修改 `.env` 文件后需要重启开发服务器
- 团队成员需要各自配置自己的 `.env` 文件
- 生产环境部署时需要配置相应的环境变量
- 不要在 `.env` 文件中存储真正的生产环境密钥

## 🐛 调试

开发环境下会打印环境变量加载信息：
```
📦 Loaded environment variables: ['VITE_WX_CLOUD_ENV', 'VITE_API_BASE_URL', ...]
🔧 ENV[VITE_WX_CLOUD_ENV]: cloud-XXXX
🌍 Environment Config: { WX_CLOUD_ENV: 'cloud-XXXX', ... }
```
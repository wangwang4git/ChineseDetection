# 设计文档

## 1. 技术方案

### 1.1 环境判断逻辑

复用现有的 `config/env.js` 中的 `ENV_CONFIG.IS_DEV` 配置：

```javascript
// config/env.js 已有配置
export const ENV_CONFIG = {
  // ...
  IS_DEV: getEnvVar('NODE_ENV', 'development') === 'development'
}
```

### 1.2 显示逻辑

| 环境 | IS_DEV 值 | AI 辅导入口 |
|------|-----------|-------------|
| development | true | 显示 |
| production | false | 隐藏 |

## 2. 实现方式

### 2.1 profile.vue 修改

```vue
<script setup>
import { ENV_CONFIG } from '@/config/env.js'

// 是否显示 AI 辅导入口（仅 development 环境显示）
const showAiTutor = computed(() => ENV_CONFIG.IS_DEV)
</script>

<template>
  <!-- AI 辅导按钮 - 仅 development 环境显示 -->
  <view v-if="showAiTutor" class="ai-tutor-btn" @tap="goToAiAssistant">
    <text class="ai-tutor-text">🤖 AI辅导</text>
  </view>
</template>
```

## 3. 兼容性考虑

### 3.1 跨平台环境变量读取

根据 project.md 说明，环境变量在不同平台的读取方式：
- **H5 环境**: 使用 `import.meta.env`
- **小程序环境**: 使用编译时注入的 `__ENV__` 全局变量

`config/env.js` 已封装了跨平台兼容逻辑，直接使用 `ENV_CONFIG.IS_DEV` 即可。

### 3.2 条件编译

本功能不需要使用 `#ifdef` 条件编译，因为环境判断逻辑在运行时完成，与平台无关。

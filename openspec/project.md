# 汉字认字量检测小程序 项目概述

基于 uni-app 框架的跨平台汉字认字量检测应用，采用分层频率抽样测试策略，通过 175 个测试汉字精准估算儿童识字量（0-2500字范围）。

## 技术栈

- **框架**: uni-app 3.0 (DCloudio)
- **前端**: Vue 3.4 Composition API
- **构建工具**: Vite 5.2
- **国际化**: vue-i18n 9.1
- **包管理器**: npm
- **样式**: SCSS + rpx 响应式单位

## 项目结构

```
src/
├── App.vue                    # 应用入口组件
├── main.js                    # 应用入口文件
├── manifest.json              # 应用配置（appid、权限等）
├── pages.json                 # 页面路由和 TabBar 配置
├── uni.scss                   # 全局样式变量
├── api/                       # API 接口模块
│   ├── index.js               # API 入口和响应格式
│   ├── character.js           # 汉字数据接口
│   └── record.js              # 检测记录接口
├── components/                # 公共组件
│   ├── RiceGrid.vue           # 米字格汉字展示组件
│   ├── CharacterCard.vue      # 汉字卡片组件
│   └── GradientButton.vue     # 渐变按钮组件
├── pages/                     # 页面目录
│   ├── home/home.vue          # 首页（开始检测入口）
│   ├── test/test.vue          # 检测页（分层测试流程）
│   ├── result/result.vue      # 结果页（认字量展示）
│   ├── profile/profile.vue    # 个人页（历史记录）
│   └── history-detail/        # 历史详情页
├── static/                    # 静态资源
│   ├── icons/                 # TabBar 图标
│   └── top_2500_chars_with_literacy.json  # 汉字数据（2500字）
├── styles/                    # 样式文件
│   ├── variables.scss         # 颜色、字体变量
│   └── common.scss            # 公共样式类
└── utils/                     # 工具函数
    ├── index.js               # 工具入口
    ├── levelConfig.js         # 分层配置常量
    ├── calculate.js           # 认字量计算、熔断检测
    └── storage.js             # 本地存储工具
```

## 核心概念

### 分层频率抽样测试

基于汉字使用频率将 2500 个常用汉字分为 6 个层级：

| 层级 | 字频排名 | 描述 | 抽样间隔 | 测试字数 | 权重 |
|------|---------|------|---------|---------|------|
| L1 | 1-50 | 绝对核心字 | 1抽1 | 50字 | ×1 |
| L2 | 51-200 | 高频基础字 | 3抽1 | 50字 | ×3 |
| L3 | 201-500 | 中频常用字 | 10抽1 | 30字 | ×10 |
| L4 | 501-1000 | 次常用字 | 20抽1 | 25字 | ×20 |
| L5 | 1001-1500 | 低频拓展字 | 50抽1 | 10字 | ×50 |
| L6 | 1501-2500 | 生僻/书面字 | 100抽1 | 10字 | ×100 |

### 认字量计算公式

$$W = N_{L1} + (N_{L2} \times 3) + (N_{L3} \times 10) + (N_{L4} \times 20) + (N_{L5} \times 50) + (N_{L6} \times 100)$$

其中 $N_{Lx}$ 为第 $x$ 层级认识的字数。

### 动态熔断机制

- **连续不认识熔断**: 任意层级连续 5 个字不认识
- **错误率熔断**: 任意层级错误率超过 80%
- **处理**: 假设剩余未测字及后续层级都不认识（计 0 分）

## 编码约定

### 命名约定

- 页面文件使用小写: `home.vue`, `test.vue`
- 组件使用 PascalCase: `RiceGrid.vue`, `CharacterCard.vue`
- 样式类名使用 kebab-case: `.page-container`, `.action-btn`
- 工具函数使用 camelCase: `calculateVocabulary`, `checkFuse`
- 常量使用 UPPER_SNAKE_CASE: `LEVEL_CONFIGS`, `FUSE_CONFIG`

### 代码组织

- 每个页面放在 `pages/[page-name]/` 目录下
- 公共组件放在 `components/` 目录
- API 接口放在 `api/` 目录
- 工具函数放在 `utils/` 目录
- 静态资源放在 `static/` 目录

### Vue 组件结构

使用 Vue 3 Composition API (`<script setup>`)：

```vue
<template>
  <!-- 模板 -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

// 响应式状态
const data = ref([])

// 计算属性
const computed = computed(() => {})

// 生命周期
onMounted(() => {})
onLoad((options) => {})
</script>

<style scoped>
/* 样式 */
</style>
```

### API 响应格式

所有 API 返回统一格式：

```javascript
{
  errCode: 0,        // 0 表示成功，非 0 表示错误
  errMsg: 'success', // 错误信息
  data: {}           // 业务数据
}
```

## 支持平台

- **H5**: `npm run dev:h5` / `npm run build:h5`
- **微信小程序**: `npm run dev:mp-weixin` / `npm run build:mp-weixin`
- **支付宝小程序**: `npm run dev:mp-alipay`
- **百度小程序**: `npm run dev:mp-baidu`
- **字节跳动小程序**: `npm run dev:mp-toutiao`
- **QQ 小程序**: `npm run dev:mp-qq`

## 开发工作流

```bash
# 安装依赖
npm install

# H5 开发模式
npm run dev:h5

# 微信小程序开发（需要微信开发者工具）
npm run dev:mp-weixin

# H5 生产构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin
```

## 数据存储

使用 uni-app 本地存储 API：

- `uni.setStorageSync` / `uni.getStorageSync` - 同步存储
- 存储键: `TEST_RECORDS` - 检测记录列表

## 页面流程

```
首页 (home)
    │
    ├── 点击"开始检测"
    │
    ▼
检测页 (test)
    │
    ├── 分层测试 L1-L6（共 175 字）
    ├── 动态熔断检测
    │
    ▼
结果页 (result)
    │
    ├── 显示认字量
    ├── 保存记录
    │
    ▼
首页 (home)

个人页 (profile)
    │
    ├── 点击历史记录
    │
    ▼
历史详情页 (history-detail)
```

## 重要约束

- 使用 uni-app API 而非原生 Web API 以保证跨平台兼容
- 样式尺寸使用 `rpx` 单位实现响应式
- 图片等静态资源放在 `static/` 目录
- 页面生命周期使用 uni-app 提供的钩子（`onLoad`、`onShow` 从 `@dcloudio/uni-app` 导入）
- JSON 数据使用静态 `import` 导入，不使用动态 `require`
- 所有汉字数据来源于 `top_2500_chars_with_literacy.json`

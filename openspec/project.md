# 汉字认字量检测小程序 项目概述

基于 uni-app 框架结合微信云开发的跨平台汉字认字量检测应用，专为幼儿园及小学低年级儿童（1-15岁）设计。采用科学的分层频率抽样测试策略，通过最多 175 个测试汉字精准估算儿童识字量（0-2500字范围），为家长和老师提供准确的识字水平评估。

## 技术栈

### 前端技术栈
- **框架**: uni-app 3.0 (DCloudio)
- **前端**: Vue 3.4 Composition API
- **构建工具**: Vite 5.2.8
- **国际化**: vue-i18n 9.1.9
- **包管理器**: npm
- **样式**: SCSS + rpx 响应式单位
- **类型支持**: TypeScript (部分支持)

### 后端技术栈
- **云开发平台**: 微信云开发
- **云函数**: Node.js + wx-server-sdk
- **数据库**: 云数据库 (MongoDB)
- **存储**: 云存储
- **用户认证**: 微信小程序授权

### 环境配置
- **环境变量管理**: .env 文件 + Vite 编译时注入
- **跨平台兼容**: H5 使用 import.meta.env，小程序使用 __ENV__ 全局变量
- **安全配置**: 敏感信息通过环境变量管理，不提交到 Git

## 项目结构

```
src/
├── App.vue                    # 应用入口组件（云开发初始化）
├── main.js                    # 应用入口文件
├── manifest.json              # 应用配置（appid、权限等）
├── pages.json                 # 页面路由和 TabBar 配置
├── uni.scss                   # 全局样式变量
├── api/                       # API 接口模块
│   ├── index.js               # API 入口和响应格式
│   ├── character.js           # 汉字数据接口
│   ├── record.js              # 检测记录接口
│   └── user.js                # 用户信息接口
├── cloudfunctions/            # 云函数目录
│   └── baseFunctions/         # 基础云函数
│       ├── index.js           # 云函数入口文件
│       ├── package.json       # 依赖配置
│       └── config.json        # 云函数配置
├── components/                # 公共组件
│   ├── RiceGrid.vue           # 米字格汉字展示组件
│   ├── CharacterCard.vue      # 汉字卡片组件
│   ├── CustomTabBar.vue       # 自定义 TabBar 组件
│   └── GradientButton.vue     # 渐变按钮组件
├── config/                    # 配置文件
│   └── env.js                 # 环境变量配置管理
├── pages/                     # 页面目录
│   ├── home/home.vue          # 首页（开始检测入口）
│   ├── test/test.vue          # 检测页（分层测试流程）
│   ├── result/result.vue      # 结果页（认字量展示）
│   ├── profile/profile.vue    # 个人页（用户信息、历史记录）
│   ├── history-detail/        # 历史详情页
│   └── ai-assistant/          # AI 助手页（智能对话辅导）
├── static/                    # 静态资源
│   ├── icons/                 # TabBar 图标
│   ├── images/                # 应用图片资源
│   └── top_2500_chars_with_literacy.json  # 汉字数据（2500字）
├── styles/                    # 样式文件
│   ├── variables.scss         # 颜色、字体变量
│   └── common.scss            # 公共样式类
├── types/                     # TypeScript 类型定义
│   └── env.d.ts               # 环境变量类型定义
└── utils/                     # 工具函数
    ├── index.js               # 工具入口（时间格式化等）
    ├── levelConfig.js         # 分层配置常量
    ├── calculate.js           # 认字量计算、熔断检测、随机抽样
    ├── storage.js             # 本地存储工具
    ├── userManager.js         # 用户信息管理器
    ├── share.js               # 微信分享配置
    ├── aiPrompt.js            # AI 提示词构造工具
    └── aiTools.js             # AI 工具定义模块（联网搜索）
```

## 核心概念

### 分层频率抽样测试

基于汉字使用频率将 2500 个常用汉字分为 6 个层级：

| 层级 | 字频排名 | 描述 | 抽样方式 | 测试字数 | 权重 |
|------|---------|------|---------|---------|------|
| L1 | 1-50 | 绝对核心字 | 全测+随机打乱 | 50字 | ×1 |
| L2 | 51-200 | 高频基础字 | 随机抽样 | 50字 | ×3 |
| L3 | 201-500 | 中频常用字 | 随机抽样 | 30字 | ×10 |
| L4 | 501-1000 | 次常用字 | 随机抽样 | 25字 | ×20 |
| L5 | 1001-1500 | 低频拓展字 | 随机抽样 | 10字 | ×50 |
| L6 | 1501-2500 | 生僻/书面字 | 随机抽样 | 10字 | ×100 |

**随机策略**：
- L1层：全部50字随机打乱顺序（Fisher-Yates洗牌算法）
- L2-L6层：从层级汉字中随机抽取指定数量（每次测试抽取不同汉字）

### 认字量计算公式

$$W = N_{L1} + (N_{L2} \times 3) + (N_{L3} \times 10) + (N_{L4} \times 20) + (N_{L5} \times 50) + (N_{L6} \times 100)$$

其中 $N_{Lx}$ 为第 $x$ 层级认识的字数。

### 动态熔断机制

- **连续不认识熔断**: 任意层级连续 5 个字不认识
- **错误率熔断**: 任意层级错误率超过 80%
- **处理**: 假设剩余未测字及后续层级都不认识（计 0 分）

### 用户信息管理

用户信息数据结构（UserInfo）：
- `openid`: 微信 OpenID（用户唯一标识）
- `nickname`: 用户昵称（可编辑）
- `avatar`: 头像 URL 或 emoji（可编辑）
- `age`: 用户年龄（1-15岁，0表示未设置）
- `hasAuthorized`: 是否已授权
- `lastUpdated`: 最后更新时间戳
- `source`: 数据来源（wechat/default）

## 已实现的规范

项目已实现以下功能规范（详见 `openspec/specs/`）：

| 规范 | 需求数 | 说明 |
|------|--------|------|
| api | 11 | API 接口规范（统一响应格式、云函数接口） |
| components | 5 | 公共组件规范（米字格、汉字卡片、TabBar等） |
| pages | 5 | 页面规范（首页、检测页、结果页、个人页、历史详情页） |
| profile-page-update | 4 | 个人页更新规范（用户信息展示、编辑） |
| share-capability | 7 | 微信分享功能规范 |
| storage-extension | 5 | 本地存储扩展规范 |
| user-age-capability | 6 | 用户年龄功能规范 |
| user-management | 5 | 用户信息管理规范（OpenID、头像、昵称） |
| ai-assistant | 12 | AI 助手规范（智能对话、工具调用、联网搜索） |
| character-pronunciation | 6 | 汉字发音功能规范 |
| word-examples | 6 | 组词示例功能规范 |

## 编码约定

### 命名约定

- 页面文件使用小写: `home.vue`, `test.vue`
- 组件使用 PascalCase: `RiceGrid.vue`, `CharacterCard.vue`, `CustomTabBar.vue`
- 样式类名使用 kebab-case: `.page-container`, `.action-btn`
- 工具函数使用 camelCase: `calculateVocabulary`, `checkFuse`, `shuffleArray`
- 常量使用 UPPER_SNAKE_CASE: `LEVEL_CONFIGS`, `FUSE_CONFIG`, `ENV_CONFIG`
- 云函数使用 camelCase: `baseFunctions`, `getOpenId`
- 环境变量使用 UPPER_SNAKE_CASE 前缀: `VITE_WX_CLOUD_ENV`

### 代码组织

- 每个页面放在 `pages/[page-name]/` 目录下
- 公共组件放在 `components/` 目录
- API 接口放在 `api/` 目录
- 云函数放在 `cloudfunctions/` 目录
- 配置文件放在 `config/` 目录
- 工具函数放在 `utils/` 目录
- 静态资源放在 `static/` 目录
- 类型定义放在 `types/` 目录

### Vue 组件结构

使用 Vue 3 Composition API (`<script setup>`)：

```vue
<template>
  <!-- 模板 -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
// #ifdef MP-WEIXIN
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
// #endif

// 响应式状态
const data = ref([])

// 计算属性
const computedValue = computed(() => {})

// 生命周期
onMounted(() => {})
onLoad((options) => {})

// 微信分享（条件编译）
// #ifdef MP-WEIXIN
onShareAppMessage(() => ({ title: '', path: '' }))
// #endif
</script>

<style scoped>
/* 样式 */
</style>
```

### 条件编译

使用 uni-app 条件编译处理平台差异：

```javascript
// #ifdef MP-WEIXIN
// 仅微信小程序执行的代码
// #endif

// #ifdef H5
// 仅 H5 执行的代码
// #endif
```

### API 响应格式

#### 统一响应格式

所有 API 返回统一格式：

```javascript
{
  errCode: 0,        // 0 表示成功，非 0 表示错误
  errMsg: 'success', // 错误信息
  data: {}           // 业务数据
}
```

#### 云函数 API

微信云开发 baseFunctions 云函数提供以下接口：

```javascript
// 获取用户 OpenID
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { type: 'getOpenId' }
})

// 创建数据集合
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { type: 'createCollection' }
})

// 查询记录
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { type: 'selectRecord' }
})

// 新增记录
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { 
    type: 'insertRecord',
    data: { /* 记录数据 */ }
  }
})

// 更新记录
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { 
    type: 'updateRecord',
    data: [/* 更新数据数组 */]
  }
})

// 删除记录
wx.cloud.callFunction({
  name: 'baseFunctions',
  data: { 
    type: 'deleteRecord',
    data: { _id: 'record_id' }
  }
})
```

### 环境变量配置

#### 配置文件结构

```javascript
// config/env.js
export const ENV_CONFIG = {
  WX_CLOUD_ENV: getEnvVar('VITE_WX_CLOUD_ENV', 'cloud-XXXX'),
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', ''),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  IS_DEV: getEnvVar('NODE_ENV', 'development') === 'development',
  TAVILY_API_KEY: getEnvVar('VITE_TAVILY_API_KEY', '')  // AI 联网搜索
}
```

#### 跨平台环境变量读取

- **H5 环境**: 使用 `import.meta.env`
- **小程序环境**: 使用编译时注入的 `__ENV__` 全局变量
- **兜底机制**: 提供默认值和错误处理

## 支持平台

- **H5**: `npm run dev:h5` / `npm run build:h5`
- **微信小程序**: `npm run dev:mp-weixin` / `npm run build:mp-weixin`
- **支付宝小程序**: `npm run dev:mp-alipay`
- **百度小程序**: `npm run dev:mp-baidu`
- **字节跳动小程序**: `npm run dev:mp-toutiao`
- **QQ 小程序**: `npm run dev:mp-qq`

## 开发工作流

### 环境配置

1. **创建环境变量文件**
   ```bash
   cp .env.example .env
   ```

2. **配置微信云开发环境ID**
   ```bash
   # .env 文件
   VITE_WX_CLOUD_ENV=your-cloud-env-id-here
   ```

### 云开发配置

1. **开通微信云开发**
   - 在微信开发者工具中打开项目
   - 点击"云开发"按钮，开通云开发服务
   - 创建云开发环境，获取环境ID

2. **部署云函数**
   - 右键点击 `src/cloudfunctions/baseFunctions` 目录
   - 选择"上传并部署：云端安装依赖"
   - 等待部署完成

3. **初始化云数据库**
   - 云函数会自动创建 `sales` 集合（示例数据）
   - 可根据需要创建其他集合

### 开发命令

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

### 本地存储

使用 uni-app 本地存储 API：

- `uni.setStorageSync` / `uni.getStorageSync` - 同步存储
- 存储键:
  - `TEST_RECORDS` - 检测记录列表
  - `USER_INFO` - 用户信息
  - `PROFILE_GUIDE_SHOWN` - 个人页引导提示状态

### 云数据库

使用微信云开发云数据库：

- **集合名称**: `sales`（示例集合）
- **数据格式**: MongoDB 文档格式
- **操作方式**: 通过云函数进行 CRUD 操作
- **权限控制**: 基于微信用户 OpenID 进行数据隔离

### 用户身份识别

- **认证方式**: 微信小程序授权
- **用户标识**: 通过云函数获取用户 OpenID
- **数据隔离**: 每个用户的数据通过 OpenID 进行隔离

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
    ├── 随机抽样和顺序打乱
    ├── 动态熔断检测
    │
    ▼
结果页 (result)
    │
    ├── 显示认字量
    ├── 保存记录
    ├── 分享功能
    │
    ▼
首页 (home)

个人页 (profile)
    │
    ├── 用户信息展示和编辑（头像、昵称、年龄）
    ├── 统计数据展示
    ├── 点击历史记录
    │
    ▼
历史详情页 (history-detail)

AI 助手页 (ai-assistant)
    │
    ├── 智能对话（流式输出 + Markdown 渲染）
    ├── 基于检测数据生成个性化分析
    ├── 联网搜索（Tavily API，可选）
    │
    └── 微信云开发 AI（DeepSeek 模型）
```

## 重要约束

### 跨平台兼容性
- 使用 uni-app API 而非原生 Web API 以保证跨平台兼容
- 样式尺寸使用 `rpx` 单位实现响应式
- 图片等静态资源放在 `static/` 目录
- 页面生命周期使用 uni-app 提供的钩子（`onLoad`、`onShow` 从 `@dcloudio/uni-app` 导入）
- 使用 `#ifdef` 和 `#endif` 条件编译处理平台差异

### 微信小程序限制
- `uni.showActionSheet` 的 `itemList` 最多 6 个选项
- 超过 6 个选项需使用 `<picker>` 组件替代
- 分享图片推荐 5:4 比例，最小 500x400 像素

### 数据处理
- JSON 数据使用静态 `import` 导入，不使用动态 `require`
- 所有汉字数据来源于 `top_2500_chars_with_literacy.json`

### 云开发约束
- 云函数调用必须包含错误处理
- 环境变量不得硬编码，必须通过 `.env` 文件管理
- 云函数名称必须与目录名称一致（`baseFunctions`）
- 云开发环境ID必须正确配置，否则云函数调用失败

### 安全要求
- 敏感信息（云开发环境ID等）通过环境变量管理
- `.env` 文件不提交到 Git 仓库
- 提供 `.env.example` 作为配置模板

### 错误处理
- 所有云函数调用必须包含 try-catch 错误处理
- 网络错误需要提供用户友好的提示信息
- 云开发初始化失败需要明确的错误提示和解决方案

### AI 助手约束
- AI 功能仅支持微信小程序环境（H5 显示提示）
- 使用微信云开发 AI 接口（`wx.cloud.extend.AI`）
- 流式输出使用 `streamText` 方法和 `onText` 回调
- Markdown 渲染使用 `markdown-it` + `rich-text` 组件
- 联网搜索（Tavily）通过小程序 HTTP 请求调用，需配置 API Key
- 工具调用机制遵循 CloudBase AI 工具调用格式
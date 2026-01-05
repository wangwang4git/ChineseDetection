# ChineseDetection 项目概述

基于 uni-app 框架的跨平台应用项目，支持微信小程序、H5、App 等多端运行。

## 技术栈

- **框架**: uni-app 3.0 (DCloudio)
- **前端**: Vue 3.4
- **构建工具**: Vite 5.2
- **国际化**: vue-i18n 9.1
- **包管理器**: npm

## 项目结构

```
src/
├── App.vue              # 应用入口组件
├── main.js              # 应用入口文件
├── manifest.json        # 应用配置（appid、权限等）
├── pages.json           # 页面路由配置
├── uni.scss             # 全局样式变量
├── pages/               # 页面目录
│   └── index/           # 首页
│       └── index.vue
└── static/              # 静态资源
    └── logo.png
```

## 支持平台

- **H5**: `npm run dev:h5` / `npm run build:h5`
- **微信小程序**: `npm run dev:mp-weixin` / `npm run build:mp-weixin`
- **支付宝小程序**: `npm run dev:mp-alipay`
- **百度小程序**: `npm run dev:mp-baidu`
- **字节跳动小程序**: `npm run dev:mp-toutiao`
- **QQ 小程序**: `npm run dev:mp-qq`
- **App**: 通过 HBuilderX 打包

## 编码约定

### 命名约定

- 页面文件使用小写: `index.vue`
- 组件使用 PascalCase: `MyComponent.vue`
- 样式类名使用 kebab-case: `.text-area`
- 尺寸单位使用 `rpx`（响应式像素）

### 代码组织

- 每个页面放在 `pages/[page-name]/` 目录下
- 静态资源放在 `static/` 目录
- Vue 组件使用 Options API 风格

### Vue 组件结构

```vue
<template>
  <!-- 模板 -->
</template>

<script>
export default {
  data() { return {} },
  onLoad() {},      // uni-app 生命周期
  methods: {}
}
</script>

<style>
/* 样式 */
</style>
```

## 配置文件说明

### manifest.json

- 应用基本信息（名称、版本、appid）
- 各平台特有配置
- 权限声明

### pages.json

- 页面路由配置
- 导航栏样式
- 全局样式设置

## 开发工作流

```bash
# 安装依赖
npm install

# H5 开发模式
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# H5 生产构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin
```

## 重要约束

- 使用 uni-app API 而非原生 Web API 以保证跨平台兼容
- 样式尺寸使用 `rpx` 单位实现响应式
- 图片等静态资源放在 `static/` 目录
- 页面生命周期使用 uni-app 提供的钩子（如 `onLoad`、`onShow`）

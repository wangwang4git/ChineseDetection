# 设计文档: add-wechat-share

## 架构概述

### 分享功能架构

```
┌─────────────────────────────────────────────────────────┐
│                    微信小程序分享                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │   首页      │    │   结果页    │    │   个人页    │ │
│  │  home.vue   │    │ result.vue  │    │ profile.vue │ │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘ │
│         │                  │                  │         │
│         ▼                  ▼                  ▼         │
│  ┌─────────────────────────────────────────────────────┐│
│  │              src/utils/share.js                     ││
│  │  - getDefaultShareConfig()                          ││
│  │  - getResultShareConfig(vocabulary)                 ││
│  │  - getTimelineShareConfig()                         ││
│  └─────────────────────────────────────────────────────┘│
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────────┐│
│  │           微信小程序原生 API                         ││
│  │  - onShareAppMessage (分享好友)                     ││
│  │  - onShareTimeline (分享朋友圈)                     ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 技术决策

### 1. 使用 uni-app 生命周期钩子

uni-app 提供了 `onShareAppMessage` 和 `onShareTimeline` 钩子，可以直接在 Vue 组件中使用：

```javascript
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

// 分享给好友
onShareAppMessage(() => {
  return {
    title: '分享标题',
    path: '/pages/home/home',
    imageUrl: '/static/images/share.png'
  }
})

// 分享到朋友圈
onShareTimeline(() => {
  return {
    title: '分享标题',
    query: '',
    imageUrl: '/static/images/share.png'
  }
})
```

### 2. 条件编译处理平台差异

H5 环境不支持微信分享 API，需要使用条件编译：

```javascript
// #ifdef MP-WEIXIN
onShareAppMessage(() => { ... })
onShareTimeline(() => { ... })
// #endif
```

### 3. 分享工具模块设计

创建 `src/utils/share.js` 封装分享配置：

```javascript
/**
 * 获取默认分享配置（小程序介绍）
 */
export const getDefaultShareConfig = () => ({
  title: '🎓 汉字认字量检测 - 测测孩子认识多少字',
  path: '/pages/home/home',
  imageUrl: '/static/images/share-cover.png'
})

/**
 * 获取结果分享配置
 * @param {number} vocabulary - 认字量
 */
export const getResultShareConfig = (vocabulary) => ({
  title: `🎊 我家宝贝认识 ${vocabulary} 个汉字！快来测测你家孩子`,
  path: '/pages/home/home',
  imageUrl: '/static/images/share-result.png'
})

/**
 * 获取朋友圈分享配置
 */
export const getTimelineShareConfig = () => ({
  title: '汉字认字量检测 - 科学评估识字水平',
  imageUrl: '/static/images/share-cover.png'
})
```

## 分享内容设计

### 分享给好友

| 页面 | 标题 | 路径 | 图片 |
|------|------|------|------|
| 首页 | 🎓 汉字认字量检测 - 测测孩子认识多少字 | /pages/home/home | share-cover.png |
| 结果页 | 🎊 我家宝贝认识 {N} 个汉字！ | /pages/home/home | share-result.png |
| 个人页 | 🎓 汉字认字量检测 - 测测孩子认识多少字 | /pages/home/home | share-cover.png |
| 历史详情 | 📊 检测记录：认识 {N} 个汉字 | /pages/home/home | share-result.png |

### 分享到朋友圈

| 页面 | 标题 | 参数 | 图片 |
|------|------|------|------|
| 首页 | 汉字认字量检测 - 科学评估识字水平 | 无 | share-cover.png |
| 结果页 | 我家宝贝认识 {N} 个汉字 | 无 | share-result.png |
| 个人页 | 汉字认字量检测 - 科学评估识字水平 | 无 | share-cover.png |
| 历史详情 | 检测记录：认识 {N} 个汉字 | 无 | share-result.png |

## 注意事项

### 朋友圈"单页模式"限制

从朋友圈打开小程序时进入"单页模式"，有以下限制：
- 无登录态（`wx.login` 不可用）
- 不能跳转其他页面
- TabBar 不渲染
- 本地存储与正常模式隔离

**应对策略**：分享路径统一指向首页，避免复杂的页面跳转逻辑。

### 分享图片规范

- 推荐尺寸：5:4 比例（如 500x400）
- 文件大小：< 128KB
- 格式：PNG 或 JPG

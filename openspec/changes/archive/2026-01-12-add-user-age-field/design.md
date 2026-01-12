# 技术设计文档

## 架构概述

本变更在现有用户信息管理架构上进行扩展，不引入新的模块或依赖。

## 数据模型变更

### UserInfo 类型扩展

```javascript
/**
 * 用户信息数据结构
 * @typedef {Object} UserInfo
 * @property {string} openid - 微信 OpenID（必需）
 * @property {string} nickname - 用户昵称
 * @property {string} avatar - 头像 URL 或 emoji
 * @property {number} age - 用户年龄（1-15岁）
 * @property {boolean} hasAuthorized - 是否已授权
 * @property {number} lastUpdated - 最后更新时间戳
 * @property {'wechat'|'default'} source - 数据来源
 */
```

### 默认值

- `age`: 0（表示未设置）

### 验证规则

- 年龄范围：1-15 岁
- 0 表示未设置年龄

## UI 设计

### 年龄展示行

参考 Figma 设计稿，在账号行下方增加年龄行：

```html
<text class="age">年龄：{{ userInfo.age ? userInfo.age + '岁' : '点击设置' }}</text>
```

样式与账号行保持一致：
- 字体大小：28rpx
- 颜色：rgba(255, 255, 255, 0.9)

### 年龄选择器

使用 uni-app 的 `<picker>` 组件实现年龄选择：

> **注意**：不使用 `uni.showActionSheet`，因为微信小程序限制 `itemList` 最多 6 个选项，无法满足 1-15 岁的需求。

```vue
<!-- 模板 -->
<picker mode="selector" :range="ageOptions" @change="onAgeChange">
  <view class="age-wrapper">
    <text class="age">年龄：{{ userInfo.age ? userInfo.age + '岁' : '点击设置' }}</text>
  </view>
</picker>
```

```javascript
// 脚本
const ageOptions = Array.from({ length: 15 }, (_, i) => `${i + 1}岁`)

const onAgeChange = (e) => {
  const selectedAge = parseInt(e.detail.value) + 1
  // 更新年龄
}
```

## 数据流

```
用户点击年龄行
    ↓
弹出 picker 滚动选择器
    ↓
用户选择年龄并确认
    ↓
更新 userInfo.value.age（立即更新UI）
    ↓
调用 userManager.updateAge()（异步保存）
    ↓
保存到本地存储 USER_INFO
```

## 兼容性考虑

### 数据迁移

对于已有用户数据，在加载时自动补充 `age` 字段：

```javascript
if (userInfo && userInfo.age === undefined) {
  userInfo.age = 0
}
```

### 跨平台

年龄选择使用 `<picker>` 组件，微信小程序和 H5 环境均支持，无需条件编译。`picker` 组件无选项数量限制，是跨平台最稳定的方案。

## 安全考虑

- 年龄数据仅保存在本地，不上传到服务器
- 不涉及敏感个人信息的网络传输

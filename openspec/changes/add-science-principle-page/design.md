# Design: 识字量测试科学原理页

## 架构设计

### 页面结构

```
pages/science-principle/science-principle.vue
├── 顶部返回按钮（返回首页）
├── Header 卡片
│   ├── 🔬 emoji
│   ├── 主标题：识字量测试科学原理
│   └── 副标题：基于语言学研究的科学测评方法
├── 内容卡片列表
│   ├── 📊 数据来源卡片
│   ├── 🎯 测试策略卡片（含公式展示）
│   ├── 📋 常用字层级划分卡片（含表格）
│   ├── ⚠️ 测试结束机制卡片
│   └── 💡 计算示例卡片
└── 底部安全区域
```

### 设计稿关键样式参数

#### 页面背景
- 渐变背景：`linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%)`

#### 返回按钮
- 背景：`rgba(255, 255, 255, 0.90)`
- 边框：`1.57px solid #DAB2FF`
- 圆角：极大值（胶囊形状）
- 文字颜色：`#6E11B0`（紫色渐变）

#### Header 卡片
- 背景：`linear-gradient(90deg, #FDA5D5 0%, #DAB2FF 50%, #8EC5FF 100%)`
- 边框：`3.65px solid white`
- 圆角：`16px`
- 阴影：`0px 4px 6px -4px rgba(0, 0, 0, 0.10), 0px 10px 15px -3px rgba(0, 0, 0, 0.10)`

#### 内容卡片通用样式
- 背景：`rgba(255, 255, 255, 0.90)`
- 圆角：`16px`
- 阴影：同上

#### 各卡片特有边框颜色
| 卡片 | 边框颜色 |
|------|----------|
| 📊 数据来源 | `#8EC5FF`（蓝色） |
| 🎯 测试策略 | `#7BF1A8`（绿色） |
| 📋 层级划分 | `#FDA5D5`（粉色） |
| ⚠️ 结束机制 | `#FFDF20`（黄色） |
| 💡 计算示例 | `#A3B3FF`（浅蓝紫） |

#### 表格设计（层级划分）
- 表头背景：`linear-gradient(90deg, #E9D4FF 0%, #FCCEE8 100%)`
- 表头边框：`#DAB2FF`
- 各层级行背景色：
  - L1: `#FEF2F2`（浅红）
  - L2: `#FFF7ED`（浅橙）
  - L3: `#FEFCE8`（浅黄）
  - L4: `#F0FDF4`（浅绿）
  - L5: `#EFF6FF`（浅蓝）
  - L6: `#FAF5FF`（浅紫）
- 层级标签颜色：
  - L1: `#E7000B`
  - L2: `#F54900`
  - L3: `#D08700`
  - L4: `#00A63E`
  - L5: `#155DFC`
  - L6: `#9810FA`

#### 文字颜色规范
- 标题：`#6E11B0`（紫色）
- 正文：`#364153`（深灰）
- 高亮数字：`#9810FA`（紫色）
- 高亮关键词：`#00A63E`（绿色）、`#D08700`（橙色）

### 公式展示

计算公式使用白色卡片展示：
```
W = N_L1 + (N_L2 × 3) + (N_L3 × 10) + (N_L4 × 20) + (N_L5 × 50) + (N_L6 × 100)
```

### 首页修改

#### 副标题区域
将现有单行副标题修改为两行：
```vue
<view class="sub-title-section">
  <text class="sub-title">一起来测测认识多少字吧！</text>
  <text class="sub-title-link" @tap="goToPrinciple">科学原理查看请参考👉</text>
</view>
```

样式参数：
- 第一行：`font-size: 16px`, `color: #6E11B0`
- 第二行：`font-size: 16px`, `color: #155DFC`，可点击

## 数据结构

### 层级配置（复用 levelConfig.js）

页面展示数据可直接引用项目已有的 `LEVEL_CONFIGS` 常量：

```javascript
// 已存在于 utils/levelConfig.js
export const LEVEL_CONFIGS = [
  { level: 'L1', start: 0, end: 50, sampleSize: 50, weight: 1, description: '绝对核心字' },
  { level: 'L2', start: 50, end: 200, sampleSize: 50, weight: 3, description: '高频基础字' },
  // ...
]
```

## 交互设计

1. **返回按钮**：点击返回上一页（`uni.navigateBack()`）
2. **页面滚动**：整体可滚动，展示完整内容
3. **微信分享**：支持分享给好友和朋友圈

## 分享功能设计

### 分享配置函数

在 `utils/share.js` 中新增两个配置函数，遵循现有代码风格：

```javascript
/**
 * 获取科学原理页分享配置
 * @returns {Object} 分享配置对象
 */
export const getSciencePrincipleShareConfig = () => {
  const config = {
    title: '🔬 识字量测试科学原理 - 了解科学测评方法',
    path: '/pages/science-principle/science-principle'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}

/**
 * 获取科学原理页朋友圈分享配置
 * @returns {Object} 朋友圈分享配置对象
 */
export const getSciencePrincipleTimelineConfig = () => {
  const config = {
    title: '识字量测试科学原理 - 基于语言学研究的科学测评方法'
  }
  if (SHARE_IMAGE_URL) {
    config.imageUrl = SHARE_IMAGE_URL
  }
  return config
}
```

### 页面分享实现

在 `science-principle.vue` 页面中使用条件编译实现微信分享：

```vue
<script setup>
import { getSciencePrincipleShareConfig, getSciencePrincipleTimelineConfig } from '@/utils/share.js'

// #ifdef MP-WEIXIN
/**
 * 微信分享给好友
 * @returns {Object} 分享配置
 */
const onShareAppMessage = () => {
  return getSciencePrincipleShareConfig()
}

/**
 * 微信分享到朋友圈
 * @returns {Object} 朋友圈分享配置
 */
const onShareTimeline = () => {
  return getSciencePrincipleTimelineConfig()
}

// 暴露分享方法供 uni-app 调用
defineExpose({
  onShareAppMessage,
  onShareTimeline
})
// #endif
</script>
```

### 分享内容说明

| 分享场景 | 标题 | 路径 |
|----------|------|------|
| 分享给好友 | 🔬 识字量测试科学原理 - 了解科学测评方法 | /pages/science-principle/science-principle |
| 分享到朋友圈 | 识字量测试科学原理 - 基于语言学研究的科学测评方法 | - |

**注意事项**：
- 朋友圈分享不支持自定义路径，用户点击朋友圈分享卡片将进入小程序首页
- 分享图片当前使用页面截图，如需自定义需准备 500x400 或 750x600 尺寸图片

## 兼容性考虑

1. 使用 `rpx` 单位保证不同屏幕适配
2. 使用 `#ifdef MP-WEIXIN` 条件编译处理微信分享
3. 表格在小屏幕上保持可读性

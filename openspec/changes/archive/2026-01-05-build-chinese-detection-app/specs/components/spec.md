---
title: 公共组件规范
status: proposed
created: 2026-01-05
capability: components
---

# 公共组件规范

## ADDED Requirements

### Requirement: 米字格组件 (RiceGrid)

用于在检测页展示汉字的米字格背景组件。

#### Scenario: 默认展示

**Given** 使用 `<RiceGrid char="相" />`
**When** 组件渲染完成
**Then** 显示 192x192rpx 的米字格容器
**And** 显示金色边框（#fdc700）
**And** 显示米字格 SVG 背景线条
**And** 居中显示汉字"相"
**And** 汉字使用黑体 120px
**And** 显示阴影效果

#### Scenario: 自定义尺寸

**Given** 使用 `<RiceGrid char="好" :size="300" />`
**When** 组件渲染完成
**Then** 容器尺寸为 300x300rpx
**And** 汉字字号按比例缩放

#### Scenario: 空字符

**Given** 使用 `<RiceGrid char="" />`
**When** 组件渲染完成
**Then** 只显示米字格背景
**And** 不显示汉字

---

### Requirement: 汉字卡片组件 (CharacterCard)

用于在结果页和详情页展示单个汉字的卡片组件。

#### Scenario: 默认展示

**Given** 使用 `<CharacterCard char="新" />`
**When** 组件渲染完成
**Then** 显示粉色渐变背景卡片
**And** 显示粉色边框（#fda5d5）
**And** 显示圆角 10rpx
**And** 居中显示汉字"新"
**And** 汉字使用黑体 24px
**And** 显示阴影效果

#### Scenario: 点击交互

**Given** 使用 `<CharacterCard char="行" @tap="handleTap" />`
**When** 用户点击卡片
**Then** 触发 tap 事件
**And** 传递汉字参数

---

### Requirement: 渐变按钮组件 (GradientButton)

用于各页面的主要操作按钮。

#### Scenario: 主按钮样式（开始检测）

**Given** 使用 `<GradientButton type="primary">开始检测吧！</GradientButton>`
**When** 组件渲染完成
**Then** 显示粉紫蓝渐变背景
**And** 显示白色边框
**And** 显示圆角胶囊形状
**And** 显示白色文字
**And** 显示阴影效果

#### Scenario: 成功按钮样式（我认识）

**Given** 使用 `<GradientButton type="success">我认识</GradientButton>`
**When** 组件渲染完成
**Then** 显示绿色渐变背景（#05df72 → #00c950）
**And** 显示白色文字

#### Scenario: 警告按钮样式（不认识）

**Given** 使用 `<GradientButton type="warning">不认识</GradientButton>`
**When** 组件渲染完成
**Then** 显示橙红渐变背景（#ff8904 → #ff6467）
**And** 显示白色文字

#### Scenario: 次要按钮样式（结束检测）

**Given** 使用 `<GradientButton type="secondary">结束检测</GradientButton>`
**When** 组件渲染完成
**Then** 显示蓝紫渐变背景（#51a2ff → #c27aff）
**And** 显示白色文字

#### Scenario: 禁用状态

**Given** 使用 `<GradientButton disabled>按钮</GradientButton>`
**When** 组件渲染完成
**Then** 按钮显示半透明
**And** 点击无响应

#### Scenario: 点击事件

**Given** 使用 `<GradientButton @tap="handleClick">按钮</GradientButton>`
**When** 用户点击按钮
**Then** 触发 tap 事件
**And** 按钮显示点击反馈效果

---

### Requirement: 组件 Props 定义

所有组件需定义清晰的 Props 接口。

#### Scenario: RiceGrid Props

**Given** RiceGrid 组件
**When** 定义 Props
**Then** 包含以下属性：
```typescript
{
  char: string;           // 必填，要展示的汉字
  size?: number;          // 可选，容器尺寸，默认 192
}
```

#### Scenario: CharacterCard Props

**Given** CharacterCard 组件
**When** 定义 Props
**Then** 包含以下属性：
```typescript
{
  char: string;           // 必填，要展示的汉字
}
```

#### Scenario: GradientButton Props

**Given** GradientButton 组件
**When** 定义 Props
**Then** 包含以下属性：
```typescript
{
  type?: 'primary' | 'success' | 'warning' | 'secondary';  // 可选，按钮类型，默认 primary
  disabled?: boolean;     // 可选，是否禁用，默认 false
}
```

---

### Requirement: 组件 Emits 定义

所有可交互组件需定义 Emits 事件。

#### Scenario: CharacterCard Emits

**Given** CharacterCard 组件
**When** 定义 Emits
**Then** 包含以下事件：
```typescript
{
  tap: (char: string) => void;  // 点击事件，传递汉字
}
```

#### Scenario: GradientButton Emits

**Given** GradientButton 组件
**When** 定义 Emits
**Then** 包含以下事件：
```typescript
{
  tap: () => void;  // 点击事件
}
```

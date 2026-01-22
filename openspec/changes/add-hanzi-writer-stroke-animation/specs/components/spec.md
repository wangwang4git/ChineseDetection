## ADDED Requirements

### Requirement: HanziGrid 汉字展示组件

HanziGrid 组件 SHALL 基于 hanzi-writer 库实现汉字渲染，支持笔画动画功能，并保持与 RiceGrid 相同的视觉样式（金色边框、白色背景、米字格线条）。H5 和微信小程序均支持完整功能。

#### Scenario: H5 环境汉字渲染
- **WHEN** 在 H5 环境使用 `<HanziGrid char="向" :size="488" />`
- **THEN** 使用 hanzi-writer 库渲染汉字到 SVG
- **AND** 显示米字格背景线条（横线、竖线、两条对角线，颜色 #E5E7EB）
- **AND** 汉字颜色为 #101828
- **AND** 容器尺寸为 488x488rpx
- **AND** 显示金色边框（#FDC700）
- **AND** 显示白色背景和圆角阴影

#### Scenario: 小程序环境汉字渲染
- **WHEN** 在微信小程序环境使用 `<HanziGrid char="向" :size="488" />`
- **THEN** 使用 hanzi-writer-miniprogram 原生组件渲染汉字到 Canvas
- **AND** 显示米字格背景线条
- **AND** 汉字颜色为 #101828
- **AND** 保持相同的视觉样式
- **AND** 支持笔画动画功能

#### Scenario: 自定义尺寸
- **WHEN** 使用 `<HanziGrid char="子" :size="160" :showBorder="false" />`
- **THEN** 容器尺寸为 160x160rpx
- **AND** 不显示金色边框
- **AND** hanzi-writer 尺寸按比例调整

#### Scenario: 触发笔画动画（H5）
- **WHEN** 在 H5 环境调用组件的 `animateStroke()` 方法
- **THEN** 播放汉字笔画书写动画
- **AND** 动画过程中显示汉字轮廓（颜色 #DDD）
- **AND** 笔画按顺序逐一绘制
- **AND** 笔画间隔 300ms

#### Scenario: 触发笔画动画（小程序）
- **WHEN** 在小程序环境调用组件的 `animateStroke()` 方法
- **THEN** 通过 hanzi-writer-miniprogram context 播放笔画动画
- **AND** 动画过程中显示汉字轮廓
- **AND** 笔画按顺序逐一绘制

#### Scenario: 汉字切换
- **WHEN** `char` prop 变化（如从 "向" 变为 "子"）
- **THEN** 更新 hanzi-writer 实例为新汉字
- **AND** 重置动画状态

### Requirement: HanziGrid Props 定义

HanziGrid 组件 SHALL 定义清晰的 Props 属性接口。

#### Scenario: Props 接口
- **GIVEN** HanziGrid 组件
- **WHEN** 定义 Props
- **THEN** 包含以下属性：
```typescript
{
  char: string;           // 必填，要展示的汉字
  size?: number;          // 可选，容器尺寸（rpx），默认 488
  showBorder?: boolean;   // 可选，是否显示金色边框，默认 true
}
```

### Requirement: HanziGrid Expose 方法

HanziGrid 组件 SHALL 暴露 animateStroke 方法供父组件调用。

#### Scenario: Expose 接口
- **GIVEN** HanziGrid 组件
- **WHEN** 定义 Expose
- **THEN** 暴露以下方法：
```typescript
{
  animateStroke: () => void;  // 触发笔画动画（H5 和小程序均有效）
}
```

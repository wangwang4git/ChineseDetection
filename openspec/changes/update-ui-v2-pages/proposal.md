# Proposal: update-ui-v2-pages

## Summary

基于 Figma 设计稿 2.0 版本，更新检测页、结果页和历史详情页的 UI 样式，统一视觉风格为粉紫蓝渐变主题。

## Motivation

当前页面 UI 与最新 Figma 设计稿存在差异，需要更新以保持设计一致性：
1. 背景色从橙粉渐变改为粉紫蓝渐变
2. 卡片样式、按钮样式、进度条样式等需要更新
3. 结果页移除分层详情区域，简化展示

## Scope

### 受影响页面
- `src/pages/test/test.vue` - 检测页
- `src/pages/result/result.vue` - 结果页
- `src/pages/history-detail/history-detail.vue` - 历史详情页

### 受影响组件
- `src/components/RiceGrid.vue` - 米字格组件
- `src/components/CharacterCard.vue` - 汉字卡片组件

## Design Decisions

### 1. 统一背景渐变
所有页面采用统一的粉紫蓝渐变背景：
```css
background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
```

### 2. 检测页 UI 更新
- 简化进度信息显示（移除层级信息和总进度）
- 进度条改为白色半透明背景 + 紫色边框
- 米字格改为白色背景 + 金色边框 (#FDC700)
- 按钮改为圆角胶囊形状，绿色/橙红渐变

### 3. 结果页 UI 更新
- 结果卡片改为金黄渐变 + 金色边框
- 移除分层详情区域
- 不认识汉字卡片改为粉色渐变背景
- 结束按钮改为蓝紫渐变

### 4. 历史详情页 UI 更新
- 返回按钮改为白色背景 + 紫色边框
- 信息卡片改为粉紫蓝渐变 + 白色边框
- 移除分层详情区域
- 不认识汉字卡片改为粉色渐变背景

## Out of Scope

- 业务逻辑不变
- 数据结构不变
- API 接口不变

## Dependencies

无外部依赖

## Risks

- 低风险：纯 UI 样式更新，不涉及业务逻辑变更

## References

- Figma 设计稿：检测页 2.0 (19_2)
- Figma 设计稿：结果页 2.0 (20_28)
- Figma 设计稿：历史详情页 2.0 (20_100)

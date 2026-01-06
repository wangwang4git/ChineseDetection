# Proposal: update-ui-design-v2

## Summary

基于 Figma 设计稿 2.0 版本，更新首页和个人页的 UI 实现，采用全新的粉紫蓝渐变视觉风格。

## Motivation

当前首页和个人页的 UI 设计与最新 Figma 设计稿（首页2.0、个人页2.0）存在较大差异：
- 背景色从橙粉渐变改为粉紫蓝渐变
- 卡片样式从纯色渐变改为带边框的浅色渐变
- 新增顶部 banner 图片（首页）
- 统计卡片采用独立渐变色（个人页）
- 底部 TabBar 样式更新

## Scope

### In Scope
- 首页 (`home.vue`) UI 重构
- 个人页 (`profile.vue`) UI 重构
- 样式变量更新 (`variables.scss`)

### Out of Scope
- 检测页、结果页、历史详情页（保持现有实现）
- 业务逻辑变更
- API 接口变更

## Design References

| 页面 | Figma 文件 | 资源路径 |
|------|-----------|---------|
| 首页2.0 | `.codebuddy/figma/15_264/figma.html` | `assets/CodeBubbyAssets/15_264/` |
| 个人页2.0 | `.codebuddy/figma/15_4/figma.html` | `assets/CodeBubbyAssets/15_4/` |

## Key Changes

### 1. 全局样式更新

**背景渐变**:
```css
/* 旧版 */
background: linear-gradient(180deg, #ffecd2 0%, #fcb69f 50%, #ee9ca7 100%);

/* 新版 */
background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
```

**主题色**:
- 主色调: `#9810FA` (紫色)
- 标题色: `#6E11B0` (深紫)
- 边框强调: `#FFDF20` (金黄)

### 2. 首页更新

| 元素 | 旧版 | 新版 |
|------|------|------|
| 顶部 | emoji + 文字 | banner 图片 |
| 年龄卡片 | 纯色渐变背景 | 浅色渐变 + 金边 + emoji |
| 按钮 | 紫色渐变 | 粉紫蓝渐变胶囊按钮 |
| TabBar | 无 | 底部固定导航 |

### 3. 个人页更新

| 元素 | 旧版 | 新版 |
|------|------|------|
| 用户卡片 | 紫色渐变 | 粉紫渐变 + 白边 |
| 统计卡片 | 白色背景 | 绿/蓝/紫独立渐变 |
| 历史记录 | 白色卡片 | 浅黄渐变 + 金边 |
| TabBar | 无 | 底部固定导航 |

## Risks

- **图片资源依赖**: 首页 banner 图片需确保路径正确
- **TabBar 重复**: 页面内 TabBar 与 `pages.json` 配置的系统 TabBar 可能冲突

## Mitigation

- 使用相对路径引用 `assets/CodeBubbyAssets/` 下的图片资源
- 页面内 TabBar 仅作为视觉展示，实际导航由系统 TabBar 处理

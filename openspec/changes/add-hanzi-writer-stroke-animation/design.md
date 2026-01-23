## Context

当前项目使用 RiceGrid 组件展示汉字，通过 CSS 绘制米字格背景和 `<text>` 元素显示汉字。此方案需要升级为使用 hanzi-writer-miniprogram 组件，以支持笔画动画功能。

**关键约束**：
- 仅针对微信小程序环境开发
- 保持现有米字格 UI 样式
- 使用 Canvas 2D API 渲染

## Goals / Non-Goals

**Goals**:
- 使用 hanzi-writer-miniprogram 渲染汉字（替代静态文本）
- 添加笔画动画触发按钮
- 保持米字格视觉样式一致性
- 支持大米字格（488rpx）和小米字格（160rpx）两种尺寸

**Non-Goals**:
- 不实现测验/描红模式（`writer.quiz()`）
- 不实现词语小米字格的笔画动画（仅大米字格支持动画）
- 不修改现有测试流程逻辑
- 不支持 H5 环境

## Decisions

### Decision 1: 创建新组件 HanziGrid 而非修改 RiceGrid

**原因**：
- RiceGrid 是轻量级静态组件，在多处使用
- HanziGrid 需要管理 hanzi-writer 实例生命周期
- 渐进式替换，降低风险

### Decision 2: 使用 hanzi-writer-miniprogram 组件

**方案**：使用 `hanzi-writer-miniprogram@beta` 版本实现微信小程序支持

**技术调研结论**：

**版本选择（重要）**：
- **稳定版 (v1.1.0)**：使用旧版 `wx.createCanvasContext` API，**仅支持基础库 ≤ 2.7.7**
- **Beta 版 (v1.2.0-beta.1)**：支持新版 Canvas 2D API，**支持基础库 ≥ 2.9.0**
- 由于 `wx.createCanvasContext` 已停止维护，**必须使用 beta 版本**

**微信小程序基础库版本要求**：
- Canvas 2D（`type="2d"`）最低支持版本：**2.9.0**
- beta 版本已内置兼容性处理，无需手动设置最低基础库版本

**兼容性问题**：
1. 真机 `Path2D` API 不支持问题 → 需修改源码跳过判断
2. CDN 数据加载问题 → 需配置服务器域名

**wxcomponents 目录位置（重要）**：
- 根据 [uni-app 官方文档](https://zh.uniapp.dcloud.io/tutorial/miniprogram-subject.html)
- HBuilderX 项目：`wxcomponents/` 位于项目根目录
- **vue-cli/vite 项目：`wxcomponents/` 位于 `src` 目录下**
- 本项目使用 vite 构建，因此 wxcomponents 应放在 `src/wxcomponents/`

**实现步骤**：

1. 安装依赖（需要同时安装 hanzi-writer 核心库和小程序适配层）：
```bash
npm install hanzi-writer hanzi-writer-miniprogram@beta
```

2. 在 `src` 目录下创建 `wxcomponents/hanzi-writer-miniprogram/` 目录：
```
src/
├── wxcomponents/
│   └── hanzi-writer-miniprogram/
│       ├── index.js
│       ├── hanzi-writer.js
│       ├── hanzi-writer-context.js
│       ├── hanzi-writer-view.js
│       ├── hanzi-writer-view.json
│       ├── hanzi-writer-view.wxml
│       └── hanzi-writer-view.wxss
├── pages/
├── components/
└── ...
```

3. 复制组件文件：
   - `node_modules/hanzi-writer-miniprogram/src/*` → `src/wxcomponents/hanzi-writer-miniprogram/`
   - `node_modules/hanzi-writer/dist/hanzi-writer.js` → `src/wxcomponents/hanzi-writer-miniprogram/`

4. 修改 `hanzi-writer-context.js` 引入路径：
```javascript
import HanziWriter from './hanzi-writer';
```

5. 修复真机 Path2D 兼容性问题（`hanzi-writer.js` 约 2602 行）：
```javascript
// 强制使用 pathStringToCanvas，跳过 Path2D 判断
this._pathCmd = pathStringToCanvas(this._stroke.path);
```

6. 在 `pages.json` 对应页面配置中注册组件：
```json
{
  "path": "pages/test/test",
  "style": {
    "navigationBarTitleText": "检测中",
    "navigationStyle": "custom",
    "usingComponents": {
      "hanzi-writer-view": "/wxcomponents/hanzi-writer-miniprogram/hanzi-writer-view"
    }
  }
}
```

7. 使用 Canvas 2D 模式（beta 版本特性）：
```html
<template>
  <hanzi-writer-view 
    id="hz-writer" 
    type="2d"
    canvas-id="writer-canvas"
    :width="192" 
    :height="192" 
  />
</template>
```

```javascript
// 获取 Canvas 2D 上下文并创建 writer
const query = wx.createSelectorQuery()
query.select('#writer-canvas')
  .fields({ node: true, size: true })
  .exec((res) => {
    const canvas = res[0].node
    const ctx = canvas.getContext('2d')
    
    this.writerCtx = createHanziWriterContext({
      id: 'hz-writer',
      character: '向',
      page: this,
      renderCanvas: canvas,
      renderCtx: ctx
    })
  })
```

### Decision 3: 笔画动画配置

```javascript
writerCtx.animateCharacter({
  strokeAnimationSpeed: 1,      // 笔画速度
  delayBetweenStrokes: 300,     // 笔画间隔 300ms
  onComplete: () => {
    console.log('动画完成')
  }
})
```

**轮廓可见性**：设置 `showOutline: true` + `outlineColor: '#DDD'`

### Decision 4: 按钮布局

根据 Figma 设计稿，米字格右侧有两个圆形按钮垂直排列：
1. 喇叭按钮（紫色 #E9D4FF）- 已实现
2. 笔画按钮（粉色 #FCCEE8）- 新增

按钮尺寸：48x48px，圆角，带阴影

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| hanzi-writer-miniprogram Path2D 兼容性 | 真机无法显示 | 修改源码跳过 Path2D 判断 |
| hanzi-writer 汉字数据加载 | 网络依赖 | 配置 CDN 域名或使用本地数据 |
| 性能影响（Canvas 动画） | 低端设备卡顿 | 限制动画复杂度 |
| beta 版本稳定性 | 潜在 bug | 充分测试，关注官方更新 |

## Migration Plan

1. 安装 hanzi-writer-miniprogram@beta 依赖
2. 在 `src/wxcomponents/` 目录下配置组件文件
3. 修复 Path2D 兼容性问题
4. 在 pages.json 中注册小程序原生组件
5. 创建 HanziGrid 组件
6. 在 test.vue 中替换大米字格为 HanziGrid
7. 在 test.vue 中替换词语小米字格为 HanziGrid
8. 添加笔画按钮和动画触发逻辑（仅大米字格）
9. 测试小程序模拟器和真机兼容性
10. 配置小程序服务器域名（cdn.jsdelivr.net）

## Open Questions

- [ ] 是否需要将汉字数据本地化以避免 CDN 依赖

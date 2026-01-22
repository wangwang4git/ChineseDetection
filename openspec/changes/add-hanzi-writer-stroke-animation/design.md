## Context

当前项目使用 RiceGrid 组件展示汉字，通过 CSS 绘制米字格背景和 `<text>` 元素显示汉字。此方案需要升级为使用 hanzi-writer 库，以支持笔画动画功能。

**关键约束**：
- uni-app 跨平台兼容性（H5 + 微信小程序）
- 保持现有米字格 UI 样式
- hanzi-writer 需要 DOM/SVG 操作，需处理小程序兼容性

## Goals / Non-Goals

**Goals**:
- 使用 hanzi-writer 渲染汉字（替代静态文本）
- 添加笔画动画触发按钮
- 保持米字格视觉样式一致性
- 支持大米字格（488rpx）和小米字格（160rpx）两种尺寸
- **H5 和微信小程序均支持笔画动画功能**

**Non-Goals**:
- 不实现测验/描红模式（`writer.quiz()`）
- 不实现词语小米字格的笔画动画（仅大米字格支持动画）
- 不修改现有测试流程逻辑

## Decisions

### Decision 1: 创建新组件 HanziGrid 而非修改 RiceGrid

**原因**：
- RiceGrid 是轻量级静态组件，在多处使用
- HanziGrid 需要管理 hanzi-writer 实例生命周期
- 渐进式替换，降低风险

### Decision 2: H5 环境 - hanzi-writer 初始化方式

**方案**：使用 SVG 背景 + hanzi-writer 渲染到同一 SVG

```html
<svg id="hanzi-target" width="192" height="192">
  <!-- 米字格背景线条 -->
  <line x1="0" y1="0" x2="192" y2="192" stroke="#E5E7EB" />
  <line x1="192" y1="0" x2="0" y2="192" stroke="#E5E7EB" />
  <line x1="96" y1="0" x2="96" y2="192" stroke="#E5E7EB" />
  <line x1="0" y1="96" x2="192" y2="96" stroke="#E5E7EB" />
</svg>
```

```javascript
const writer = HanziWriter.create('hanzi-target', '向', {
  width: 192,
  height: 192,
  padding: 10,
  strokeColor: '#101828',
  outlineColor: '#DDD',
  showOutline: true
})
```

### Decision 3: 小程序兼容性处理 - 使用 hanzi-writer-miniprogram

**方案**：使用 `hanzi-writer-miniprogram` 组件实现微信小程序支持

**技术调研结论**：
- hanzi-writer 官方提供 `hanzi-writer-miniprogram` 微信小程序适配组件
- 该组件使用 Canvas 2D API 渲染，支持笔画动画
- 需要处理以下兼容性问题：
  1. 真机 `Path2D` API 不支持问题
  2. CDN 数据加载问题

**实现步骤**：

1. 安装依赖：
```bash
npm install hanzi-writer-miniprogram
```

2. 在 uni-app 根目录创建 `wxcomponents/hanzi-writer-miniprogram/` 目录

3. 复制组件文件：
   - `node_modules/hanzi-writer-miniprogram/src/*` → `wxcomponents/hanzi-writer-miniprogram/`
   - `node_modules/hanzi-writer/dist/hanzi-writer.js` → `wxcomponents/hanzi-writer-miniprogram/`

4. 修改 `hanzi-writer-context.js` 引入路径：
```javascript
import HanziWriter from './hanzi-writer';
```

5. 修复真机 Path2D 兼容性问题（`hanzi-writer.js` 约 2602 行）：
```javascript
// 强制使用 pathStringToCanvas，跳过 Path2D 判断
this._pathCmd = pathStringToCanvas(this._stroke.path);
```

6. 页面注册组件（`pages.json`）：
```json
"usingComponents": {
  "hanzi-writer-view": "/wxcomponents/hanzi-writer-miniprogram/hanzi-writer-view"
}
```

7. 使用组件：
```html
<!-- 小程序环境 -->
<hanzi-writer-view id="hz-writer" width="192" height="192" />
```

```javascript
import createHanziWriterContext from '@/wxcomponents/hanzi-writer-miniprogram/index'

// 创建上下文
this.writerCtx = createHanziWriterContext({
  id: 'hz-writer',
  character: '向',
  page: this
})

// 播放动画
this.writerCtx.animateCharacter()
```

**条件编译结构**：
```javascript
// #ifdef H5
import HanziWriter from 'hanzi-writer'
// 使用 DOM API 渲染
// #endif

// #ifdef MP-WEIXIN
import createHanziWriterContext from '@/wxcomponents/hanzi-writer-miniprogram/index'
// 使用 Canvas 2D 渲染
// #endif
```

### Decision 4: 笔画动画配置

```javascript
writer.animateCharacter({
  strokeAnimationSpeed: 1,      // 笔画速度
  delayBetweenStrokes: 300,     // 笔画间隔 300ms
  onComplete: () => {
    console.log('动画完成')
  }
})
```

**轮廓可见性**：设置 `showOutline: true` + `outlineColor: '#DDD'`

### Decision 5: 按钮布局

根据 Figma 设计稿，米字格右侧有两个圆形按钮垂直排列：
1. 喇叭按钮（紫色 #E9D4FF）- 已实现
2. 笔画按钮（粉色 #FCCEE8）- 新增

按钮尺寸：48x48px，圆角，带阴影

**笔画按钮在 H5 和小程序环境均可用**（不再需要条件编译隐藏）

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| hanzi-writer-miniprogram Path2D 兼容性 | 真机无法显示 | 修改源码跳过 Path2D 判断 |
| hanzi-writer 汉字数据加载 | 网络依赖 | 配置 CDN 域名或使用本地数据 |
| 性能影响（Canvas 动画） | 低端设备卡顿 | 限制动画复杂度 |
| 小程序组件集成复杂度 | 开发调试成本 | 详细记录配置步骤 |

## Migration Plan

1. 安装 hanzi-writer-miniprogram 依赖
2. 配置 wxcomponents 目录和组件文件
3. 修复 Path2D 兼容性问题
4. 创建 HanziGrid 组件（条件编译处理 H5/小程序）
5. 在 test.vue 中替换大米字格为 HanziGrid
6. 在 test.vue 中替换词语小米字格为 HanziGrid
7. 添加笔画按钮和动画触发逻辑（仅大米字格）
8. 测试 H5 和小程序兼容性
9. 配置小程序服务器域名（cdn.jsdelivr.net）

## Open Questions

- [x] ~~小程序环境是否有第三方 hanzi-writer 适配方案~~ → 使用 hanzi-writer-miniprogram
- [ ] 是否需要将汉字数据本地化以避免 CDN 依赖

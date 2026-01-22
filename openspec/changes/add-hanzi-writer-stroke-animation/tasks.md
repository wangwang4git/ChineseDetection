## 0. 安装和配置小程序组件

- [ ] 0.1 安装 hanzi-writer-miniprogram 依赖：`npm install hanzi-writer-miniprogram`
- [ ] 0.2 创建 `wxcomponents/hanzi-writer-miniprogram/` 目录
- [ ] 0.3 复制 `node_modules/hanzi-writer-miniprogram/src/*` 到 wxcomponents 目录
- [ ] 0.4 复制 `node_modules/hanzi-writer/dist/hanzi-writer.js` 到 wxcomponents 目录
- [ ] 0.5 修改 `hanzi-writer-context.js` 引入路径为 `./hanzi-writer`
- [ ] 0.6 修复 `hanzi-writer.js` 中 Path2D 兼容性问题（跳过 Path2D 判断）
- [ ] 0.7 配置小程序服务器域名（cdn.jsdelivr.net）

## 1. 创建 HanziGrid 组件

- [ ] 1.1 创建 `src/components/HanziGrid.vue` 组件文件
- [ ] 1.2 定义 Props：`char`（汉字）、`size`（尺寸）、`showBorder`（是否显示边框）
- [ ] 1.3 H5 环境：使用 hanzi-writer 渲染汉字到 SVG，绘制米字格背景
- [ ] 1.4 小程序环境：使用 hanzi-writer-view 原生组件渲染
- [ ] 1.5 定义 `animateStroke()` 方法，触发笔画动画（H5 和小程序均支持）
- [ ] 1.6 暴露组件方法供父组件调用：`defineExpose({ animateStroke })`

## 2. 更新检测页

- [ ] 2.1 在 test.vue 中引入 HanziGrid 组件
- [ ] 2.2 替换大米字格：`<RiceGrid>` → `<HanziGrid ref="mainHanziGrid">`
- [ ] 2.3 替换词语小米字格：`<RiceGrid>` → `<HanziGrid :showBorder="false">`
- [ ] 2.4 添加笔画按钮（粉色圆形，与喇叭按钮垂直排列）
- [ ] 2.5 笔画按钮 H5 和小程序均可见（无需条件编译隐藏）
- [ ] 2.6 实现 `handleStrokeTap()` 方法，调用 `mainHanziGrid.animateStroke()`
- [ ] 2.7 添加笔画按钮样式（.stroke-btn）

## 3. 样式和资源

- [ ] 3.1 添加笔画图标 SVG 到 `/assets/stroke.svg`
- [ ] 3.2 HanziGrid 组件样式：金色边框、白色背景、圆角、阴影
- [ ] 3.3 确保 hanzi-writer 渲染的汉字颜色为 #101828
- [ ] 3.4 确保 hanzi-writer 轮廓颜色为 #DDD

## 4. 测试验证

- [ ] 4.1 H5 环境：验证汉字正确渲染
- [ ] 4.2 H5 环境：验证笔画动画播放正常
- [ ] 4.3 小程序模拟器：验证汉字正确渲染
- [ ] 4.4 小程序真机：验证笔画动画播放正常（Path2D 兼容性修复后）
- [ ] 4.5 验证汉字切换时 hanzi-writer 实例正确更新

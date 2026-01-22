# Change: 添加 hanzi-writer 笔画动画功能

## Why
当前检测页面使用静态文本展示汉字，缺少笔画书写展示功能。根据设计稿"检测页4.0"的要求，需要：
1. 在米字格组件右边添加笔画按钮
2. 使用 hanzi-writer 库替换当前汉字展示逻辑，实现更专业的汉字渲染
3. 点击笔画按钮时播放笔画动画，帮助用户学习正确的书写顺序

## What Changes
- 创建新组件 `HanziGrid.vue`，基于 hanzi-writer 库实现汉字渲染
- 支持两种尺寸：大米字格（488rpx）用于测试汉字、小米字格（160rpx）用于词语展示
- 检测页大米字格和词语小米字格均替换为 HanziGrid 组件
- 在检测页大米字格右侧添加笔画按钮（粉色圆形按钮，与喇叭按钮垂直排列）
- 点击笔画按钮触发 hanzi-writer 的 `animateCharacter()` 方法播放笔画动画（仅大米字格支持）
- 动画播放时显示汉字轮廓，便于用户观察书写过程
- 保持现有米字格 UI 样式（金色边框、白色背景、米字格线条）
- **H5 和微信小程序均支持笔画动画功能**

## Impact
- Affected specs: `components`, `test-page`
- Affected code:
  - `src/components/HanziGrid.vue` - 新建基于 hanzi-writer 的汉字展示组件
  - `src/pages/test/test.vue` - 替换大米字格和词语小米字格的 RiceGrid 为 HanziGrid，添加笔画按钮
  - `wxcomponents/hanzi-writer-miniprogram/` - 小程序原生组件（从 npm 复制并修复兼容性）
- 依赖: 
  - hanzi-writer（已安装 v3.7.3）- H5 环境
  - hanzi-writer-miniprogram - 微信小程序环境（需新安装）

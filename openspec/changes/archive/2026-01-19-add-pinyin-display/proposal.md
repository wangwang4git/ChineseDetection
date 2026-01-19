# Change: 添加拼音展示功能

## Why
当前检测页面只展示汉字，缺少拼音辅助信息。根据设计稿"检测页4.0"的要求，需要在米字格汉字上方居中展示带声调的拼音，帮助用户学习正确发音。

## What Changes
- 在检测页面的米字格组件上方添加拼音展示区域
- 使用 `cnchar` 库获取汉字的拼音和声调
- 拼音使用黑体字体（Arial Bold），36px大小，居中对齐
- 拼音颜色与设计稿保持一致（#101828）

## Impact
- Affected specs: `test-page`
- Affected code: 
  - `src/pages/test/test.vue` - 添加拼音展示逻辑和样式
- 新增依赖: 无（cnchar 已安装）

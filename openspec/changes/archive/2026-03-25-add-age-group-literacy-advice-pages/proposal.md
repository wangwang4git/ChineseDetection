# Change: 添加 5-6岁、幼小衔接、1-2年级、3-4年级 识字学习建议页面

## Why

当前应用仅有 4-5岁 识字学习建议页面，首页其他 4 个年龄段卡片（5-6岁、幼小衔接、1-2年级、3-4年级）无法点击跳转到对应建议页面。用户在完成识字量检测后，需要针对不同年龄段获取专业的识字指导方案。

## What Changes

- **首页卡片交互增强**：将 5-6岁、幼小衔接、1-2年级、3-4年级卡片设为可点击，参考首页 Figma 设计稿（320_742），为每个卡片添加「点击查看建议📖」蓝色文字链接
- **新增 4 个识字学习建议页面**：
  - `pages/literacy-advice-5-6/literacy-advice-5-6.vue`（参考 Figma 320_2）
  - `pages/literacy-advice-transition/literacy-advice-transition.vue`（参考 Figma 320_191）
  - `pages/literacy-advice-grade-1-2/literacy-advice-grade-1-2.vue`（参考 Figma 320_384）
  - `pages/literacy-advice-grade-3-4/literacy-advice-grade-3-4.vue`（参考 Figma 320_577）
- **路由注册**：在 `pages.json` 中添加 4 个新页面路由
- **页面结构对齐**：所有新页面严格对齐已有 4-5岁页面（`literacy-advice.vue`）的实现模式，包括返回按钮、数据驱动渲染、模块结构、音效管理和微信分享条件编译

## Impact

- **Affected specs**: `literacy-advice-page`（新增 4 个页面需求）、`pages`（新增路由和首页卡片交互）
- **Affected code**:
  - `src/pages/home/home.vue`：修改卡片 `tappable` 状态和跳转逻辑
  - `src/pages.json`：添加 4 个新页面路由
  - 新增 4 个页面组件文件

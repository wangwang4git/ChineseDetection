# Change: 添加4-5岁识字学习建议页面

## Why

家长在首页看到「4-5岁」年龄段卡片后，缺少进一步获取识字学习指导的入口。需要提供一个专业的识字学习建议页面，帮助家长了解该年龄段儿童的科学识字方法和策略，提升应用的教育指导价值。

## What Changes

- **首页年龄段卡片交互升级**：4-5岁卡片增加蓝色可点击提示文案「（点击查看建议📖）」，点击整个卡片跳转到建议页
- **新增「4-5岁识字学习建议」页面**：静态内容展示页，包含4个核心建议模块（聚焦核心字频、情景阅读、游戏化激励、科学复习），参考 Figma 设计稿 `304_8`
- **页面路由注册**：在 `pages.json` 中添加新页面路由

## Impact

- Affected specs: `pages`（首页卡片行为变更）、`literacy-advice-page`（新增能力）
- Affected code:
  - `src/pages.json` — 注册新页面路由
  - `src/pages/home/home.vue` — 4-5岁卡片增加点击提示和跳转逻辑
  - `src/pages/literacy-advice/literacy-advice.vue` — 新建建议页面（新增）

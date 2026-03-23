## 1. 路由注册

- [x] 1.1 在 `src/pages.json` 中添加 `pages/literacy-advice/literacy-advice` 页面路由，设置 `navigationStyle: "custom"`

## 2. 首页卡片交互升级

- [x] 2.1 修改 `src/pages/home/home.vue`，为4-5岁卡片的描述区域增加蓝色提示文案「（点击查看建议📖）」（颜色 #155DFC，字号 24rpx）
- [x] 2.2 为4-5岁卡片绑定 `@tap` 事件，点击后调用 `uni.navigateTo` 跳转到 `/pages/literacy-advice/literacy-advice`
- [x] 2.3 点击时播放按钮音效（`playSound('button')`）

## 3. 新建4-5岁识字学习建议页面

- [x] 3.1 创建 `src/pages/literacy-advice/literacy-advice.vue`，使用 Vue 3 Composition API (`<script setup>`)
- [x] 3.2 实现页面整体布局：粉紫蓝渐变背景 + 白色圆角主卡片（橙色边框 #FFD6A8）
- [x] 3.3 实现顶部 Banner 区域：紫粉橙渐变头部 + 🎯 emoji + 标题 + 副标题
- [x] 3.4 实现4个建议卡片模块（数据驱动渲染）：
  - 📊 蓝色主题 — 明确学习优先级：聚焦核心字频
  - 📖 绿色主题 — 融入情景阅读：科学启蒙与故事化输入
  - 🎮 橙色主题 — 建立进阶激励机制：游戏化成长路径
  - ⏰ 紫色主题 — 科学复习与生活应用
- [x] 3.5 实现底部鼓励语区域（粉紫渐变背景）
- [x] 3.6 实现左上角「← 返回」按钮（白色半透明背景 + 紫色边框 #DAB2FF + 紫色文字 #6E11B0），点击返回上一页
- [x] 3.7 添加微信小程序分享配置（条件编译 `#ifdef MP-WEIXIN`）
- [x] 3.8 初始化和销毁音频管理器（`initAudio` / `destroyAudio`）

## 4. Bugfix：顶部白色背景修复

- [x] 4.1 将返回按钮从 `position: fixed` 改为文档流定位（`display: inline-flex`），参考科学原理页面实现
- [x] 4.2 添加 `<view class="safe-area-top">` 顶部安全区占位（`height: 88rpx`）
- [x] 4.3 添加 `<view class="safe-area-bottom">` 底部安全区（`calc(48rpx + env(safe-area-inset-bottom))`）
- [x] 4.4 主内容卡片 `.main-card` 的 `margin-top` 从 `246rpx` 调整为 `32rpx`
- [x] 4.5 移除 `.page-container` 的 `position: relative`（不再需要）

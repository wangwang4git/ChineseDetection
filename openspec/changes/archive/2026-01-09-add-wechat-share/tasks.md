# 任务列表: add-wechat-share

## 实现任务

### 1. 创建分享工具模块
- [x] 在 `src/utils/` 下创建 `share.js` 分享工具函数
- [x] 封装通用的分享配置生成函数
- [x] 支持动态生成分享标题和路径

### 2. 首页添加分享功能
- [x] 在 `home.vue` 中添加 `onShareAppMessage` 钩子
- [x] 在 `home.vue` 中添加 `onShareTimeline` 钩子
- [x] 配置分享标题和图片

### 3. 结果页添加分享功能
- [x] 在 `result.vue` 中添加 `onShareAppMessage` 钩子
- [x] 在 `result.vue` 中添加 `onShareTimeline` 钩子
- [x] 分享内容包含检测结果（认字量）
- [x] 分享路径携带结果参数

### 4. 个人页添加分享功能
- [x] 在 `profile.vue` 中添加 `onShareAppMessage` 钩子
- [x] 在 `profile.vue` 中添加 `onShareTimeline` 钩子

### 5. 历史详情页添加分享功能
- [x] 在 `history-detail.vue` 中添加 `onShareAppMessage` 钩子
- [x] 在 `history-detail.vue` 中添加 `onShareTimeline` 钩子
- [x] 分享内容包含历史检测结果

### 6. 验证与测试
- [x] 在微信开发者工具中测试右上角分享菜单
- [x] 验证分享给好友功能
- [x] 验证分享到朋友圈功能
- [x] 验证分享链接打开后的页面展示

## 验收标准

1. ✅ 首页、结果页、个人页、历史详情页右上角菜单显示"转发"和"分享到朋友圈"按钮
2. ✅ 检测页不显示分享按钮（避免打断测试流程）
3. ✅ 分享内容包含自定义标题和图片
4. ✅ 结果页分享包含认字量信息
5. ✅ H5 环境无报错（条件编译处理）

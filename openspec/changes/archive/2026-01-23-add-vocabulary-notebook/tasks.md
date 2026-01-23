## 0. 存储层扩展

- [x] 0.1 在 `storage.js` 添加 `VOCABULARY_NOTEBOOK` 存储键
- [x] 0.2 实现 `getVocabularyNotebook()` 函数
- [x] 0.3 实现 `setVocabularyNotebook(notebook)` 函数
- [x] 0.4 实现 `addToVocabularyNotebook(chars)` 函数（支持去重）
- [x] 0.5 实现 `removeFromVocabularyNotebook(char)` 函数
- [x] 0.6 实现 `initVocabularyNotebook()` 函数（从历史记录初始化）

## 1. 创建生字本页面

- [x] 1.1 创建 `src/pages/vocabulary-notebook/vocabulary-notebook.vue`
- [x] 1.2 实现顶部返回按钮（参考 Figma 样式）
- [x] 1.3 实现统计卡片（显示生字总数）
- [x] 1.4 实现生字网格（4 列布局，彩色渐变卡片）
- [x] 1.5 实现底部提示区域
- [x] 1.6 实现空状态展示（生字本为空时）
- [x] 1.7 在 `pages.json` 注册页面路由

## 2. 更新个人页

- [x] 2.1 添加生字本入口卡片（显示生字数量）
- [x] 2.2 实现点击跳转到生字本页面
- [x] 2.3 从本地存储加载生字本统计数据

## 3. 测试页学习模式

- [x] 3.1 添加 URL 参数解析（`mode` 和 `char`）
- [x] 3.2 实现学习模式判断（`isLearningMode` 计算属性）
- [x] 3.3 学习模式下隐藏进度条和鼓励语
- [x] 3.4 学习模式下修改"我认识"逻辑：从生字本移除并返回
- [x] 3.5 学习模式下修改"不认识"逻辑：直接返回
- [x] 3.6 学习模式下显示米字格汉字、拼音、词组和语音播放按钮

## 4. 数据流集成

- [x] 4.1 在 `result.vue` 保存记录时同步更新生字本
- [x] 4.2 生字本页面 `onShow` 时刷新数据
- [x] 4.3 个人页 `onShow` 时刷新生字本统计

## 5. 验证测试

- [x] 5.1 验证新测试后生字本自动更新
- [x] 5.2 验证学习模式点击"我认识"后生字被移除
- [x] 5.3 验证学习模式点击"不认识"后生字保留
- [x] 5.4 验证生字本去重逻辑正确
- [x] 5.5 验证空状态展示正常

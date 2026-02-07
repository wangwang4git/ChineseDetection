# Tasks: 添加按钮点击音效

## Implementation Tasks

### 1. 新增音频管理工具 [code]
- [x] 创建 `src/utils/audioManager.js`
- [x] 实现 `initAudio()` — 初始化 3 个 InnerAudioContext 实例（button/success/fail）
- [x] 实现 `playSound(type)` — 播放指定类型音效，处理快速连续点击（stop + seek(0) + play）
- [x] 实现 `destroyAudio()` — 销毁所有音频实例
- [x] 所有函数使用 `#ifdef MP-WEIXIN` 条件编译包裹
- [x] 设置 `obeyMuteSwitch = false`（iOS 静音开关兼容）
- [x] 设置 `useWebAudioImplement = true`（短音频性能优化）
- **验证**：模块可正常导入，非微信平台调用无报错

### 2. 测试页集成音效 [code]
- [x] 在 `src/pages/test/test.vue` 中导入 audioManager
- [x] `onLoad` 中调用 `initAudio()`
- [x] `handleKnow` 中调用 `playSound('success')`
- [x] `handleUnknown` 中调用 `playSound('fail')`
- [x] `goToResult` 中调用 `playSound('button')`（熔断弹窗"查看结果"）
- [x] `onUnmounted` 中调用 `destroyAudio()`
- **验证**：点击"我认识"播放 success 音效，"不认识"播放 fail 音效，查看结果播放 button 音效

### 3. 首页集成音效 [code]
- [x] 在 `src/pages/home/home.vue` 中导入 audioManager
- [x] `onMounted` 中调用 `initAudio()`
- [x] `goToPrinciple` 中调用 `playSound('button')`（科学原理链接）
- [x] `startTest` 中调用 `playSound('button')`（开始检测按钮）
- [x] `onUnmounted` 中调用 `destroyAudio()`
- **验证**：点击"开始检测"和"科学原理"链接均播放 button-pressed 音效

### 4. 结果页集成音效 [code]
- [x] 在 `src/pages/result/result.vue` 中导入 audioManager
- [x] `onMounted` 中调用 `initAudio()`
- [x] `endTest` 中调用 `playSound('button')`
- [x] `onUnmounted` 中调用 `destroyAudio()`
- **验证**：点击"结束检测"按钮播放 button-pressed 音效

### 5. 个人页集成音效 [code]
- [x] 在 `src/pages/profile/profile.vue` 中导入 audioManager
- [x] `onMounted` 中调用 `initAudio()`
- [x] `handleAvatarClick` 中调用 `playSound('button')`（头像点击）
- [x] `handleNicknameClick` 中调用 `playSound('button')`（昵称点击）
- [x] `onAgeChange` 中调用 `playSound('button')`（年龄选择）
- [x] `goToAiAssistant` 中调用 `playSound('button')`（AI 辅导按钮）
- [x] `goToDetail` 中调用 `playSound('button')`（历史记录项点击）
- [x] `goToVocabularyNotebook` 中调用 `playSound('button')`（生字本入口）
- [x] `closeGuideModal` 中调用 `playSound('button')`（引导弹窗"我知道了"按钮，仅按钮触发时播放，遮罩层点击不播放）
- [x] `onUnmounted` 中调用 `destroyAudio()`
- **验证**：头像、昵称、年龄、AI 辅导、历史记录、生字本、引导弹窗按钮点击均播放 button 音效

### 6. 生字本页集成音效 [code]
- [x] 在 `src/pages/vocabulary-notebook/vocabulary-notebook.vue` 中导入 audioManager
- [x] `onMounted` 中调用 `initAudio()`
- [x] `goBack` 中调用 `playSound('button')`（返回按钮）
- [x] `handleCharTap` 中调用 `playSound('button')`（生字卡片点击）
- [x] `onUnmounted` 中调用 `destroyAudio()`
- **验证**：返回按钮和生字卡片点击均播放 button 音效

### 7. 历史详情页集成音效 [code]
- [x] 在 `src/pages/history-detail/history-detail.vue` 中导入 audioManager
- [x] `onLoad` 中调用 `initAudio()`
- [x] `goBack` 中调用 `playSound('button')`（返回按钮）
- [x] `onUnmounted` 中调用 `destroyAudio()`
- **验证**：返回按钮点击播放 button 音效

### 8. 科学原理页集成音效 [code]
- [x] 在 `src/pages/science-principle/science-principle.vue` 中导入 audioManager
- [x] `onMounted` 中调用 `initAudio()`
- [x] `goBack` 中调用 `playSound('button')`（返回按钮）
- [x] `onUnmounted` 中调用 `destroyAudio()`
- **验证**：返回按钮点击播放 button 音效

### 9. AI 助手页集成音效 [code]
- [x] 在 `src/pages/ai-assistant/ai-assistant.vue` 中导入 audioManager
- [x] `onMounted` 中调用 `initAudio()`
- [x] `goBack` 中调用 `playSound('button')`（返回按钮）
- [x] `sendMessage` 中调用 `playSound('button')`（发送按钮）
- [x] `onUnmounted` 中调用 `destroyAudio()`
- **验证**：返回按钮和发送按钮点击均播放 button 音效

### 10. TabBar 集成音效 [code]
- [x] 在 `src/components/CustomTabBar.vue` 中导入 audioManager
- [x] `onMounted` 中调用 `initAudio()`
- [x] `switchTab` 中调用 `playSound('button')`
- [x] `onUnmounted` 中调用 `destroyAudio()`
- **验证**：点击 TabBar 切换时播放 button-pressed 音效

### 11. 功能测试 [validation]
- [ ] 测试场景 1：iOS 静音模式下音效仍正常播放
- [ ] 测试场景 2：快速连续点击按钮，音效不叠加
- [ ] 测试场景 3：测试页音效与汉字发音（WechatSI）互不干扰
- [ ] 测试场景 4：H5 环境下无报错、无异常
- [ ] 测试场景 5：所有页面的返回按钮、导航按钮、交互元素均有音效
- [ ] 测试场景 6：弹窗遮罩层点击不播放音效
- **平台**：微信小程序、H5

## Dependencies

- 任务 2-10 依赖任务 1 完成
- 任务 2-10 之间无依赖，可并行

## Notes

- mp3 文件已存在于 `src/static/audio/`，无需额外资源准备
- 测试页已有 WechatSI 发音音频系统，新增音效系统与其独立，互不影响
- `useWebAudioImplement` 需要微信基础库 2.19.0+
- 弹窗遮罩层点击关闭、@tap.stop 阻止冒泡、H5 专属弹窗按钮不播放音效
- CharacterCard/GradientButton 为通用组件，音效由使用它们的父页面负责播放

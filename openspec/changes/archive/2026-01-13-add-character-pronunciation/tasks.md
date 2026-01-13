# add-character-pronunciation Tasks

## Overview

实现检测页汉字发音功能的任务清单，按依赖顺序排列。

## Tasks

### 1. 添加喇叭图标资源

- [x] 在 `assets/` 目录添加喇叭图标 SVG 文件
- [x] 图标命名为 `speaker.svg`
- [x] 确保图标风格与现有设计一致

**验证**: 图标文件存在且可正常显示

---

### 2. 修改检测页模板布局

- [x] 调整 `.character-section` 布局为 flex 横向排列
- [x] 添加喇叭按钮容器，使用 `#ifdef MP-WEIXIN` 条件编译
- [x] 喇叭按钮样式：80rpx 圆形、白色半透明背景
- [x] 添加点击态样式（缩放 0.95）

**验证**: 
- 微信小程序：米字格右侧显示喇叭按钮
- H5：仅显示米字格，无喇叭按钮

---

### 3. 实现音频上下文生命周期管理

- [x] 在 `<script setup>` 中声明 innerAudioContext 变量
- [x] 在 `onMounted` 中创建音频上下文（条件编译）
- [x] 注册 `onError` 错误处理回调
- [x] 在 `onUnmounted` 中销毁音频上下文（条件编译）

**验证**:
- 进入检测页：控制台无报错，音频上下文创建成功
- 离开检测页：资源正确释放

---

### 4. 实现语音合成播放函数

- [x] 使用 `requirePlugin('WechatSI')` 获取插件实例
- [x] 实现 `playPronunciation(char)` 函数
- [x] 调用 `plugin.textToSpeech()` 进行语音合成
- [x] 成功后设置 `innerAudioContext.src` 并播放
- [x] 添加错误处理（静默降级）

**验证**: 调用函数后能正确播放汉字发音

---

### 5. 实现自动播放逻辑

- [x] 使用 `watch` 监听 `currentChar` 变化
- [x] 汉字变化时延时 100ms 后调用 `playPronunciation`
- [x] 播放前先调用 `stop()` 停止当前音频
- [x] 使用条件编译包裹相关代码

**验证**:
- 展示新汉字后约 100ms 自动播放发音
- 快速切换时无音频重叠

---

### 6. 实现手动播放功能

- [x] 为喇叭按钮绑定 `@tap` 事件
- [x] 点击时调用 `playPronunciation(currentChar)`
- [x] 添加按钮点击反馈动画

**验证**: 点击喇叭按钮能重新播放当前汉字发音

---

### 7. 功能测试

- [ ] 微信小程序完整流程测试
  - 进入检测页，验证音频上下文创建
  - 展示汉字，验证自动播放
  - 点击喇叭，验证手动播放
  - 快速答题，验证无音频冲突
  - 离开页面，验证资源释放
- [ ] H5 环境测试
  - 验证无喇叭按钮
  - 验证无控制台报错
  - 验证测试流程正常

**验证**: 所有测试场景通过

---

## Dependencies

```
Task 1 (图标资源)
    │
    └──► Task 2 (模板布局) ──► Task 6 (手动播放)
                                    │
Task 3 (音频上下文) ──► Task 4 (语音合成) ──► Task 5 (自动播放)
                                    │
                                    └──► Task 7 (功能测试)
```

## Parallelizable

- Task 1 和 Task 3 可并行
- Task 2 和 Task 4 可并行（在 Task 1/3 完成后）

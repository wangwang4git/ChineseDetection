# add-word-examples Tasks

## Overview

实现检测页词语示例展示功能的任务清单，按依赖顺序排列。

## Tasks

### 1. 切换汉字数据源

- [x] 修改 `src/api/character.js`，将导入路径从 `top_2500_chars_with_literacy.json` 改为 `top_2500_chars_with_words.json`
- [x] 验证数据结构包含 `words` 字段

**验证**: 调用 `getLayeredTestCharacters` 返回的数据包含 `words` 字段

---

### 2. 扩展 RiceGrid 组件

- [x] 添加 `showBorder` prop，类型 Boolean，默认值 true
- [x] 修改样式，根据 `showBorder` 动态控制边框显示
- [x] 保持向后兼容，现有使用不受影响

**验证**: 
- `showBorder` 未指定时显示金色边框
- `showBorder="false"` 时无边框

---

### 3. 添加词语数据计算属性

- [x] 在 `test.vue` 添加 `currentCharData` computed，获取当前汉字完整数据
- [x] 添加 `currentWords` computed，从 `currentCharData.words` 提取词语列表
- [x] 处理词语数据缺失情况，返回空数组

**验证**: `currentWords` 正确返回当前汉字的两个词语

---

### 4. 实现词语展示区域 UI

- [x] 在主米字格下方添加词语示例区域
- [x] 添加"📚 词语示例"标题
- [x] 使用 v-for 渲染四个小米字格（160rpx）
- [x] 实现两两一组的 flex 布局
- [x] 使用 `v-if` 控制无词语时隐藏

**验证**:
- 有词语数据时正确显示四个小米字格
- 无词语数据时隐藏整个区域

---

### 5. 添加词语展示区域样式

- [x] 定义 `.words-section` 容器样式
- [x] 定义 `.words-title` 标题样式（紫色 #8200DB）
- [x] 定义 `.words-container` flex 布局
- [x] 定义 `.word-group` 词语组样式

**验证**: 样式与 Figma 设计稿一致

---

### 6. 实现词语发音队列播放

- [x] 定义播放队列变量 `playQueue` 和状态 `isPlaying`
- [x] 实现 `playPronunciationQueue(texts)` 函数
- [x] 实现 `playNext()` 函数，从队列取出并播放
- [x] 修改 `onEnded` 回调，播放结束后延时 100ms 播放下一个
- [x] 使用条件编译包裹

**验证**: 发音按顺序播放，间隔约 100ms

---

### 7. 修改自动播放逻辑

- [x] 修改 `watch(currentChar)` 回调
- [x] 构建播放队列：[汉字, 词语1, 词语2]
- [x] 调用 `playPronunciationQueue` 播放

**验证**: 展示新汉字后依次播放汉字和词语发音

---

### 8. 修改手动播放逻辑

- [x] 修改 `handleSpeakerTap` 函数
- [x] 构建播放队列：[当前汉字, 词语1, 词语2]
- [x] 调用 `playPronunciationQueue` 播放

**验证**: 点击喇叭按钮播放完整发音序列

---

### 9. 功能测试

- [ ] 微信小程序完整流程测试
  - 验证词语数据加载
  - 验证词语展示区域渲染
  - 验证发音播放顺序和间隔
  - 验证快速切换时队列中断
- [ ] H5 环境测试
  - 验证词语展示正常
  - 验证无发音相关报错

**验证**: 所有测试场景通过

---

## Dependencies

```
Task 1 (数据源切换)
    │
    └──► Task 3 (计算属性) ──► Task 4 (UI) ──► Task 5 (样式)
                                    │
Task 2 (组件扩展) ──────────────────┘
                                    │
Task 6 (发音队列) ──► Task 7 (自动播放) ──► Task 8 (手动播放)
                                    │
                                    └──► Task 9 (功能测试)
```

## Parallelizable

- Task 1 和 Task 2 和 Task 6 可并行
- Task 3、Task 4、Task 5 需按顺序（依赖 Task 1、2）
- Task 7、Task 8 需按顺序（依赖 Task 6）

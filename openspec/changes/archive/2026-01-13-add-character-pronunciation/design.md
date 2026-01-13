# add-character-pronunciation Design

## Overview

本设计文档描述如何在检测页实现汉字发音功能，包括微信同声传译插件集成、音频上下文管理、自动播放和手动播放交互。

## Architecture

### 组件关系

```
test.vue (检测页)
    │
    ├── innerAudioContext (音频上下文，页面级)
    │
    ├── RiceGrid.vue (米字格组件)
    │
    └── SpeakerButton (喇叭按钮，新增)
```

### 数据流

```
┌─────────────────────────────────────────────────────────────────┐
│                        检测页 (test.vue)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  onLoad ──────────────────────────────────────────────────────► │
│     │                                                            │
│     └── #ifdef MP-WEIXIN                                        │
│            └── createInnerAudioContext()                        │
│                                                                  │
│  currentChar 变化 ────────────────────────────────────────────► │
│     │                                                            │
│     └── watch(currentChar)                                      │
│            └── setTimeout(100ms)                                │
│                   └── playPronunciation(char)                   │
│                          │                                       │
│                          ├── WechatSI.textToSpeech(char)        │
│                          │      └── 返回音频文件路径             │
│                          │                                       │
│                          └── innerAudioContext.src = path       │
│                                 └── innerAudioContext.play()    │
│                                                                  │
│  点击喇叭按钮 ────────────────────────────────────────────────► │
│     │                                                            │
│     └── playPronunciation(currentChar)                          │
│                                                                  │
│  onUnload ────────────────────────────────────────────────────► │
│     │                                                            │
│     └── #ifdef MP-WEIXIN                                        │
│            └── innerAudioContext.destroy()                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. 音频上下文管理

```javascript
// #ifdef MP-WEIXIN
let innerAudioContext = null

// 页面加载时创建
onLoad(() => {
  innerAudioContext = uni.createInnerAudioContext()
  innerAudioContext.onError((err) => {
    console.error('音频播放错误:', err)
  })
})

// 页面卸载时销毁
onUnload(() => {
  if (innerAudioContext) {
    innerAudioContext.stop()
    innerAudioContext.destroy()
    innerAudioContext = null
  }
})
// #endif
```

### 2. 微信同声传译插件调用

```javascript
// #ifdef MP-WEIXIN
const plugin = requirePlugin('WechatSI')

/**
 * 播放汉字发音
 * @param {string} char - 要播放的汉字
 */
const playPronunciation = (char) => {
  if (!char || !innerAudioContext) return
  
  // 先停止当前播放
  innerAudioContext.stop()
  
  // 调用文本转语音
  plugin.textToSpeech({
    lang: 'zh_CN',
    tts: true,
    content: char,
    success: (res) => {
      if (res.filename) {
        innerAudioContext.src = res.filename
        innerAudioContext.play()
      }
    },
    fail: (err) => {
      console.error('语音合成失败:', err)
    }
  })
}
// #endif
```

### 3. 自动播放（展示新汉字时）

```javascript
// 监听当前汉字变化
watch(currentChar, (newChar, oldChar) => {
  if (newChar && newChar !== oldChar) {
    // #ifdef MP-WEIXIN
    // 延时 100ms 后播放，确保 UI 已更新
    setTimeout(() => {
      playPronunciation(newChar)
    }, 100)
    // #endif
  }
})
```

### 4. UI 布局调整

检测页汉字展示区域布局调整：

```
┌─────────────────────────────────────────┐
│                                          │
│      ┌──────────────┐    ┌────┐         │
│      │              │    │ 🔊 │         │
│      │   米字格     │    │    │         │
│      │   (汉字)     │    └────┘         │
│      │              │                    │
│      └──────────────┘                    │
│                                          │
└─────────────────────────────────────────┘
```

喇叭按钮样式：
- 位置：米字格右侧，垂直居中
- 尺寸：80rpx × 80rpx
- 背景：白色半透明 + 圆形
- 图标：喇叭 SVG 或 emoji 🔊
- 点击态：缩放 0.95

### 5. 条件编译策略

| 功能 | 微信小程序 | 其他平台 |
|------|-----------|----------|
| 音频上下文创建/销毁 | ✅ | ❌ 不执行 |
| 自动播放发音 | ✅ | ❌ 不执行 |
| 喇叭按钮显示 | ✅ | ❌ 隐藏 |
| 手动播放 | ✅ | ❌ 不响应 |

## Error Handling

### 插件调用失败
- 静默处理，不影响测试流程
- 控制台输出错误日志便于调试

### 音频播放失败
- 监听 `onError` 事件
- 静默处理，不弹窗打断用户

### 快速切换汉字
- 播放前先调用 `stop()` 停止当前音频
- 避免多个音频重叠播放

## Performance Considerations

1. **音频上下文复用**：整个页面生命周期只创建一个 innerAudioContext
2. **延时播放**：100ms 延时确保 UI 渲染完成，避免卡顿感
3. **资源释放**：页面卸载时及时销毁音频上下文

## Testing Strategy

### 功能测试
1. 进入检测页，验证音频上下文创建
2. 展示汉字后 100ms，验证自动播放
3. 点击喇叭按钮，验证手动播放
4. 快速切换汉字，验证无音频重叠
5. 离开检测页，验证资源释放

### 平台测试
1. 微信小程序：完整功能可用
2. H5：喇叭按钮隐藏，无报错

## Related Specs

- `pages` - 检测页规范
- `components` - 米字格组件规范

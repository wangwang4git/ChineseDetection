# add-word-examples Design

## Overview

本设计文档描述如何在检测页实现词语示例展示功能，包括数据源切换、UI 布局调整和词语发音播放。

## Architecture

### 数据流

```
┌─────────────────────────────────────────────────────────────────┐
│                     数据加载流程                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  character.js                                                    │
│     │                                                            │
│     └── import from 'top_2500_chars_with_words.json'            │
│            │                                                     │
│            └── 数据结构:                                         │
│                  {                                               │
│                    rank_id: number,                              │
│                    char: string,                                 │
│                    words: [string, string],  // 新增字段         │
│                    frequency: number,                            │
│                    ...                                           │
│                  }                                               │
│                                                                  │
│  test.vue                                                        │
│     │                                                            │
│     ├── currentChar (computed) ──────────────────────────────► │
│     │                                                            │
│     └── currentWords (computed) ─────────────────────────────► │
│            │                                                     │
│            └── 从 currentCharData.words 获取                     │
│                  返回 ['词语1', '词语2'] 或 []                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### UI 布局（参考 Figma 设计稿）

```
┌─────────────────────────────────────────┐
│           进度信息区域                    │
├─────────────────────────────────────────┤
│                                          │
│         ┌──────────────┐    ┌────┐      │
│         │              │    │ 🔊 │      │
│         │   主米字格    │    │    │      │
│         │   (488rpx)   │    └────┘      │
│         │              │                 │
│         └──────────────┘                 │
│                                          │
│           📚 词语示例                     │
│                                          │
│    ┌────┬────┐      ┌────┬────┐        │
│    │ 三 │ 子 │      │ 小 │ 三 │        │
│    │160 │160 │      │160 │160 │        │
│    └────┴────┘      └────┴────┘        │
│      词语1            词语2              │
│                                          │
├─────────────────────────────────────────┤
│           操作按钮区域                    │
├─────────────────────────────────────────┤
│           鼓励语区域                      │
└─────────────────────────────────────────┘
```

### 小米字格组件

复用现有 RiceGrid 组件，通过 `size` prop 控制尺寸：
- 主米字格：`size="488"`
- 小米字格：`size="160"`

小米字格样式调整：
- 无金色边框（使用默认白色背景 + 阴影）
- 字体大小按比例缩小

## Implementation Details

### 1. 数据源切换

```javascript
// src/api/character.js
// 修改导入路径
import charactersData from '../static/top_2500_chars_with_words.json'
```

### 2. 词语数据获取

```javascript
// src/pages/test/test.vue

// 当前汉字完整数据（包含 words）
const currentCharData = computed(() => {
  const levelData = currentLevelData.value
  if (!levelData || !levelData.chars[currentLevelIndex.value]) {
    return null
  }
  return levelData.chars[currentLevelIndex.value]
})

// 当前词语列表
const currentWords = computed(() => {
  const charData = currentCharData.value
  if (!charData || !charData.words || charData.words.length < 2) {
    return []
  }
  return charData.words.slice(0, 2)
})
```

### 3. 词语展示区域模板

```vue
<!-- 词语示例区域 -->
<view v-if="currentWords.length === 2" class="words-section">
  <text class="words-title">📚 词语示例</text>
  <view class="words-container">
    <!-- 词语1 -->
    <view class="word-group">
      <RiceGrid 
        v-for="(char, index) in currentWords[0]" 
        :key="'word1-' + index"
        :char="char" 
        :size="160" 
        :showBorder="false"
      />
    </view>
    <!-- 词语2 -->
    <view class="word-group">
      <RiceGrid 
        v-for="(char, index) in currentWords[1]" 
        :key="'word2-' + index"
        :char="char" 
        :size="160" 
        :showBorder="false"
      />
    </view>
  </view>
</view>
```

### 4. RiceGrid 组件扩展

添加 `showBorder` prop 控制是否显示金色边框：

```vue
<script setup>
const props = defineProps({
  char: { type: String, default: '' },
  size: { type: Number, default: 488 },
  showBorder: { type: Boolean, default: true }  // 新增
})
</script>

<style scoped>
.rice-grid {
  /* 动态边框样式 */
  border: v-bind(showBorder ? '7rpx solid #FDC700' : 'none');
}
</style>
```

### 5. 词语发音播放（微信小程序）

```javascript
// #ifdef MP-WEIXIN
// 播放队列
let playQueue = []
let isPlaying = false

/**
 * 播放发音队列
 * @param {Array<string>} texts - 要播放的文本数组
 */
const playPronunciationQueue = (texts) => {
  if (!texts || texts.length === 0 || !innerAudioContext) return
  
  playQueue = [...texts]
  isPlaying = true
  playNext()
}

/**
 * 播放队列中的下一个
 */
const playNext = () => {
  if (playQueue.length === 0) {
    isPlaying = false
    return
  }
  
  const text = playQueue.shift()
  
  plugin.textToSpeech({
    lang: 'zh_CN',
    tts: true,
    content: text,
    success: (res) => {
      if (res.filename) {
        innerAudioContext.src = res.filename
        innerAudioContext.play()
      }
    },
    fail: (err) => {
      console.error('语音合成失败:', err)
      // 失败时继续播放下一个
      setTimeout(playNext, 50)
    }
  })
}

// 监听播放结束，播放下一个
innerAudioContext.onEnded(() => {
  if (isPlaying) {
    setTimeout(playNext, 50)  // 间隔 50ms
  }
})

// 喇叭按钮点击（仅手动播放，无自动播放）
const handleSpeakerTap = () => {
  if (currentChar.value) {
    const texts = [currentChar.value]
    if (currentWords.value.length === 2) {
      texts.push(currentWords.value[0], currentWords.value[1])
    }
    playPronunciationQueue(texts)
  }
}
// #endif
```

### 6. 样式定义

```css
/* 词语示例区域 */
.words-section {
  margin-top: 24rpx;
  margin-bottom: 24rpx;
}

.words-title {
  display: block;
  text-align: center;
  font-size: 28rpx;
  color: #8200DB;
  margin-bottom: 16rpx;
}

.words-container {
  display: flex;
  justify-content: center;
  gap: 48rpx;
}

.word-group {
  display: flex;
  gap: 8rpx;
}
```

## Error Handling

### 词语数据缺失
- 检查 `words` 字段是否存在且长度 >= 2
- 缺失时隐藏词语展示区域，不影响测试流程

### 发音播放失败
- 单个词语发音失败时，继续播放下一个
- 不弹窗打断用户

## Performance Considerations

1. **数据加载**：JSON 文件静态导入，无额外网络请求
2. **组件复用**：小米字格复用 RiceGrid 组件，无额外组件开销
3. **发音队列**：异步播放，不阻塞 UI 交互

## Testing Strategy

### 功能测试
1. 验证词语数据正确加载
2. 验证词语展示区域正确渲染
3. 验证发音播放顺序：汉字 → 词语1 → 词语2
4. 验证间隔时间约 100ms
5. 验证无词语数据时隐藏展示区域

### 平台测试
1. 微信小程序：完整功能可用
2. H5：词语展示可用，发音功能隐藏

## Related Specs

- `pages` - 检测页规范
- `components` - 米字格组件规范
- `character-pronunciation` - 汉字发音规范
- `api` - 汉字接口规范

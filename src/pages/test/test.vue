<template>
  <!-- 检测页 - 汉字认字量检测 -->
  <view class="page-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text class="loading-text">正在准备测试...</text>
    </view>

    <!-- 测试内容 -->
    <view v-else class="test-content">
      <!-- 进度信息 -->
      <view class="progress-section">
        <view class="progress-row">
          <text class="progress-text">第 {{ currentLevelIndex + 1 }} / {{ currentLevelConfig?.testCount }} 个</text>
          <text class="known-count">已认识: {{ totalKnownCount }} 个 ✅</text>
        </view>
        <!-- 进度条 -->
        <view class="progress-bar-container">
          <view class="progress-bar" :style="{ width: progressPercent + '%' }"></view>
        </view>
      </view>

      <!-- 米字格展示汉字 -->
      <view class="character-section">
        <RiceGrid :char="currentChar" :size="488" />
        <!-- #ifdef MP-WEIXIN -->
        <!-- 喇叭按钮 - 点击播放当前汉字发音 -->
        <view class="speaker-btn" @tap="handleSpeakerTap">
          <image class="speaker-icon" src="/assets/speaker.svg" mode="aspectFit" />
        </view>
        <!-- #endif -->
      </view>

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

      <!-- 操作按钮 -->
      <view class="action-section">
        <view class="action-btn btn-know" @tap="handleKnow">
          <text class="btn-text">✅ 我认识</text>
        </view>
        <view class="action-btn btn-unknown" @tap="handleUnknown">
          <text class="btn-text">❌ 不认识</text>
        </view>
      </view>

      <!-- 鼓励语 -->
      <view class="encourage-section">
        <text class="encourage-text">{{ encourageText }}</text>
      </view>
    </view>

    <!-- 熔断提示弹窗 -->
    <view v-if="showFuseModal" class="modal-overlay">
      <view class="modal-content">
        <text class="modal-title">⚠️ 测试提前结束</text>
        <text class="modal-desc">{{ fuseReason }}</text>
        <view class="modal-btn" @tap="goToResult">
          <text class="modal-btn-text">查看结果</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 检测页
 * 展示待测汉字，用户判断是否认识，支持分层测试和动态熔断
 * 微信小程序环境下支持汉字发音功能
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import RiceGrid from '@/components/RiceGrid.vue'
import { getLayeredTestCharacters } from '@/api/character.js'
import { LEVEL_CONFIGS, TOTAL_TEST_COUNT } from '@/utils/levelConfig.js'
import { initLevelResult, checkFuse, generateTestRecord } from '@/utils/calculate.js'

// #ifdef MP-WEIXIN
// 微信同声传译插件
const plugin = requirePlugin('WechatSI')
// 音频上下文
let innerAudioContext = null
// 播放队列
let playQueue = []
let isPlaying = false
// #endif

// 加载状态
const loading = ref(true)

// 测试数据
const levelTestData = ref([])  // 分层测试数据
const currentLevel = ref(1)    // 当前层级 (1-6)
const currentLevelIndex = ref(0) // 当前层级内的测试索引
const levelResults = ref([])   // 各层级测试结果

// 熔断状态
const isFused = ref(false)
const fusedAtLevel = ref(null)
const fuseReason = ref('')
const showFuseModal = ref(false)

// 鼓励语列表
const encourageList = [
  '💪 加油哦！继续努力！',
  '🌟 你真棒！',
  '👏 很不错哦！',
  '🎯 专注一点！',
  '🚀 冲冲冲！',
  '💖 相信自己！'
]
const encourageText = ref(encourageList[0])

// 总测试字数
const totalTestCount = TOTAL_TEST_COUNT

// 当前层级配置
const currentLevelConfig = computed(() => {
  return LEVEL_CONFIGS.find(c => c.level === currentLevel.value)
})

// 当前层级测试数据
const currentLevelData = computed(() => {
  return levelTestData.value.find(l => l.level === currentLevel.value)
})

// 当前汉字
const currentChar = computed(() => {
  const levelData = currentLevelData.value
  if (!levelData || !levelData.chars[currentLevelIndex.value]) {
    return ''
  }
  return levelData.chars[currentLevelIndex.value].char
})

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

// 当前层级结果
const currentLevelResult = computed(() => {
  return levelResults.value.find(r => r.level === currentLevel.value)
})

// 总已认识数
const totalKnownCount = computed(() => {
  return levelResults.value.reduce((sum, r) => sum + r.knownCount, 0)
})

// 总进度
const totalProgress = computed(() => {
  let progress = 0
  for (const result of levelResults.value) {
    if (result.level < currentLevel.value) {
      progress += result.testedChars.length
    } else if (result.level === currentLevel.value) {
      progress += currentLevelIndex.value + 1
    }
  }
  return Math.min(progress, totalTestCount)
})

// 进度百分比
const progressPercent = computed(() => {
  return Math.round((totalProgress.value / totalTestCount) * 100)
})

/**
 * 初始化测试
 */
const initTest = async () => {
  loading.value = true
  
  try {
    // 获取分层测试汉字
    const res = await getLayeredTestCharacters()
    if (res.errCode === 0) {
      levelTestData.value = res.data.levels
      console.log('初始化汉字:', levelTestData.value)
      
      // 初始化各层级结果
      levelResults.value = LEVEL_CONFIGS.map(config => initLevelResult(config.level))
      
      loading.value = false
    } else {
      uni.showToast({ title: res.errMsg, icon: 'none' })
    }
  } catch (e) {
    console.error('初始化测试失败:', e)
    uni.showToast({ title: '加载失败，请重试', icon: 'none' })
  }
}

/**
 * 处理"我认识"
 */
const handleKnow = () => {
  recordAnswer(true)
}

/**
 * 处理"不认识"
 */
const handleUnknown = () => {
  recordAnswer(false)
}

/**
 * 记录答案
 */
const recordAnswer = (isKnown) => {
  const levelData = currentLevelData.value
  const result = currentLevelResult.value
  
  if (!levelData || !result) return
  
  const charData = levelData.chars[currentLevelIndex.value]
  
  // 记录测试结果
  result.testedChars.push({
    char: charData.char,
    rank_id: charData.rank_id,
    isKnown,
    level: currentLevel.value
  })
  
  if (isKnown) {
    result.knownCount++
    result.consecutiveUnknown = 0
  } else {
    result.unknownCount++
    result.consecutiveUnknown++
  }
  
  // 检查熔断
  const fuseCheck = checkFuse(result)
  if (fuseCheck.isFused) {
    triggerFuse(fuseCheck.reason)
    return
  }
  
  // 更新鼓励语
  updateEncourage()
  
  // 下一个汉字
  nextChar()
}

/**
 * 触发熔断
 */
const triggerFuse = (reason) => {
  isFused.value = true
  fusedAtLevel.value = currentLevel.value
  fuseReason.value = reason
  
  // 标记当前层级为熔断
  const result = currentLevelResult.value
  if (result) {
    result.isFused = true
  }
  
  showFuseModal.value = true
}

/**
 * 下一个汉字
 */
const nextChar = () => {
  const levelData = currentLevelData.value
  
  // 检查当前层级是否完成
  if (currentLevelIndex.value + 1 >= levelData.chars.length) {
    // 标记当前层级完成
    const result = currentLevelResult.value
    if (result) {
      result.isCompleted = true
    }
    
    // 检查是否还有下一层级
    if (currentLevel.value < 6) {
      currentLevel.value++
      currentLevelIndex.value = 0
    } else {
      // 所有层级完成
      goToResult()
    }
  } else {
    currentLevelIndex.value++
  }
}

/**
 * 更新鼓励语
 */
const updateEncourage = () => {
  const randomIndex = Math.floor(Math.random() * encourageList.length)
  encourageText.value = encourageList[randomIndex]
}

/**
 * 跳转到结果页
 */
const goToResult = () => {
  showFuseModal.value = false
  
  // 生成检测记录
  const record = generateTestRecord(levelResults.value, isFused.value, fusedAtLevel.value)
  
  // 将记录数据传递到结果页
  uni.navigateTo({
    url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify(record))}`
  })
}

// 页面加载时初始化
onMounted(() => {
  initTest()
  
  // #ifdef MP-WEIXIN
  // 创建音频上下文
  innerAudioContext = uni.createInnerAudioContext()
  // 不遵循系统静音开关，确保即使静音模式也能播放
  innerAudioContext.obeyMuteSwitch = false
  // 设置音量
  innerAudioContext.volume = 1
  
  innerAudioContext.onError((err) => {
    console.error('音频播放错误:', err)
  })
  
  // 监听播放开始（调试用）
  innerAudioContext.onPlay(() => {
    console.log('音频开始播放')
  })
  
  // 监听播放结束
  innerAudioContext.onEnded(() => {
    console.log('音频播放结束')
    // 播放队列中的下一个
    if (isPlaying && playQueue.length > 0) {
      setTimeout(playNext, 50)  // 间隔 50ms
    } else {
      isPlaying = false
    }
  })
  // #endif
})

// #ifdef MP-WEIXIN
/**
 * 播放队列中的下一个
 */
const playNext = () => {
  if (playQueue.length === 0) {
    isPlaying = false
    return
  }
  
  const text = playQueue.shift()
  console.log('播放下一个:', text)
  
  plugin.textToSpeech({
    lang: 'zh_CN',
    tts: true,
    content: text,
    success: (res) => {
      console.log('语音合成成功:', res)
      if (res.filename) {
        innerAudioContext.src = res.filename
        innerAudioContext.play()
      } else {
        // 无音频文件，继续下一个
        setTimeout(playNext, 50)
      }
    },
    fail: (err) => {
      console.error('语音合成失败:', err)
      // 失败时继续播放下一个
      setTimeout(playNext, 50)
    }
  })
}

/**
 * 播放发音队列
 * @param {Array<string>} texts - 要播放的文本数组
 */
const playPronunciationQueue = (texts) => {
  if (!texts || texts.length === 0 || !innerAudioContext) return
  
  // 停止当前播放
  innerAudioContext.stop()
  
  // 设置队列并开始播放
  playQueue = [...texts]
  isPlaying = true
  
  console.log('开始播放队列:', playQueue)
  playNext()
}

/**
 * 处理喇叭按钮点击 - 手动播放当前汉字和词语发音
 */
const handleSpeakerTap = () => {
  if (currentChar.value) {
    const texts = [currentChar.value]
    if (currentWords.value.length === 2) {
      texts.push(currentWords.value[0], currentWords.value[1])
    }
    playPronunciationQueue(texts)
  }
}

// 监听当前汉字变化，自动播放发音
watch(currentChar, (newChar, oldChar) => {
  if (newChar && newChar !== oldChar) {
    // 延时 100ms 后播放，确保 UI 已更新
    setTimeout(() => {
      const texts = [newChar]
      if (currentWords.value.length === 2) {
        texts.push(currentWords.value[0], currentWords.value[1])
      }
      playPronunciationQueue(texts)
    }, 100)
  }
})

// 页面卸载时销毁音频上下文
onUnmounted(() => {
  if (innerAudioContext) {
    innerAudioContext.stop()
    innerAudioContext.destroy()
    innerAudioContext = null
  }
})
// #endif
</script>

<style scoped>
/* 页面容器 - 粉紫蓝渐变背景 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
  padding: 0 32rpx;
  padding-top: calc(120rpx + env(safe-area-inset-top));
  box-sizing: border-box;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.loading-text {
  font-size: 32rpx;
  color: #6E11B0;
}

/* 测试内容 */
.test-content {
  padding-top: 24rpx;
}

/* 进度区域 */
.progress-section {
  margin-bottom: 32rpx;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.progress-text {
  font-size: 28rpx;
  color: #6E11B0;
  font-weight: 400;
}

.known-count {
  font-size: 28rpx;
  color: #6E11B0;
  font-weight: 400;
}

/* 进度条 - 白色半透明背景 + 紫色边框 */
.progress-bar-container {
  height: 24rpx;
  background: rgba(255, 255, 255, 0.50);
  border-radius: 9999rpx;
  border: 3rpx solid #DAB2FF;
  overflow: hidden;
  padding: 3rpx;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FDA5D5 0%, #DAB2FF 50%, #8EC5FF 100%);
  border-radius: 9999rpx;
  transition: width 0.3s ease;
}

/* 汉字展示区域 */
.character-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 48rpx 0;
  gap: 24rpx;
}

/* 喇叭按钮 */
.speaker-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.speaker-btn:active {
  transform: scale(0.95);
}

.speaker-icon {
  width: 48rpx;
  height: 48rpx;
}

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

/* 操作按钮 - 胶囊形状 */
.action-section {
  display: flex;
  justify-content: center;
  gap: 32rpx;
  margin-bottom: 32rpx;
  padding: 0 16rpx;
}

.action-btn {
  flex: 1;
  max-width: 374rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30rpx 0;
  border-radius: 9999rpx;
  border: 7rpx solid #ffffff;
  box-shadow: 0 50rpx 100rpx -24rpx rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
}

.action-btn:active {
  transform: scale(0.98);
}

/* 我认识按钮 - 绿色渐变 */
.btn-know {
  background: linear-gradient(90deg, #05DF72 0%, #00C950 100%);
}

/* 不认识按钮 - 橙红渐变 */
.btn-unknown {
  background: linear-gradient(90deg, #FF8904 0%, #FF6467 100%);
}

.btn-text {
  font-size: 36rpx;
  font-weight: 500;
  color: #ffffff;
}

/* 鼓励语 */
.encourage-section {
  text-align: center;
  padding: 24rpx 0;
}

.encourage-text {
  font-size: 36rpx;
  color: #6E11B0;
  font-weight: 400;
}

/* 熔断弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 80%;
  background: #ffffff;
  border-radius: 32rpx;
  padding: 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #6E11B0;
  margin-bottom: 16rpx;
}

.modal-desc {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 32rpx;
  text-align: center;
}

.modal-btn {
  width: 100%;
  padding: 24rpx 0;
  background: linear-gradient(90deg, #51A2FF 0%, #C27AFF 100%);
  border-radius: 9999rpx;
  text-align: center;
}

.modal-btn-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}
</style>

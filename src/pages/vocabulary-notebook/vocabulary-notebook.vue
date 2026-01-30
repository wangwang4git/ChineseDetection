<template>
  <!-- 生字本页面 - 展示用户需要学习的汉字 -->
  <view class="page-container">
    <!-- 顶部返回按钮 -->
    <view class="back-btn" @tap="goBack">
      <text class="back-text">← 返回</text>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card">
      <text class="stats-emoji">📖</text>
      <text class="stats-desc">这里收录了所有不认识的汉字</text>
      <view class="stats-count-row">
        <text class="stats-label">共</text>
        <text class="stats-number">{{ vocabularyCount }}</text>
        <text class="stats-label">个生字需要学习</text>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="vocabularyCount === 0" class="empty-state">
      <text class="empty-emoji">🎉</text>
      <text class="empty-text">太棒了！没有需要学习的生字</text>
    </view>

    <!-- 生字网格 -->
    <view v-else class="vocabulary-grid">
      <view 
        v-for="(char, index) in vocabularyChars" 
        :key="index"
        class="char-card"
        :style="{ background: getCardBackground(index) }"
        @tap="handleCharTap(char)"
      >
        <text class="char-text">{{ char }}</text>
      </view>
    </view>

    <!-- 底部提示 -->
    <view v-if="vocabularyCount > 0" class="tip-section">
      <text class="tip-emoji">💡</text>
      <text class="tip-text">点击汉字可以进行测试学习</text>
    </view>
  </view>
</template>

<script setup>
/**
 * 生字本页面
 * 展示用户需要学习的所有汉字
 * 支持点击进入学习模式
 */
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
// #ifdef MP-WEIXIN
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
// #endif
import { 
  getVocabularyNotebook, 
  initVocabularyNotebook 
} from '@/utils/storage.js'
import { 
  getVocabularyNotebookShareConfig, 
  getVocabularyNotebookTimelineConfig 
} from '@/utils/share.js'

// 生字本数据
const notebook = ref(null)

// 生字列表
const vocabularyChars = computed(() => {
  return notebook.value?.chars || []
})

// 生字数量
const vocabularyCount = computed(() => {
  return vocabularyChars.value.length
})

// #ifdef MP-WEIXIN
/**
 * 分享给好友
 * 根据当前生字数量生成分享内容
 */
onShareAppMessage(() => {
  return getVocabularyNotebookShareConfig(vocabularyCount.value)
})

/**
 * 分享到朋友圈
 * 根据当前生字数量生成分享内容
 */
onShareTimeline(() => {
  return getVocabularyNotebookTimelineConfig(vocabularyCount.value)
})
// #endif

// 卡片渐变背景色（循环使用4种颜色）
const cardBackgrounds = [
  'linear-gradient(135deg, #FFE5E5 0%, white 100%)',  // 粉色
  'linear-gradient(135deg, #E5F5FF 0%, white 100%)',  // 蓝色
  'linear-gradient(135deg, #FFE5F5 0%, white 100%)',  // 粉紫色
  'linear-gradient(135deg, #FFFBE5 0%, white 100%)'   // 黄色
]

/**
 * 获取卡片背景色
 * @param {number} index - 卡片索引
 */
const getCardBackground = (index) => {
  return cardBackgrounds[index % 4]
}

/**
 * 加载生字本数据
 */
const loadVocabulary = () => {
  let data = getVocabularyNotebook()
  
  // 如果生字本不存在，从历史记录初始化
  if (!data) {
    data = initVocabularyNotebook()
  }
  
  notebook.value = data
  console.log('生字本数据:', data)
}

/**
 * 点击汉字卡片 - 进入学习模式
 * @param {string} char - 汉字
 */
const handleCharTap = (char) => {
  uni.navigateTo({
    url: `/pages/test/test?mode=vocabulary-learning&char=${encodeURIComponent(char)}`
  })
}

/**
 * 返回上一页
 */
const goBack = () => {
  uni.navigateBack()
}

// 页面每次显示时刷新数据
onShow(() => {
  loadVocabulary()
})
</script>

<style scoped>
/* 页面容器 - 粉紫蓝渐变背景 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
  padding: 0 32rpx;
  padding-top: calc(64rpx + env(safe-area-inset-top));
  padding-bottom: 48rpx;
  box-sizing: border-box;
}

/* 返回按钮 */
.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 18rpx 36rpx;
  background: rgba(255, 255, 255, 0.90);
  border-radius: 9999rpx;
  border: 3rpx solid #DAB2FF;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 24rpx;
}

.back-btn:active {
  transform: scale(0.95);
  opacity: 0.9;
}

.back-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #6E11B0;
}

/* 统计卡片 */
.stats-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(90deg, #FDA5D5 0%, #DAB2FF 50%, #8EC5FF 100%);
  border-radius: 32rpx;
  padding: 40rpx;
  border: 7rpx solid white;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 40rpx;
}

.stats-emoji {
  font-size: 60rpx;
  margin-bottom: 12rpx;
}

.stats-desc {
  font-size: 28rpx;
  color: white;
  margin-bottom: 16rpx;
}

.stats-count-row {
  display: flex;
  align-items: baseline;
}

.stats-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.stats-number {
  font-size: 36rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 8rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
}

.empty-emoji {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #6E11B0;
}

/* 生字网格 - 4列布局 */
.vocabulary-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

/* 生字卡片 */
.char-card {
  width: calc((100% - 72rpx) / 4);
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 28rpx;
  border: 3rpx solid #FDA5D5;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.char-card:active {
  transform: scale(0.95);
}

.char-text {
  font-size: 60rpx;
  color: #1E2939;
}

/* 底部提示 */
.tip-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
  padding: 32rpx;
  background: rgba(254, 249, 194, 0.80);
  border-radius: 28rpx;
  border: 3rpx solid #FFDF20;
}

.tip-emoji {
  font-size: 28rpx;
  margin-right: 16rpx;
}

.tip-text {
  font-size: 28rpx;
  color: #364153;
}
</style>

<template>
  <!-- 结果页 - 检测结果展示 -->
  <view class="page-container">
    <!-- 完成图标 -->
    <view class="complete-section">
      <text class="complete-emoji">🎊</text>
      <text class="complete-title">检测完成！</text>
    </view>

    <!-- 结果卡片 - 金黄渐变 -->
    <view class="result-card">
      <text class="result-label">你的认字量大约是</text>
      <text class="result-value">{{ record.estimatedVocabulary }}</text>
      <text class="result-unit">个汉字 📚</text>
    </view>

    <!-- 不认识的汉字 -->
    <view v-if="record.unknownChars && record.unknownChars.length > 0" class="unknown-section">
      <text class="section-title">📝 需要加强的汉字</text>
      <view class="char-list">
        <CharacterCard 
          v-for="(char, index) in record.unknownChars" 
          :key="index"
          :char="char"
        />
      </view>
    </view>

    <!-- 鼓励语 -->
    <view class="encourage-section">
      <text class="encourage-text">{{ encourageMessage }}</text>
    </view>

    <!-- 结束按钮 -->
    <view class="action-section">
      <view class="end-btn" @tap="endTest">
        <text class="btn-text">🏠 结束检测</text>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
/**
 * 结果页
 * 展示检测结果，包括预估认字量、分层详情和不认识的汉字列表
 */
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
// #ifdef MP-WEIXIN
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
// #endif
import CharacterCard from '@/components/CharacterCard.vue'
import { addRecord } from '@/api/record.js'
import { getEncouragementMessage } from '@/utils/calculate.js'
import { getResultShareConfig, getResultTimelineConfig } from '@/utils/share.js'
import { addToVocabularyNotebook } from '@/utils/storage.js'

// 检测记录
const record = ref({
  id: '',
  testTime: '',
  totalTestedCount: 0,
  estimatedVocabulary: 0,
  levelDetails: [],
  unknownChars: [],
  isFused: false,
  fusedAtLevel: null
})

// 鼓励语
const encourageMessage = computed(() => {
  return getEncouragementMessage(record.value.estimatedVocabulary)
})

/**
 * 页面加载
 */
onLoad((options) => {
  if (options.data) {
    try {
      record.value = JSON.parse(decodeURIComponent(options.data))
    } catch (e) {
      console.error('解析数据失败:', e)
    }
  }
})

// #ifdef MP-WEIXIN
/**
 * 分享给好友 - 包含检测结果
 */
onShareAppMessage(() => {
  return getResultShareConfig(record.value.estimatedVocabulary)
})

/**
 * 分享到朋友圈 - 包含检测结果
 */
onShareTimeline(() => {
  return getResultTimelineConfig(record.value.estimatedVocabulary)
})
// #endif

/**
 * 结束检测
 */
const endTest = async () => {
  // 保存记录
  try {
    await addRecord(record.value)
    
    // 同步更新生字本（将不认识的汉字加入生字本）
    if (record.value.unknownChars && record.value.unknownChars.length > 0) {
      addToVocabularyNotebook(record.value.unknownChars)
      console.log('生字本已更新，新增:', record.value.unknownChars)
    }
  } catch (e) {
    console.error('保存记录失败:', e)
  }

  // 返回首页
  uni.switchTab({
    url: '/pages/home/home'
  })
}
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

.safe-area-bottom {
  height: calc(32rpx + env(safe-area-inset-bottom));
}

/* 完成区域 */
.complete-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx 0;
}

.complete-emoji {
  font-size: 96rpx;
  margin-bottom: 16rpx;
}

.complete-title {
  font-size: 48rpx;
  font-weight: 500;
  color: #6E11B0;
}

/* 结果卡片 - 金黄渐变 */
.result-card {
  background: linear-gradient(135deg, #FFF085 0%, #FFD6A7 100%);
  border-radius: 32rpx;
  border: 7rpx solid #FDC700;
  padding: 72rpx 40rpx;
  text-align: center;
  box-shadow: 0 50rpx 100rpx -24rpx rgba(0, 0, 0, 0.25);
  margin-bottom: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-label {
  font-size: 36rpx;
  color: #364153;
  display: block;
  margin-bottom: 12rpx;
}

.result-value {
  font-size: 96rpx;
  font-weight: 400;
  color: #9810FA;
  letter-spacing: 1rpx;
}

.result-unit {
  font-size: 40rpx;
  color: #364153;
  margin-top: 8rpx;
}

/* 不认识的汉字区域 */
.unknown-section {
  background: rgba(255, 255, 255, 0.90);
  border-radius: 32rpx;
  border: 7rpx solid #FDA5D5;
  padding: 56rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 16rpx 20rpx -12rpx rgba(0, 0, 0, 0.10), 0 40rpx 50rpx -10rpx rgba(0, 0, 0, 0.10);
}

.section-title {
  font-size: 36rpx;
  font-weight: 500;
  color: #6E11B0;
  display: block;
  margin-bottom: 28rpx;
  text-align: center;
}

.char-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 24rpx;
}

/* 鼓励语 */
.encourage-section {
  text-align: center;
  padding: 32rpx 0;
}

.encourage-text {
  font-size: 36rpx;
  color: #6E11B0;
  font-weight: 400;
}

/* 操作按钮 */
.action-section {
  margin-top: 16rpx;
  display: flex;
  justify-content: center;
}

/* 结束按钮 - 蓝紫渐变 */
.end-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 460rpx;
  padding: 38rpx 0;
  background: linear-gradient(90deg, #51A2FF 0%, #C27AFF 100%);
  border-radius: 9999rpx;
  border: 7rpx solid #ffffff;
  box-shadow: 0 50rpx 100rpx -24rpx rgba(0, 0, 0, 0.25);
}

.end-btn:active {
  transform: scale(0.98);
}

.btn-text {
  font-size: 36rpx;
  font-weight: 500;
  color: #ffffff;
}
</style>

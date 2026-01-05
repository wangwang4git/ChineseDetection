<template>
  <!-- 结果页 - 检测结果展示 -->
  <view class="page-container">
    <!-- 顶部安全区域 -->
    <view class="safe-area-top"></view>

    <!-- 完成图标 -->
    <view class="complete-section">
      <text class="complete-emoji">🎊</text>
      <text class="complete-title">检测完成！</text>
    </view>

    <!-- 熔断提示 -->
    <view v-if="record.isFused" class="fuse-notice">
      <text class="fuse-text">⚠️ 测试在 L{{ record.fusedAtLevel }} 层级提前结束</text>
    </view>

    <!-- 结果卡片 -->
    <view class="result-card">
      <text class="result-label">你的认字量大约是</text>
      <view class="result-value-row">
        <text class="result-value">{{ record.estimatedVocabulary }}</text>
        <text class="result-unit">个汉字 📚</text>
      </view>
    </view>

    <!-- 分层详情 -->
    <view class="level-detail-section">
      <text class="section-title">📊 分层测试详情</text>
      <view class="level-list">
        <view 
          v-for="detail in record.levelDetails" 
          :key="detail.level"
          class="level-item"
          :class="{ 'level-fused': detail.isFused }"
        >
          <text class="level-name">L{{ detail.level }}</text>
          <text class="level-score">{{ detail.knownCount }}/{{ detail.testedCount }}</text>
          <text v-if="detail.isFused" class="level-fuse-tag">熔断</text>
          <text v-else-if="detail.testedCount === 0" class="level-skip-tag">未测</text>
        </view>
      </view>
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
import CharacterCard from '@/components/CharacterCard.vue'
import { addRecord } from '@/api/record.js'
import { getEncouragementMessage } from '@/utils/calculate.js'

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

/**
 * 结束检测
 */
const endTest = async () => {
  // 保存记录
  try {
    await addRecord(record.value)
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
.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffecd2 0%, #fcb69f 50%, #ee9ca7 100%);
  padding: 0 32rpx;
  box-sizing: border-box;
}

.safe-area-top {
  height: 44rpx;
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
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.complete-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333333;
}

/* 熔断提示 */
.fuse-notice {
  background: rgba(255, 193, 7, 0.2);
  border: 2rpx solid #ffc107;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 24rpx;
  text-align: center;
}

.fuse-text {
  font-size: 26rpx;
  color: #856404;
}

/* 结果卡片 */
.result-card {
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
  border-radius: 24rpx;
  padding: 40rpx;
  text-align: center;
  box-shadow: 0 8rpx 32rpx rgba(245, 175, 25, 0.4);
  margin-bottom: 32rpx;
}

.result-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  margin-bottom: 16rpx;
}

.result-value-row {
  display: flex;
  justify-content: center;
  align-items: baseline;
}

.result-value {
  font-size: 96rpx;
  font-weight: bold;
  color: #ffffff;
}

.result-unit {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 12rpx;
}

/* 分层详情 */
.level-detail-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  margin-bottom: 20rpx;
}

.level-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.level-item {
  display: flex;
  align-items: center;
  background: #f0f0f0;
  border-radius: 12rpx;
  padding: 12rpx 20rpx;
  gap: 12rpx;
}

.level-fused {
  background: rgba(255, 193, 7, 0.2);
}

.level-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #667eea;
}

.level-score {
  font-size: 26rpx;
  color: #333333;
}

.level-fuse-tag {
  font-size: 22rpx;
  color: #856404;
  background: #ffc107;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.level-skip-tag {
  font-size: 22rpx;
  color: #999999;
}

/* 不认识的汉字 */
.unknown-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.char-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

/* 鼓励语 */
.encourage-section {
  text-align: center;
  padding: 24rpx 0;
}

.encourage-text {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
}

/* 操作按钮 */
.action-section {
  margin-top: 16rpx;
}

.end-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 32rpx 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
}

.end-btn:active {
  transform: scale(0.98);
}

.btn-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
}
</style>

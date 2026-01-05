<template>
  <!-- 历史详情页 -->
  <view class="page-container">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="back-btn" @tap="goBack">
        <text class="back-text">← 返回</text>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 详情内容 -->
    <view v-else-if="record" class="detail-content">
      <!-- 检测信息卡片 -->
      <view class="info-card">
        <text class="info-time">{{ formatTime(record.testTime) }}</text>
        <text class="info-label">当时的认字量</text>
        <view class="info-value-row">
          <text class="info-value">{{ record.estimatedVocabulary }}</text>
          <text class="info-unit">个汉字 📚</text>
        </view>
        <view v-if="record.isFused" class="fuse-tag">
          <text class="fuse-text">⚠️ 在 L{{ record.fusedAtLevel }} 层级提前结束</text>
        </view>
      </view>

      <!-- 分层详情 -->
      <view v-if="record.levelDetails" class="level-section">
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
          </view>
        </view>
      </view>

      <!-- 不认识的汉字 -->
      <view v-if="record.unknownChars && record.unknownChars.length > 0" class="unknown-section">
        <text class="section-title">📝 当时不认识的汉字</text>
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
        <text class="encourage-text">💪 现在都认识这些字了吗？</text>
        <text class="encourage-sub">继续努力，你一定会越来越棒！</text>
      </view>
    </view>

    <!-- 无数据 -->
    <view v-else class="empty-state">
      <text class="empty-text">记录不存在</text>
    </view>
  </view>
</template>

<script setup>
/**
 * 历史详情页
 * 展示单次检测的完整信息
 */
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import CharacterCard from '@/components/CharacterCard.vue'
import { getRecordDetail } from '@/api/record.js'
import { formatDateTime } from '@/utils/index.js'

// 加载状态
const loading = ref(true)

// 记录详情
const record = ref(null)

/**
 * 格式化时间
 */
const formatTime = (time) => {
  return formatDateTime(time, 'YYYY-MM-DD HH:mm')
}

/**
 * 返回上一页
 */
const goBack = () => {
  uni.navigateBack()
}

/**
 * 加载记录详情
 */
const loadDetail = async (id) => {
  loading.value = true
  
  try {
    const res = await getRecordDetail(id)
    if (res.errCode === 0) {
      record.value = res.data
    } else {
      uni.showToast({ title: res.errMsg, icon: 'none' })
    }
  } catch (e) {
    console.error('加载详情失败:', e)
  } finally {
    loading.value = false
  }
}

/**
 * 页面加载
 */
onLoad((options) => {
  if (options.id) {
    loadDetail(options.id)
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffecd2 0%, #fcb69f 50%, #ee9ca7 100%);
  padding: 0 32rpx;
  box-sizing: border-box;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 导航栏 */
.nav-bar {
  padding: 24rpx 0;
  padding-top: calc(24rpx + env(safe-area-inset-top));
}

.back-btn {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 32rpx;
}

.back-btn:active {
  opacity: 0.8;
}

.back-text {
  font-size: 28rpx;
  color: #667eea;
  font-weight: 500;
}

/* 加载状态 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.loading-text {
  font-size: 30rpx;
  color: #666666;
}

/* 详情内容 */
.detail-content {
  padding-bottom: 32rpx;
}

/* 信息卡片 */
.info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 32rpx;
  text-align: center;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
  margin-bottom: 24rpx;
}

.info-time {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 16rpx;
}

.info-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
  margin-bottom: 12rpx;
}

.info-value-row {
  display: flex;
  justify-content: center;
  align-items: baseline;
}

.info-value {
  font-size: 80rpx;
  font-weight: bold;
  color: #ffffff;
}

.info-unit {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 12rpx;
}

.fuse-tag {
  margin-top: 16rpx;
  background: rgba(255, 193, 7, 0.3);
  border-radius: 12rpx;
  padding: 8rpx 16rpx;
  display: inline-block;
}

.fuse-text {
  font-size: 24rpx;
  color: #ffffff;
}

/* 分层详情 */
.level-section {
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
  padding: 32rpx 0;
}

.encourage-text {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;
}

.encourage-sub {
  font-size: 26rpx;
  color: #666666;
}

/* 空状态 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.empty-text {
  font-size: 30rpx;
  color: #999999;
}
</style>

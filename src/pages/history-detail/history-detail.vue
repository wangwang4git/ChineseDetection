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
      <!-- 检测信息卡片 - 粉紫蓝渐变 -->
      <view class="info-card">
        <text class="info-time">检测时间：{{ formatTime(record.testTime) }}</text>
        <text class="info-label">当时的认字量</text>
        <text class="info-value">{{ record.estimatedVocabulary }}</text>
        <text class="info-unit">个汉字 📚</text>
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
/* 页面容器 - 粉紫蓝渐变背景 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
  padding: 0 32rpx;
  box-sizing: border-box;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 导航栏 */
.nav-bar {
  padding: 24rpx 0;
  padding-top: calc(24rpx + env(safe-area-inset-top));
}

/* 返回按钮 - 白色背景 + 紫色边框 */
.back-btn {
  display: inline-flex;
  align-items: center;
  padding: 20rpx 36rpx;
  background: rgba(255, 255, 255, 0.90);
  border-radius: 9999rpx;
  border: 3rpx solid #DAB2FF;
  box-shadow: 0 8rpx 12rpx -8rpx rgba(0, 0, 0, 0.10), 0 20rpx 30rpx -6rpx rgba(0, 0, 0, 0.10);
}

.back-btn:active {
  opacity: 0.8;
}

.back-text {
  font-size: 32rpx;
  color: #6E11B0;
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
  color: #6E11B0;
}

/* 详情内容 */
.detail-content {
  padding-bottom: 32rpx;
}

/* 信息卡片 - 粉紫蓝渐变 + 白色边框 */
.info-card {
  background: linear-gradient(90deg, #FDA5D5 0%, #DAB2FF 50%, #8EC5FF 100%);
  border-radius: 32rpx;
  border: 7rpx solid #ffffff;
  padding: 56rpx 56rpx;
  text-align: center;
  box-shadow: 0 50rpx 100rpx -24rpx rgba(0, 0, 0, 0.25);
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-time {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.90);
  display: block;
  margin-bottom: 16rpx;
}

.info-label {
  font-size: 36rpx;
  color: #ffffff;
  display: block;
  margin-bottom: 12rpx;
}

.info-value {
  font-size: 72rpx;
  font-weight: 400;
  color: #ffffff;
  letter-spacing: 1rpx;
}

.info-unit {
  font-size: 36rpx;
  color: #ffffff;
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
  display: block;
  margin-bottom: 12rpx;
}

.encourage-sub {
  font-size: 32rpx;
  color: #9810FA;
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
  color: #6E11B0;
}
</style>

<template>
  <!-- 首页 - 汉字认字量检测 -->
  <view class="page-container">
    <!-- 顶部安全区域 -->
    <view class="safe-area-top"></view>
    
    <!-- 欢迎区域 -->
    <view class="welcome-section">
      <text class="welcome-emoji">📚</text>
      <text class="welcome-title">汉字认字量检测</text>
      <text class="welcome-subtitle">一起来测测认识多少字吧！</text>
    </view>

    <!-- 年龄段认字量参考卡片 -->
    <view class="reference-section">
      <text class="section-title">📊 各年龄段认字量参考</text>
      
      <view class="card-list">
        <view 
          v-for="(item, index) in ageReferences" 
          :key="index"
          class="reference-card"
          :style="{ background: cardColors[index] }"
        >
          <view class="card-left">
            <text class="card-age">{{ item.age }}</text>
            <text class="card-desc">{{ item.description }}</text>
          </view>
          <view class="card-right">
            <text class="card-range">{{ item.min }}-{{ item.max }}</text>
            <text class="card-unit">字</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 开始检测按钮 -->
    <view class="action-section">
      <view class="start-btn" @tap="startTest">
        <text class="btn-text">🚀 开始检测吧！🎉</text>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
/**
 * 首页
 * 展示不同年龄段的认字量参考区间，引导用户开始检测
 */
import { ref } from 'vue'
import { AGE_LITERACY_REFERENCE } from '@/utils/levelConfig.js'

// 年龄段认字量参考数据
const ageReferences = ref(AGE_LITERACY_REFERENCE)

// 卡片渐变色
const cardColors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
]

/**
 * 开始检测
 */
const startTest = () => {
  uni.navigateTo({
    url: '/pages/test/test'
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
  height: 88rpx;
}

.safe-area-bottom {
  height: calc(120rpx + env(safe-area-inset-bottom));
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.welcome-emoji {
  font-size: 80rpx;
  margin-bottom: 16rpx;
}

.welcome-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 12rpx;
}

.welcome-subtitle {
  font-size: 28rpx;
  color: #666666;
}

/* 参考区域 */
.reference-section {
  margin-top: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24rpx;
  display: block;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.reference-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 32rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.card-left {
  display: flex;
  flex-direction: column;
}

.card-age {
  font-size: 32rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.card-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.card-right {
  display: flex;
  align-items: baseline;
}

.card-range {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
}

.card-unit {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-left: 8rpx;
}

/* 操作区域 */
.action-section {
  margin-top: 48rpx;
  display: flex;
  justify-content: center;
}

.start-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 32rpx 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50rpx;
  box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4);
  transition: transform 0.2s ease;
}

.start-btn:active {
  transform: scale(0.98);
}

.btn-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
}
</style>

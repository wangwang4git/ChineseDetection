<template>
  <!-- 首页 - 汉字认字量检测 v2.0 -->
  <view class="page-container">
    <!-- 顶部安全区域 -->
    <view class="safe-area-top"></view>
    
    <!-- Banner 图片 -->
    <view class="banner-section">
      <image 
        class="banner-image" 
        src="/static/images/home-banner.png" 
        mode="aspectFill"
      />
    </view>

    <!-- 标题区域 -->
    <view class="title-section">
      <text class="main-title">🎓 汉字认字量检测 📚</text>
      <text class="sub-title">一起来测测认识多少字吧！</text>
    </view>

    <!-- 年龄段认字量参考卡片 -->
    <view class="card-list">
      <view 
        v-for="(item, index) in ageCards" 
        :key="index"
        class="age-card"
        :style="{ background: item.gradient }"
      >
        <view class="card-left">
          <text class="card-emoji">{{ item.emoji }}</text>
          <view class="card-info">
            <text class="card-age">{{ item.age }}</text>
            <text class="card-desc">目标认字量</text>
          </view>
        </view>
        <view class="card-right">
          <text class="card-range">{{ item.range }}</text>
          <text class="card-unit">个汉字</text>
        </view>
      </view>
    </view>

    <!-- 开始检测按钮 -->
    <view class="action-section">
      <view class="start-btn" @tap="startTest">
        <text class="btn-text">🚀 开始检测吧！ 🎉</text>
      </view>
    </view>

    <!-- 底部占位（为 TabBar 留空间） -->
    <view class="tabbar-placeholder"></view>
    
    <!-- 自定义 TabBar -->
    <CustomTabBar current="home" />
  </view>
</template>

<script setup>
/**
 * 首页 v2.0
 * 展示不同年龄段的认字量参考区间，引导用户开始检测
 */
import { ref } from 'vue'
import CustomTabBar from '@/components/CustomTabBar.vue'

// 年龄段卡片数据（含 emoji 和渐变色）
const ageCards = ref([
  {
    emoji: '🌱',
    age: '4-5岁',
    range: '50-100',
    gradient: 'linear-gradient(135deg, #FFE5E5 0%, white 100%)'
  },
  {
    emoji: '🌿',
    age: '5-6岁',
    range: '200-300',
    gradient: 'linear-gradient(135deg, #E5F5FF 0%, white 100%)'
  },
  {
    emoji: '🌺',
    age: '幼小衔接',
    range: '300-500',
    gradient: 'linear-gradient(135deg, #FFF5E5 0%, white 100%)'
  },
  {
    emoji: '🌻',
    age: '1～2年级',
    range: '1600左右',
    gradient: 'linear-gradient(135deg, #F0FFE5 0%, white 100%)'
  },
  {
    emoji: '🌳',
    age: '3～4年级',
    range: '2500左右',
    gradient: 'linear-gradient(135deg, #FFE5F5 0%, white 100%)'
  }
])

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
  background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
  padding: 0 32rpx;
  box-sizing: border-box;
}

.safe-area-top {
  height: 40rpx;
}

/* TabBar 占位 */
.tabbar-placeholder {
  height: calc(180rpx + env(safe-area-inset-bottom));
}

/* Banner 区域 */
.banner-section {
  margin-top: 32rpx;
}

.banner-image {
  width: 100%;
  height: 244rpx;
  border-radius: 32rpx;
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.1);
}

/* 标题区域 */
.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0 32rpx;
}

.main-title {
  font-size: 58rpx;
  font-weight: 500;
  color: #0A0A0A;
  text-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.15);
  letter-spacing: 1rpx;
}

.sub-title {
  font-size: 32rpx;
  color: #6E11B0;
  margin-top: 16rpx;
}

/* 年龄卡片列表 */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.age-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 34rpx;
  border-radius: 28rpx;
  border: 3rpx solid #FFDF20;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.card-left {
  display: flex;
  align-items: center;
}

.card-emoji {
  font-size: 48rpx;
  margin-right: 24rpx;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-age {
  font-size: 36rpx;
  font-weight: 500;
  color: #1E2939;
}

.card-desc {
  font-size: 28rpx;
  color: #4A5565;
  margin-top: 4rpx;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.card-range {
  font-size: 40rpx;
  color: #9810FA;
}

.card-unit {
  font-size: 24rpx;
  color: #6A7282;
  margin-top: 4rpx;
}

/* 操作区域 */
.action-section {
  margin-top: 48rpx;
  display: flex;
  justify-content: center;
  padding-bottom: 24rpx;
}

.start-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 490rpx;
  height: 128rpx;
  background: linear-gradient(90deg, #FB64B6 0%, #C27AFF 50%, #51A2FF 100%);
  border-radius: 64rpx;
  border: 7rpx solid white;
  box-shadow: 0 48rpx 96rpx rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
}

.start-btn:active {
  transform: scale(0.98);
}

.btn-text {
  font-size: 40rpx;
  font-weight: 500;
  color: #ffffff;
}
</style>

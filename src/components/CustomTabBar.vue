<template>
  <!-- 自定义 TabBar 组件 - 匹配 Figma 设计稿 2.0 -->
  <view class="custom-tabbar">
    <view class="tabbar-container">
      <!-- 首页 Tab -->
      <view 
        class="tab-content" 
        :class="{ 'tab-content-active': current === 'home' }"
        @tap="switchTab('home')"
      >
        <text class="tab-icon">🏠</text>
        <text class="tab-text" :class="{ 'tab-text-active': current === 'home' }">首页</text>
      </view>
      
      <!-- 我的 Tab -->
      <view 
        class="tab-content" 
        :class="{ 'tab-content-active': current === 'profile' }"
        @tap="switchTab('profile')"
      >
        <text class="tab-icon">👤</text>
        <text class="tab-text" :class="{ 'tab-text-active': current === 'profile' }">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 自定义 TabBar 组件
 * 设计稿样式：白色半透明背景 + 紫色顶部边框 + 选中项粉紫渐变卡片
 */
import { onMounted, onUnmounted } from 'vue'
import { initAudio, playSound, destroyAudio } from '@/utils/audioManager.js'

// Props 定义
const props = defineProps({
  // 当前选中的 Tab
  current: {
    type: String,
    default: 'home'
  }
})

// 初始化音效
onMounted(() => {
  initAudio()
})

/**
 * 切换 Tab
 * @param {string} tab - Tab 名称
 */
const switchTab = (tab) => {
  if (props.current === tab) return
  
  playSound('button')
  
  // 使用 switchTab 进行页面切换
  const urls = {
    home: '/pages/home/home',
    profile: '/pages/profile/profile'
  }
  
  uni.switchTab({
    url: urls[tab]
  })
}

// 销毁音效实例
onUnmounted(() => {
  destroyAudio()
})
</script>

<style scoped>
/* TabBar 容器 - 固定底部 */
.custom-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(255, 255, 255, 0.95);
  border-top: 7rpx solid #DAB2FF;
  box-shadow: 0 -48rpx 96rpx rgba(0, 0, 0, 0.1);
  padding-bottom: env(safe-area-inset-bottom);
}

/* TabBar 内容区域 */
.tabbar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48rpx;
  height: 144rpx;
  padding: 0 48rpx;
}

/* Tab 内容（点击区域） */
.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 152rpx;
  height: 144rpx;
  border-radius: 32rpx;
}

/* 选中状态 - 粉紫渐变背景卡片 */
.tab-content-active {
  background: linear-gradient(90deg, #FDA5D5 0%, #DAB2FF 100%);
  box-shadow: 0 8rpx 24rpx rgba(253, 165, 213, 0.3);
}

/* Tab 图标 */
.tab-icon {
  font-size: 48rpx;
  margin-bottom: 4rpx;
}

/* Tab 文字 */
.tab-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #364153;
}

/* 选中状态文字 - 白色 */
.tab-text-active {
  color: #ffffff;
}
</style>

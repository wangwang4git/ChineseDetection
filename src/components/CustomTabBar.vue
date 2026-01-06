<template>
  <!-- 自定义 TabBar 组件 - 匹配 Figma 设计稿 2.0 -->
  <view class="custom-tabbar">
    <view class="tabbar-container">
      <!-- 首页 Tab -->
      <view 
        class="tab-item" 
        :class="{ 'tab-active': currentTab === 'home' }"
        @tap="switchTab('home')"
      >
        <view class="tab-content" :class="{ 'tab-content-active': currentTab === 'home' }">
          <text class="tab-icon">🏠</text>
          <text class="tab-text" :class="{ 'tab-text-active': currentTab === 'home' }">首页</text>
        </view>
      </view>
      
      <!-- 我的 Tab -->
      <view 
        class="tab-item" 
        :class="{ 'tab-active': currentTab === 'profile' }"
        @tap="switchTab('profile')"
      >
        <view class="tab-content" :class="{ 'tab-content-active': currentTab === 'profile' }">
          <text class="tab-icon">👤</text>
          <text class="tab-text" :class="{ 'tab-text-active': currentTab === 'profile' }">我的</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 自定义 TabBar 组件
 * 设计稿样式：白色半透明背景 + 紫色顶部边框 + 选中项粉紫渐变卡片
 */
import { ref, watch } from 'vue'

// Props 定义
const props = defineProps({
  // 当前选中的 Tab
  current: {
    type: String,
    default: 'home'
  }
})

// 当前选中 Tab
const currentTab = ref(props.current)

// 监听 props 变化
watch(() => props.current, (newVal) => {
  currentTab.value = newVal
})

/**
 * 切换 Tab
 * @param {string} tab - Tab 名称
 */
const switchTab = (tab) => {
  if (currentTab.value === tab) return
  
  currentTab.value = tab
  
  // 使用 switchTab 进行页面切换
  const urls = {
    home: '/pages/home/home',
    profile: '/pages/profile/profile'
  }
  
  uni.switchTab({
    url: urls[tab]
  })
}
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
  justify-content: space-around;
  align-items: center;
  height: 144rpx;
  padding: 0 48rpx;
}

/* Tab 项 */
.tab-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* Tab 内容 */
.tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 152rpx;
  height: 144rpx;
  border-radius: 32rpx;
  transition: all 0.3s ease;
}

/* 选中状态 - 粉紫渐变背景卡片 */
.tab-content-active {
  background: linear-gradient(90deg, #FDA5D5 0%, #DAB2FF 100%);
  box-shadow: 0 8rpx 24rpx rgba(253, 165, 213, 0.3);
  height: 158rpx;
  margin-top: -14rpx;
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

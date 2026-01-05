<template>
  <!-- 米字格组件 - 用于展示待测汉字 -->
  <view class="rice-grid" :style="{ width: size + 'rpx', height: size + 'rpx' }">
    <!-- 米字格背景 -->
    <view class="grid-bg">
      <!-- 外边框 -->
      <view class="border-outer"></view>
      <!-- 横中线 -->
      <view class="line-horizontal"></view>
      <!-- 竖中线 -->
      <view class="line-vertical"></view>
      <!-- 左上到右下对角线 -->
      <view class="line-diagonal-1"></view>
      <!-- 右上到左下对角线 -->
      <view class="line-diagonal-2"></view>
    </view>
    <!-- 汉字 -->
    <text class="character" :style="{ fontSize: fontSize + 'rpx' }">{{ char }}</text>
  </view>
</template>

<script setup>
/**
 * 米字格组件
 * 用于在检测页面展示待测汉字
 */
import { computed } from 'vue'

// Props 定义
const props = defineProps({
  // 要展示的汉字
  char: {
    type: String,
    default: ''
  },
  // 米字格尺寸（rpx）
  size: {
    type: Number,
    default: 400
  }
})

// 计算字体大小（约为格子大小的 60%）
const fontSize = computed(() => Math.floor(props.size * 0.6))
</script>

<style scoped>
.rice-grid {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fffef5;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.grid-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 外边框 */
.border-outer {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  right: 8rpx;
  bottom: 8rpx;
  border: 4rpx solid #e74c3c;
  border-radius: 8rpx;
}

/* 横中线 */
.line-horizontal {
  position: absolute;
  top: 50%;
  left: 8rpx;
  right: 8rpx;
  height: 2rpx;
  background-color: #e74c3c;
  transform: translateY(-50%);
}

/* 竖中线 */
.line-vertical {
  position: absolute;
  left: 50%;
  top: 8rpx;
  bottom: 8rpx;
  width: 2rpx;
  background-color: #e74c3c;
  transform: translateX(-50%);
}

/* 左上到右下对角线 */
.line-diagonal-1 {
  position: absolute;
  top: 8rpx;
  left: 8rpx;
  width: 141.4%;
  height: 2rpx;
  background-color: #e74c3c;
  transform-origin: top left;
  transform: rotate(45deg);
  opacity: 0.6;
}

/* 右上到左下对角线 */
.line-diagonal-2 {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 141.4%;
  height: 2rpx;
  background-color: #e74c3c;
  transform-origin: top right;
  transform: rotate(-45deg);
  opacity: 0.6;
}

/* 汉字样式 */
.character {
  position: relative;
  z-index: 10;
  font-family: "SimHei", "Heiti SC", "Microsoft YaHei", sans-serif;
  font-weight: bold;
  color: #333333;
  text-align: center;
}
</style>

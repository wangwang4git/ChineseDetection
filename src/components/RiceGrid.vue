<template>
  <!-- 米字格组件 - 用于展示待测汉字 -->
  <view class="rice-grid" :style="{ width: size + 'rpx', height: size + 'rpx' }">
    <!-- 米字格线条 -->
    <view class="grid-line line-horizontal"></view>
    <view class="grid-line line-vertical"></view>
    <view class="grid-line line-diagonal-1"></view>
    <view class="grid-line line-diagonal-2"></view>
    <!-- 汉字 -->
    <text class="character" :style="{ fontSize: fontSize + 'rpx' }">{{ char }}</text>
  </view>
</template>

<script setup>
/**
 * 米字格组件
 * 用于在检测页面展示待测汉字
 * 白色背景 + 金色边框 + 米字格线条
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
    default: 488
  }
})

// 计算字体大小（约为格子大小的 50%）
const fontSize = computed(() => Math.floor(props.size * 0.5))
</script>

<style scoped>
/* 米字格容器 - 白色背景 + 金色边框 */
.rice-grid {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 32rpx;
  border: 7rpx solid #FDC700;
  box-shadow: 0 50rpx 100rpx -24rpx rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

/* 米字格线条基础样式 */
.grid-line {
  position: absolute;
  background-color: #E5E7EB;
}

/* 横线 */
.line-horizontal {
  width: 100%;
  height: 2rpx;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

/* 竖线 */
.line-vertical {
  width: 2rpx;
  height: 100%;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

/* 对角线1（左上到右下） */
.line-diagonal-1 {
  width: 141.4%;
  height: 2rpx;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

/* 对角线2（右上到左下） */
.line-diagonal-2 {
  width: 141.4%;
  height: 2rpx;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* 汉字样式 */
.character {
  position: relative;
  z-index: 10;
  font-family: "Helvetica", "SimHei", "Heiti SC", "Microsoft YaHei", sans-serif;
  font-weight: bold;
  color: #101828;
  text-align: center;
}
</style>

<template>
  <!-- 汉字卡片组件 - 用于展示单个汉字 -->
  <view 
    class="character-card" 
    :class="{ 'card-clickable': clickable }"
    @tap="handleTap"
  >
    <text class="card-char">{{ char }}</text>
  </view>
</template>

<script setup>
/**
 * 汉字卡片组件
 * 用于在结果页和历史详情页展示不认识的汉字
 */

// Props 定义
const props = defineProps({
  // 要展示的汉字
  char: {
    type: String,
    required: true
  },
  // 是否可点击
  clickable: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits(['tap'])

// 点击处理
const handleTap = () => {
  if (props.clickable) {
    emit('tap', props.char)
  }
}
</script>

<style scoped>
/* 汉字卡片 - 粉色渐变样式 */
.character-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 104rpx;
  height: 150rpx;
  background: linear-gradient(135deg, #FFE2E2 0%, #FCE7F3 100%);
  border-radius: 20rpx;
  border: 3rpx solid #FDA5D5;
  box-shadow: 0 4rpx 12rpx -4rpx rgba(0, 0, 0, 0.10), 0 8rpx 16rpx -2rpx rgba(0, 0, 0, 0.10);
  margin: 12rpx;
}

.card-clickable {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-clickable:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(253, 165, 213, 0.3);
}

.card-char {
  font-size: 48rpx;
  font-weight: bold;
  color: #0A0A0A;
  font-family: "Helvetica", "SimHei", "Heiti SC", "Microsoft YaHei", sans-serif;
}
</style>

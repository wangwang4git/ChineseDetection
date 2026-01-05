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
.character-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
  margin: 12rpx;
}

.card-clickable {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-clickable:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.2);
}

.card-char {
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  font-family: "SimHei", "Heiti SC", "Microsoft YaHei", sans-serif;
}
</style>

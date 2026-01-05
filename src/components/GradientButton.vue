<template>
  <!-- 渐变按钮组件 -->
  <view 
    class="gradient-btn"
    :class="[
      `btn-${type}`,
      { 'btn-disabled': disabled },
      { 'btn-block': block }
    ]"
    :style="customStyle"
    @tap="handleTap"
  >
    <text class="btn-text">{{ text }}</text>
  </view>
</template>

<script setup>
/**
 * 渐变按钮组件
 * 支持多种渐变色配置
 */

// Props 定义
const props = defineProps({
  // 按钮文字
  text: {
    type: String,
    default: '按钮'
  },
  // 按钮类型: primary | success | danger | warning | info
  type: {
    type: String,
    default: 'primary'
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否块级按钮（占满宽度）
  block: {
    type: Boolean,
    default: false
  },
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  }
})

// Emits 定义
const emit = defineEmits(['tap'])

// 点击处理
const handleTap = () => {
  if (!props.disabled) {
    emit('tap')
  }
}
</script>

<style scoped>
.gradient-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 64rpx;
  border-radius: 50rpx;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.gradient-btn:active {
  transform: scale(0.98);
}

/* 按钮类型 */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  box-shadow: 0 8rpx 24rpx rgba(17, 153, 142, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  box-shadow: 0 8rpx 24rpx rgba(245, 87, 108, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
  box-shadow: 0 8rpx 24rpx rgba(245, 175, 25, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 8rpx 24rpx rgba(79, 172, 254, 0.4);
}

/* 禁用状态 */
.btn-disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* 块级按钮 */
.btn-block {
  display: flex;
  width: 100%;
}

/* 按钮文字 */
.btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
}
</style>

<template>
  <view class="page-container">
    <!-- Page content here -->
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'

// ==================== State ====================
const loading = ref(false)

// ==================== Lifecycle ====================
onLoad((options) => {
  // Page load with query params
  console.log('Page loaded:', options)
})

onShow(() => {
  // Page show
})

onMounted(() => {
  // Component mounted
})

// ==================== Methods ====================

</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24rpx;
  box-sizing: border-box;
}
</style>

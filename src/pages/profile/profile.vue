<template>
  <!-- 个人页 - 用户信息和历史记录 -->
  <view class="page-container">
    <!-- 顶部安全区域 -->
    <view class="safe-area-top"></view>

    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-wrapper">
        <text class="avatar">{{ userInfo.avatar }}</text>
      </view>
      <view class="user-info">
        <text class="nickname">{{ userInfo.nickname }}</text>
        <text class="account">账号：{{ userInfo.account }}</text>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-section">
      <view class="stat-card">
        <text class="stat-icon">📊</text>
        <text class="stat-value">{{ statistics.testCount }}</text>
        <text class="stat-label">检测次数</text>
      </view>
      <view class="stat-card">
        <text class="stat-icon">🏆</text>
        <text class="stat-value">{{ statistics.maxScore }}</text>
        <text class="stat-label">最高记录</text>
      </view>
      <view class="stat-card">
        <text class="stat-icon">📈</text>
        <text class="stat-value">{{ statistics.avgScore }}</text>
        <text class="stat-label">平均认字</text>
      </view>
    </view>

    <!-- 历史记录 -->
    <view class="history-section">
      <text class="section-title">📚 历史检测记录</text>
      
      <view v-if="records.length === 0" class="empty-state">
        <text class="empty-text">暂无检测记录</text>
        <text class="empty-hint">快去首页开始检测吧！</text>
      </view>

      <view v-else class="record-list">
        <view 
          v-for="record in records" 
          :key="record.id"
          class="record-item"
          @tap="goToDetail(record.id)"
        >
          <view class="record-left">
            <text class="record-time">{{ formatTime(record.testTime) }}</text>
            <view class="record-tags">
              <text class="record-score">📊 {{ record.estimatedVocabulary }} 字</text>
              <text v-if="record.unknownChars?.length > 0" class="record-unknown">
                需加强 {{ record.unknownChars.length }} 字
              </text>
              <text v-if="record.isFused" class="record-fuse">提前结束</text>
            </view>
          </view>
          <view class="record-right">
            <text class="record-arrow">👉</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script setup>
/**
 * 个人页
 * 展示用户信息、统计数据和历史检测记录
 */
import { ref, onMounted } from 'vue'
import { getRecordList, getStatistics } from '@/api/record.js'
import { getUserInfo } from '@/utils/storage.js'
import { formatDateTime } from '@/utils/index.js'

// 用户信息
const userInfo = ref({
  id: '',
  nickname: '小朋友',
  avatar: '👦',
  account: 'user_001'
})

// 统计数据
const statistics = ref({
  testCount: 0,
  maxScore: 0,
  avgScore: 0
})

// 历史记录
const records = ref([])

/**
 * 格式化时间
 */
const formatTime = (time) => {
  return formatDateTime(time, 'MM-DD HH:mm')
}

/**
 * 跳转到详情页
 */
const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/history-detail/history-detail?id=${id}`
  })
}

/**
 * 加载数据
 */
const loadData = async () => {
  // 获取用户信息
  userInfo.value = getUserInfo()

  // 获取统计数据
  const statsRes = await getStatistics()
  if (statsRes.errCode === 0) {
    statistics.value = statsRes.data
  }

  // 获取历史记录
  const recordsRes = await getRecordList()
  if (recordsRes.errCode === 0) {
    records.value = recordsRes.data
  }
}

// 页面显示时加载数据
onMounted(() => {
  loadData()
})

// 页面每次显示时刷新数据
import { onShow } from '@dcloudio/uni-app'
onShow(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffecd2 0%, #fcb69f 50%, #ee9ca7 100%);
  padding: 0 32rpx;
  box-sizing: border-box;
}

.safe-area-top {
  height: 44rpx;
}

.safe-area-bottom {
  height: calc(120rpx + env(safe-area-inset-bottom));
}

/* 用户卡片 */
.user-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-top: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
}

.avatar-wrapper {
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 24rpx;
}

.avatar {
  font-size: 64rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.account {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 统计卡片 */
.stats-section {
  display: flex;
  justify-content: space-between;
  margin-top: 24rpx;
  gap: 16rpx;
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999999;
}

/* 历史记录 */
.history-section {
  margin-top: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  display: block;
  margin-bottom: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64rpx 0;
}

.empty-text {
  font-size: 30rpx;
  color: #999999;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #cccccc;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.record-item:active {
  transform: scale(0.99);
  opacity: 0.9;
}

.record-left {
  display: flex;
  flex-direction: column;
}

.record-time {
  font-size: 26rpx;
  color: #999999;
  margin-bottom: 8rpx;
}

.record-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.record-score {
  font-size: 28rpx;
  font-weight: 600;
  color: #667eea;
}

.record-unknown {
  font-size: 24rpx;
  color: #f5576c;
}

.record-fuse {
  font-size: 22rpx;
  color: #856404;
  background: rgba(255, 193, 7, 0.3);
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.record-right {
  display: flex;
  align-items: center;
}

.record-arrow {
  font-size: 32rpx;
}
</style>

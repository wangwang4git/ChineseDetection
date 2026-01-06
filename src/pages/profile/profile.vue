<template>
  <!-- 个人页 - 用户信息和历史记录 v2.0 -->
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
      <view 
        v-for="(stat, index) in statCards" 
        :key="index"
        class="stat-card"
        :style="{ 
          background: stat.gradient,
          borderColor: stat.borderColor
        }"
      >
        <text class="stat-icon">{{ stat.emoji }}</text>
        <text class="stat-value">{{ stat.value }}</text>
        <text class="stat-label">{{ stat.label }}</text>
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
          <view class="record-content">
            <text class="record-time">{{ formatTime(record.testTime) }}</text>
            <view class="record-main">
              <text class="record-icon">📊</text>
              <text class="record-score">认字量：{{ record.estimatedVocabulary }}</text>
            </view>
            <text v-if="record.unknownChars?.length > 0" class="record-unknown">
              需加强：{{ record.unknownChars.length }} 个汉字
            </text>
          </view>
          <view class="record-arrow">
            <text class="arrow-icon">👉</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部占位（为 TabBar 留空间） -->
    <view class="tabbar-placeholder"></view>
    
    <!-- 自定义 TabBar -->
    <CustomTabBar current="profile" />
  </view>
</template>

<script setup>
/**
 * 个人页 v2.0
 * 展示用户信息、统计数据和历史检测记录
 */
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getRecordList, getStatistics } from '@/api/record.js'
import { getUserInfo } from '@/utils/storage.js'
import { formatDateTime } from '@/utils/index.js'
import CustomTabBar from '@/components/CustomTabBar.vue'

// 用户信息
const userInfo = ref({
  id: '',
  nickname: '王澈小朋友',
  avatar: '👦',
  account: 'user_001'
})

// 统计数据
const statistics = ref({
  testCount: 0,
  maxScore: 0,
  avgScore: 0
})

// 统计卡片配置
const statCards = computed(() => [
  {
    emoji: '📊',
    value: statistics.value.testCount,
    label: '次检测',
    gradient: 'linear-gradient(135deg, #B9F8CF 0%, #7BF1A8 100%)',
    borderColor: '#05DF72'
  },
  {
    emoji: '🏆',
    value: statistics.value.maxScore,
    label: '最高记录',
    gradient: 'linear-gradient(135deg, #BEDBFF 0%, #8EC5FF 100%)',
    borderColor: '#51A2FF'
  },
  {
    emoji: '📈',
    value: statistics.value.avgScore,
    label: '平均认字',
    gradient: 'linear-gradient(135deg, #E9D4FF 0%, #DAB2FF 100%)',
    borderColor: '#C27AFF'
  }
])

// 历史记录
const records = ref([])

/**
 * 格式化时间
 */
const formatTime = (time) => {
  return formatDateTime(time, 'YYYY/MM/DD HH:mm:ss')
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
onShow(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
  padding: 0 32rpx;
  box-sizing: border-box;
}

.safe-area-top {
  height: 32rpx;
}

/* TabBar 占位 */
.tabbar-placeholder {
  height: calc(180rpx + env(safe-area-inset-bottom));
}

/* 用户卡片 */
.user-card {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #FDA5D5 0%, #DAB2FF 50%, #8EC5FF 100%);
  border-radius: 32rpx;
  padding: 54rpx;
  margin-top: 32rpx;
  border: 7rpx solid white;
  box-shadow: 0 48rpx 96rpx rgba(0, 0, 0, 0.25);
}

.avatar-wrapper {
  width: 122rpx;
  height: 122rpx;
  background: linear-gradient(135deg, #FFDF20 0%, #FFB86A 100%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 32rpx;
  border: 7rpx solid white;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.avatar {
  font-size: 60rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 40rpx;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.account {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 统计卡片 */
.stats-section {
  display: flex;
  justify-content: space-between;
  margin-top: 32rpx;
  gap: 20rpx;
}

.stat-card {
  flex: 1;
  border-radius: 28rpx;
  padding: 34rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3rpx solid;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.stat-value {
  font-size: 40rpx;
  font-weight: 400;
  color: #1E2939;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #364153;
}

/* 历史记录 */
.history-section {
  margin-top: 40rpx;
}

.section-title {
  font-size: 40rpx;
  font-weight: 500;
  color: #6E11B0;
  display: block;
  margin-bottom: 24rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64rpx 0;
}

.empty-text {
  font-size: 30rpx;
  color: #4A5565;
  margin-bottom: 12rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #6A7282;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #FFF5E5 0%, white 100%);
  border-radius: 28rpx;
  padding: 34rpx;
  border: 3rpx solid #FFDF20;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.record-item:active {
  transform: scale(0.99);
  opacity: 0.95;
}

.record-content {
  display: flex;
  flex-direction: column;
}

.record-time {
  font-size: 24rpx;
  color: #4A5565;
  margin-bottom: 8rpx;
}

.record-main {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.record-icon {
  font-size: 40rpx;
  margin-right: 12rpx;
}

.record-score {
  font-size: 36rpx;
  color: #9810FA;
}

.record-unknown {
  font-size: 24rpx;
  color: #4A5565;
}

.record-arrow {
  display: flex;
  align-items: center;
}

.arrow-icon {
  font-size: 48rpx;
}
</style>

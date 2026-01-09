<template>
  <!-- 个人页 - 用户信息和历史记录 v2.0 -->
  <view class="page-container">
    <!-- 顶部安全区域 -->
    <view class="safe-area-top"></view>

    <!-- 用户信息卡片 -->
    <view class="user-card">
      <!-- 头像区域 - 可点击选择头像 -->
      <view class="avatar-wrapper" @tap="handleAvatarClick">
        <!-- #ifdef MP-WEIXIN -->
        <button 
          class="avatar-button" 
          open-type="chooseAvatar" 
          @chooseavatar="onChooseAvatar"
        >
          <image 
            class="avatar-image" 
            :src="userInfo.avatar" 
            mode="aspectFill"
          />
        </button>
        <!-- #endif -->
        
        <!-- #ifdef H5 -->
        <image 
          class="avatar-image" 
          :src="userInfo.avatar" 
          mode="aspectFill"
        />
        <!-- #endif -->
      </view>
      
      <view class="user-info">
        <!-- 昵称区域 - 可点击编辑 -->
        <view class="nickname-wrapper" @tap="handleNicknameClick">
          <!-- #ifdef MP-WEIXIN -->
          <input 
            class="nickname-input" 
            type="nickname" 
            :value="userInfo.nickname"
            placeholder="请输入昵称"
            @blur="onNicknameChange"
            @confirm="onNicknameChange"
          />
          <!-- #endif -->
          
          <!-- #ifdef H5 -->
          <input 
            class="nickname-input" 
            type="text" 
            :value="userInfo.nickname"
            placeholder="请输入昵称"
            @blur="onNicknameChange"
            @confirm="onNicknameChange"
          />
          <!-- #endif -->
        </view>
        
        <!-- OpenID 显示（掩码处理） -->
        <text class="account">ID：{{ maskedOpenId }}</text>
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
    
    <!-- 用户引导提示框 -->
    <view v-if="showGuideModal" class="guide-modal" @tap="closeGuideModal">
      <view class="guide-content" @tap.stop>
        <view class="guide-header">
          <text class="guide-title">👋 欢迎来到个人页！</text>
        </view>
        <view class="guide-body">
          <text class="guide-text">点击用户头像可以更新您的头像</text>
          <text class="guide-text">点击昵称可以修改您的昵称</text>
          <text class="guide-hint">让我们开始个性化您的资料吧～</text>
        </view>
        <view class="guide-footer">
          <button class="guide-button" @tap="closeGuideModal">我知道了</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 个人页 v3.0
 * 展示用户信息、统计数据和历史检测记录
 * 支持微信头像选择和昵称填写
 */
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
// #ifdef MP-WEIXIN
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
// #endif
import { getRecordList, getStatistics } from '@/api/record.js'
import { handleChooseAvatar, handleNicknameInput, getMaskedOpenId } from '@/api/user.js'
import userManager from '@/utils/userManager.js'
import { formatDateTime } from '@/utils/index.js'
import { getProfileGuideShown, setProfileGuideShown } from '@/utils/storage.js'
import { getDefaultShareConfig, getDefaultTimelineConfig } from '@/utils/share.js'
import CustomTabBar from '@/components/CustomTabBar.vue'

// 用户信息
const userInfo = ref({
  openid: '',
  nickname: '王澈小朋友',
  avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
  hasAuthorized: false,
  lastUpdated: 0,
  source: 'default'
})

// 掩码后的 OpenID
const maskedOpenId = computed(() => {
  return getMaskedOpenId(userInfo.value.openid)
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

// 加载状态
const isLoading = ref(false)

// 用户引导提示状态
const showGuideModal = ref(false)

// #ifdef MP-WEIXIN
/**
 * 分享给好友
 */
onShareAppMessage(() => {
  return getDefaultShareConfig()
})

/**
 * 分享到朋友圈
 */
onShareTimeline(() => {
  return getDefaultTimelineConfig()
})
// #endif

/**
 * 处理头像点击
 */
const handleAvatarClick = () => {
  // #ifdef H5
  // H5 环境显示头像选择器
  showAvatarPicker()
  // #endif
}

/**
 * 处理微信头像选择
 * 优化：先更新UI，再异步保存数据，避免延迟
 */
const onChooseAvatar = (e) => {
  console.log('选择头像事件:', e)
  
  // #ifdef MP-WEIXIN
  // 直接从事件中获取头像临时路径
  const avatarUrl = e.detail?.avatarUrl
  if (avatarUrl) {
    // 1. 立即更新UI（无延迟）
    userInfo.value.avatar = avatarUrl
    userInfo.value.hasAuthorized = true
    userInfo.value.lastUpdated = Date.now()
    
    // 2. 异步保存到本地存储（不阻塞UI）
    userManager.updateAvatar(avatarUrl).then(success => {
      if (success) {
        console.log('✅ 头像保存成功')
        uni.showToast({ title: '头像更新成功', icon: 'success' })
      } else {
        console.warn('⚠️ 头像保存失败')
      }
    }).catch(err => {
      console.error('头像保存异常:', err)
    })
  } else {
    uni.showToast({ title: '未获取到头像', icon: 'none' })
  }
  // #endif
  
  // #ifdef H5
  handleChooseAvatar(e).then(result => {
    if (result.success && result.data) {
      userInfo.value.avatar = result.data
      userInfo.value.hasAuthorized = true
      userInfo.value.lastUpdated = Date.now()
      userManager.updateAvatar(result.data)
      uni.showToast({ title: '头像更新成功', icon: 'success' })
    }
  })
  // #endif
}

/**
 * 处理昵称点击
 */
const handleNicknameClick = () => {
  // 聚焦到昵称输入框
  console.log('点击昵称区域')
}

/**
 * 处理昵称变更
 * 优化：先更新UI，再异步保存数据
 */
const onNicknameChange = (e) => {
  const nickname = e.detail?.value || e.target?.value
  console.log('昵称变更:', nickname)
  
  if (!nickname || nickname.trim() === userInfo.value.nickname) {
    return // 没有变化，不处理
  }
  
  handleNicknameInput(nickname).then(result => {
    if (result.success && result.data) {
      // 1. 立即更新UI（无延迟）
      userInfo.value.nickname = result.data
      userInfo.value.hasAuthorized = true
      userInfo.value.lastUpdated = Date.now()
      
      // 2. 异步保存到本地存储（不阻塞UI）
      userManager.updateNickname(result.data).then(success => {
        if (success) {
          console.log('✅ 昵称保存成功')
          uni.showToast({ title: '昵称更新成功', icon: 'success' })
        }
      })
    } else {
      uni.showToast({ title: result.errMsg || '昵称格式不正确', icon: 'none' })
    }
  }).catch(error => {
    console.error('处理昵称变更失败:', error)
    uni.showToast({ title: '昵称更新失败', icon: 'none' })
  })
}

/**
 * H5 环境头像选择器
 */
const showAvatarPicker = () => {
  const avatars = ['👦', '👧', '🧒', '👶', '🐱', '🐶', '🐰', '🐻', '🐼', '🦊']
  
  uni.showActionSheet({
    itemList: avatars.map(avatar => `${avatar} 选择这个头像`),
    success: (res) => {
      const selectedAvatar = avatars[res.tapIndex]
      if (selectedAvatar) {
        // 立即更新UI
        userInfo.value.avatar = selectedAvatar
        userInfo.value.hasAuthorized = true
        userInfo.value.lastUpdated = Date.now()
        
        // 异步保存
        userManager.updateAvatar(selectedAvatar).then(success => {
          if (success) {
            uni.showToast({ title: '头像更新成功', icon: 'success' })
          }
        })
      }
    }
  })
}

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
 * 加载用户信息
 */
const loadUserInfo = async () => {
  try {
    const currentUserInfo = await userManager.getCurrentUserInfo()
    if (currentUserInfo) {
      userInfo.value = currentUserInfo
      console.log('用户信息加载成功:', {
        openid: getMaskedOpenId(currentUserInfo.openid),
        nickname: currentUserInfo.nickname,
        hasAuthorized: currentUserInfo.hasAuthorized
      })
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

/**
 * 加载统计数据
 */
const loadStatistics = async () => {
  try {
    const statsRes = await getStatistics()
    if (statsRes.errCode === 0) {
      statistics.value = statsRes.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

/**
 * 加载历史记录
 */
const loadRecords = async () => {
  try {
    const recordsRes = await getRecordList()
    if (recordsRes.errCode === 0) {
      records.value = recordsRes.data
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
}

/**
 * 加载所有数据
 */
const loadData = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    await Promise.all([
      loadUserInfo(),
      loadStatistics(),
      loadRecords()
    ])
    
    // 数据加载完成后检查是否需要显示引导提示
    checkAndShowGuide()
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 检查并显示用户引导提示
 */
const checkAndShowGuide = () => {
  try {
    // 检查是否已经显示过引导提示
    const hasShownGuide = getProfileGuideShown()
    
    if (!hasShownGuide) {
      // 延迟显示，确保页面渲染完成
      setTimeout(() => {
        showGuideModal.value = true
      }, 800)
    }
  } catch (error) {
    console.error('检查引导提示状态失败:', error)
  }
}

/**
 * 关闭引导提示框
 */
const closeGuideModal = () => {
  showGuideModal.value = false
  
  // 记录已显示过引导提示
  const success = setProfileGuideShown(true)
  if (success) {
    console.log('✅ 引导提示状态已保存')
  } else {
    console.warn('⚠️ 引导提示状态保存失败')
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
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-wrapper:active {
  transform: scale(0.95);
}

.avatar-button {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}

.avatar-button::after {
  border: none;
}

.avatar {
  font-size: 60rpx;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.nickname-wrapper {
  margin-bottom: 8rpx;
}

.nickname-input {
  font-size: 40rpx;
  font-weight: 500;
  color: #ffffff;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 48rpx;
}

.nickname-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.account {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4rpx;
}

.auth-hint {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
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

/* 用户引导提示框 */
.guide-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.guide-content {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%);
  border-radius: 32rpx;
  padding: 48rpx;
  margin: 0 48rpx;
  max-width: 560rpx;
  width: 100%;
  box-shadow: 0 24rpx 48rpx rgba(0, 0, 0, 0.2);
  border: 4rpx solid #E9D4FF;
  animation: slideUp 0.3s ease-out;
}

.guide-header {
  text-align: center;
  margin-bottom: 32rpx;
}

.guide-title {
  font-size: 44rpx;
  font-weight: 600;
  color: #6E11B0;
  display: block;
}

.guide-body {
  margin-bottom: 40rpx;
}

.guide-text {
  font-size: 32rpx;
  color: #364153;
  line-height: 1.6;
  display: block;
  margin-bottom: 16rpx;
  padding-left: 24rpx;
  position: relative;
}

.guide-text::before {
  content: '•';
  color: #9810FA;
  font-size: 36rpx;
  position: absolute;
  left: 0;
  top: -2rpx;
}

.guide-hint {
  font-size: 28rpx;
  color: #6A7282;
  text-align: center;
  display: block;
  margin-top: 24rpx;
  font-style: italic;
}

.guide-footer {
  display: flex;
  justify-content: center;
}

.guide-button {
  background: linear-gradient(135deg, #9810FA 0%, #C27AFF 100%);
  color: white;
  border: none;
  border-radius: 24rpx;
  padding: 24rpx 48rpx;
  font-size: 32rpx;
  font-weight: 500;
  box-shadow: 0 8rpx 24rpx rgba(152, 16, 250, 0.3);
  transition: all 0.2s ease;
}

.guide-button:active {
  transform: scale(0.95);
  opacity: 0.9;
}

.guide-button::after {
  border: none;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

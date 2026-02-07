<template>
  <!-- 识字量测试科学原理页面 -->
  <view class="page-container">
    <!-- 顶部安全区域 -->
    <view class="safe-area-top"></view>

    <!-- 返回按钮 -->
    <view class="back-btn" @tap="goBack">
      <text class="back-text">← 返回</text>
    </view>

    <!-- Header 卡片 -->
    <view class="header-card">
      <text class="header-emoji">🔬</text>
      <text class="header-title">识字量测试科学原理</text>
      <text class="header-subtitle">基于语言学研究的科学测评方法</text>
    </view>

    <!-- 内容卡片列表 -->
    <view class="content-section">
      <!-- 📊 数据来源卡片 -->
      <view class="info-card data-source-card">
        <view class="card-header">
          <text class="card-emoji">📊</text>
          <text class="card-title">数据来源</text>
        </view>
        <view class="card-content">
          <text class="content-text">
            基于《现代汉语常用字表》及语料库大数据，精选前<text class="highlight-purple">2500个常用字</text>，这些字在现代汉语语料库中的出现累积频率高达<text class="highlight-purple">98.5%</text>，涵盖了日常生活和学习中绝大部分汉字使用场景。
          </text>
        </view>
      </view>

      <!-- 🎯 测试策略卡片 -->
      <view class="info-card strategy-card">
        <view class="card-header">
          <text class="card-emoji">🎯</text>
          <text class="card-title">测试策略</text>
        </view>
        <view class="card-content">
          <text class="content-text">
            采用<text class="highlight-green">分层频率抽样</text>测试策略，根据汉字使用频率分为6个层级，通过加权计算得出准确的识字量估算。
          </text>
        </view>
        <!-- 公式展示区域 -->
        <view class="formula-section">
          <text class="formula-label">识字量计算公式</text>
          <view class="formula-box">
            <view class="formula-line">
              <text class="formula-w">W</text>
              <text class="formula-eq">=</text>
              <text class="formula-n">N</text><text class="formula-sub">L1</text>
              <text class="formula-op">+ (</text>
              <text class="formula-n">N</text><text class="formula-sub">L2</text>
              <text class="formula-op">× 3) + (</text>
              <text class="formula-n">N</text><text class="formula-sub">L3</text>
              <text class="formula-op">× 10) +</text>
            </view>
            <view class="formula-line">
              <text class="formula-op">(</text>
              <text class="formula-n">N</text><text class="formula-sub">L4</text>
              <text class="formula-op">× 20) + (</text>
              <text class="formula-n">N</text><text class="formula-sub">L5</text>
              <text class="formula-op">× 50) + (</text>
              <text class="formula-n">N</text><text class="formula-sub">L6</text>
              <text class="formula-op">× 100)</text>
            </view>
          </view>
          <text class="formula-note">其中 N<text class="formula-note-sub">Lx</text> 代表在第 x 层级中实际认读正确的字数</text>
        </view>
      </view>

      <!-- 📋 常用字层级划分卡片 -->
      <view class="info-card level-card">
        <view class="card-header">
          <text class="card-emoji">📋</text>
          <text class="card-title">常用字层级划分</text>
        </view>
        <view class="card-content">
          <!-- 表格 -->
          <view class="level-table">
            <!-- 表头 -->
            <view class="table-header">
              <view class="th th-level">层级</view>
              <view class="th th-rank">字频排名</view>
              <view class="th th-desc">描述</view>
              <view class="th th-sample">抽样方式</view>
              <view class="th th-count">测试字数</view>
              <view class="th th-weight">权重</view>
            </view>
            <!-- 表格内容 -->
            <view 
              v-for="(item, index) in levelData" 
              :key="index" 
              class="table-row"
              :class="'row-' + item.level.toLowerCase()"
            >
              <view class="td td-level">
                <text :class="'level-tag level-' + item.level.toLowerCase()">{{ item.level }}</text>
              </view>
              <view class="td td-rank">{{ item.rank }}</view>
              <view class="td td-desc">{{ item.desc }}</view>
              <view class="td td-sample">{{ item.sample }}</view>
              <view class="td td-count">
                <text class="count-text">{{ item.count }}</text>
              </view>
              <view class="td td-weight">
                <text :class="'weight-text weight-' + item.level.toLowerCase()">{{ item.weight }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- ⚠️ 测试结束机制卡片 -->
      <view class="info-card end-card">
        <view class="card-header">
          <text class="card-emoji">⚠️</text>
          <text class="card-title">测试结束机制</text>
        </view>
        <view class="card-content">
          <view class="end-item">
            <text class="end-bullet">•</text>
            <text class="end-text">
              在任何一个层级（L1-L6），如果孩子<text class="highlight-orange">连续5个测试字不认识</text>，立即停止测试
            </text>
          </view>
          <view class="end-item">
            <text class="end-bullet">•</text>
            <text class="end-text">
              在任何一个层级，如果该层级<text class="highlight-orange">总错误率超过80%</text>，立即停止测试
            </text>
          </view>
        </view>
        <view class="end-tip">
          <text class="end-tip-text">💡 这样的机制可以避免让孩子产生挫败感，同时提高测试效率</text>
        </view>
      </view>

      <!-- 💡 计算示例卡片 -->
      <view class="info-card example-card">
        <view class="card-header">
          <text class="card-emoji">💡</text>
          <text class="card-title">计算示例</text>
        </view>
        <view class="example-content">
          <!-- 前提说明 -->
          <view class="example-warning">
            <text class="warning-text">⚠️ 前提：测试过程中存在连续5个测试字不认识的情况</text>
          </view>
          
          <!-- 假设测试结果 -->
          <text class="example-label">假设测试结果如下：</text>
          <view class="example-list">
            <text class="example-item">• L1层级：认识 45个（共50个）</text>
            <text class="example-item">• L2层级：认识 40个（共50个）</text>
            <text class="example-item">• L3层级：认识 20个（共30个）</text>
            <text class="example-item">• L4层级：认识 15个（共25个）</text>
            <text class="example-item">• L5层级：认识 5个（共10个）</text>
            <text class="example-item">• L6层级：认识 2个（共10个）</text>
          </view>
          
          <!-- 计算过程 -->
          <text class="example-label">计算识字量：</text>
          <view class="calc-box">
            <text class="calc-text">W = 45×1 + 40×3 + 20×10 + 15×20 + 5×50 + 2×100</text>
          </view>
          <view class="calc-box">
            <text class="calc-text">W = 45 + 120 + 200 + 300 + 250 + 200</text>
          </view>
          
          <!-- 最终结果 -->
          <view class="result-row">
            <text class="result-label">估算识字量 =</text>
            <text class="result-number">1115</text>
            <text class="result-unit">个汉字</text>
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
 * 识字量测试科学原理页面
 * 展示测试方法的科学依据和计算原理
 */
import { ref, onMounted, onUnmounted } from 'vue'
// #ifdef MP-WEIXIN
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
// #endif
import { getSciencePrincipleShareConfig, getSciencePrincipleTimelineConfig } from '@/utils/share.js'
import { initAudio, playSound, destroyAudio } from '@/utils/audioManager.js'

/**
 * 层级表格数据
 */
const levelData = ref([
  { level: 'L1', rank: '1-50', desc: '绝对核心字', sample: '全测+随机打乱', count: '50字', weight: '×1' },
  { level: 'L2', rank: '51-200', desc: '高频基础字', sample: '随机抽样', count: '50字', weight: '×3' },
  { level: 'L3', rank: '201-500', desc: '中频常用字', sample: '随机抽样', count: '30字', weight: '×10' },
  { level: 'L4', rank: '501-1000', desc: '次常用字', sample: '随机抽样', count: '25字', weight: '×20' },
  { level: 'L5', rank: '1001-1500', desc: '低频拓展字', sample: '随机抽样', count: '10字', weight: '×50' },
  { level: 'L6', rank: '1501-2500', desc: '生僻/书面字', sample: '随机抽样', count: '10字', weight: '×100' }
])

/**
 * 返回上一页
 */
const goBack = () => {
  playSound('button')
  uni.navigateBack({
    fail: () => {
      // 如果没有上一页，返回首页
      uni.switchTab({
        url: '/pages/home/home'
      })
    }
  })
}

// #ifdef MP-WEIXIN
/**
 * 微信分享给好友
 * @returns {Object} 分享配置
 */
onShareAppMessage(() => {
  return getSciencePrincipleShareConfig()
})

/**
 * 微信分享到朋友圈
 * @returns {Object} 朋友圈分享配置
 */
onShareTimeline(() => {
  return getSciencePrincipleTimelineConfig()
})
// #endif

// 初始化音效
onMounted(() => {
  initAudio()
})

// 销毁音效实例
onUnmounted(() => {
  destroyAudio()
})
</script>

<style scoped>
/* 页面容器 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%);
  padding: 0 32rpx;
  box-sizing: border-box;
}

/* 安全区域 */
.safe-area-top {
  height: 88rpx;
}

.safe-area-bottom {
  height: calc(48rpx + env(safe-area-inset-bottom));
}

/* 返回按钮 */
.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 18rpx 32rpx;
  background: rgba(255, 255, 255, 0.90);
  border-radius: 999rpx;
  border: 3rpx solid #DAB2FF;
  box-shadow: 0 8rpx 24rpx -8rpx rgba(0, 0, 0, 0.10), 0 20rpx 30rpx -6rpx rgba(0, 0, 0, 0.10);
}

.back-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #6E11B0;
}

/* Header 卡片 */
.header-card {
  margin-top: 32rpx;
  padding: 48rpx 56rpx;
  background: linear-gradient(90deg, #FDA5D5 0%, #DAB2FF 50%, #8EC5FF 100%);
  border-radius: 32rpx;
  border: 7rpx solid white;
  box-shadow: 0 8rpx 12rpx -8rpx rgba(0, 0, 0, 0.10), 0 20rpx 30rpx -6rpx rgba(0, 0, 0, 0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-emoji {
  font-size: 60rpx;
}

.header-title {
  font-size: 48rpx;
  font-weight: 500;
  color: white;
  margin-top: 16rpx;
}

.header-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.90);
  margin-top: 12rpx;
}

/* 内容区域 */
.content-section {
  margin-top: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

/* 通用信息卡片 */
.info-card {
  background: rgba(255, 255, 255, 0.90);
  border-radius: 32rpx;
  padding: 44rpx;
  box-shadow: 0 8rpx 12rpx -8rpx rgba(0, 0, 0, 0.10), 0 20rpx 30rpx -6rpx rgba(0, 0, 0, 0.10);
}

/* 各卡片边框颜色 */
.data-source-card {
  border: 3rpx solid #8EC5FF;
}

.strategy-card {
  border: 3rpx solid #7BF1A8;
}

.level-card {
  border: 3rpx solid #FDA5D5;
}

.end-card {
  border: 3rpx solid #FFDF20;
}

.example-card {
  border: 3rpx solid #A3B3FF;
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.card-emoji {
  font-size: 40rpx;
}

.card-title {
  font-size: 36rpx;
  font-weight: 500;
  color: #6E11B0;
  margin-left: 16rpx;
}

/* 卡片内容 */
.card-content {
  /* 内容样式 */
}

.content-text {
  font-size: 28rpx;
  color: #364153;
  line-height: 1.8;
}

/* 高亮文字 */
.highlight-purple {
  color: #9810FA;
  font-weight: 700;
}

.highlight-green {
  color: #00A63E;
  font-weight: 700;
}

.highlight-orange {
  color: #D08700;
  font-weight: 700;
}

/* 公式区域 */
.formula-section {
  margin-top: 24rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%);
  border-radius: 28rpx;
  border: 3rpx solid #E9D4FF;
}

.formula-label {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #4A5565;
  margin-bottom: 16rpx;
}

.formula-box {
  background: white;
  border-radius: 20rpx;
  padding: 24rpx 32rpx;
  box-shadow: 0 4rpx 8rpx -4rpx rgba(0, 0, 0, 0.10), 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.10);
}

.formula-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  line-height: 2;
}

.formula-w {
  font-size: 28rpx;
  font-weight: 700;
  color: #9810FA;
}

.formula-eq {
  font-size: 28rpx;
  color: #1E2939;
  margin: 0 8rpx;
}

.formula-n {
  font-size: 28rpx;
  color: #364153;
}

.formula-sub {
  font-size: 20rpx;
  color: #1E2939;
  vertical-align: sub;
}

.formula-op {
  font-size: 28rpx;
  color: #1E2939;
  margin: 0 4rpx;
}

.formula-note {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #4A5565;
  margin-top: 16rpx;
}

.formula-note-sub {
  font-size: 18rpx;
  vertical-align: sub;
}

/* 层级表格 */
.level-table {
  border-radius: 16rpx;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: linear-gradient(90deg, #E9D4FF 0%, #FCCEE8 100%);
}

.th {
  padding: 18rpx 8rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #6E11B0;
  text-align: center;
  border: 3rpx solid #DAB2FF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.th-level { flex: 0.7; }
.th-rank { flex: 1.2; }
.th-desc { flex: 1.1; }
.th-sample { flex: 1.3; }
.th-count { flex: 0.9; }
.th-weight { flex: 0.9; }

.table-row {
  display: flex;
}

.td {
  padding: 18rpx 8rpx;
  font-size: 24rpx;
  color: #364153;
  text-align: center;
  border: 3rpx solid #E9D4FF;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-all;
}

.td-level { flex: 0.7; }
.td-rank { flex: 1.2; }
.td-desc { flex: 1.1; }
.td-sample { flex: 1.3; }
.td-count { flex: 0.9; }
.td-weight { flex: 0.9; }

/* 各行背景色 */
.row-l1 { background: #FEF2F2; }
.row-l2 { background: #FFF7ED; }
.row-l3 { background: #FEFCE8; }
.row-l4 { background: #F0FDF4; }
.row-l5 { background: #EFF6FF; }
.row-l6 { background: #FAF5FF; }

/* 层级标签颜色 */
.level-tag {
  font-weight: 700;
}

.level-l1 { color: #E7000B; }
.level-l2 { color: #F54900; }
.level-l3 { color: #D08700; }
.level-l4 { color: #00A63E; }
.level-l5 { color: #155DFC; }
.level-l6 { color: #9810FA; }

/* 测试字数高亮 */
.count-text {
  color: #9810FA;
  font-weight: 700;
}

/* 权重颜色 */
.weight-l1 { color: #E7000B; }
.weight-l2 { color: #F54900; }
.weight-l3 { color: #D08700; }
.weight-l4 { color: #00A63E; }
.weight-l5 { color: #155DFC; }
.weight-l6 { color: #9810FA; }

/* 测试结束机制 */
.end-item {
  display: flex;
  margin-bottom: 16rpx;
}

.end-bullet {
  font-size: 32rpx;
  color: #D08700;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.end-text {
  font-size: 28rpx;
  color: #364153;
  line-height: 1.6;
}

.end-tip {
  margin-top: 24rpx;
  padding: 24rpx;
  background: #FEFCE8;
  border-radius: 20rpx;
  border: 3rpx solid #FFF085;
}

.end-tip-text {
  font-size: 24rpx;
  color: #4A5565;
  text-align: center;
  display: block;
}

/* 计算示例 */
.example-content {
  padding: 32rpx;
  background: linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%);
  border-radius: 28rpx;
  border: 3rpx solid #C6D2FF;
}

.example-warning {
  background: #FEF9C2;
  border-radius: 20rpx;
  border: 1rpx solid #FFDF20;
  padding: 16rpx 24rpx;
  margin-bottom: 24rpx;
}

.warning-text {
  font-size: 24rpx;
  color: #364153;
  text-align: center;
  display: block;
}

.example-label {
  font-size: 28rpx;
  color: #364153;
  display: block;
  margin-bottom: 16rpx;
}

.example-list {
  margin-bottom: 24rpx;
}

.example-item {
  font-size: 24rpx;
  color: #364153;
  display: block;
  line-height: 2;
}

.calc-box {
  background: white;
  border-radius: 8rpx;
  padding: 18rpx 24rpx;
  margin-bottom: 16rpx;
}

.calc-text {
  font-size: 24rpx;
  color: #364153;
}

.result-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-top: 16rpx;
}

.result-label {
  font-size: 32rpx;
  font-weight: 700;
  color: #9810FA;
}

.result-number {
  font-size: 48rpx;
  font-weight: 700;
  color: #9810FA;
  margin: 0 8rpx;
}

.result-unit {
  font-size: 32rpx;
  font-weight: 700;
  color: #9810FA;
}
</style>

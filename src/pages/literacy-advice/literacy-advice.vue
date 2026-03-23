<template>
  <!-- 4-5岁识字学习建议页面 -->
  <view class="page-container">
    <!-- 顶部安全区域 -->
    <view class="safe-area-top"></view>

    <!-- 返回按钮（文档流定位，参考科学原理页面） -->
    <view class="back-btn" @tap="goBack">
      <text class="back-text">← 返回</text>
    </view>

    <!-- 主内容卡片 -->
    <view class="main-card">
      <!-- 顶部 Banner 区域 -->
      <view class="banner">
        <text class="banner-emoji">🎯</text>
        <text class="banner-title">4-5岁 识字学习建议</text>
        <text class="banner-subtitle">专业科学的识字指导方案</text>
      </view>

      <!-- 建议模块列表 -->
      <view class="advice-list">
        <view
          v-for="(item, index) in adviceList"
          :key="index"
          class="advice-card"
          :style="{
            background: item.bgGradient,
            borderColor: item.borderColor
          }"
        >
          <!-- 模块标题 -->
          <view class="advice-header">
            <text class="advice-emoji">{{ item.emoji }}</text>
            <view class="advice-title-wrap">
              <text class="advice-title" :style="{ color: item.titleColor }">
                {{ item.number }}. {{ item.title }}
              </text>
            </view>
          </view>

          <!-- 正文描述 -->
          <view class="advice-body">
            <rich-text :nodes="item.bodyHtml"></rich-text>
          </view>

          <!-- 白色详情框 -->
          <view class="advice-detail-box">
            <view
              v-for="(detail, dIdx) in item.details"
              :key="dIdx"
              class="detail-item"
              :class="{ 'detail-item-border': dIdx > 0 }"
            >
              <!-- 带图标的子标题（如果有） -->
              <view v-if="detail.subTitle" class="detail-sub-header">
                <text class="detail-sub-emoji">{{ detail.subEmoji }}</text>
                <text class="detail-sub-title" :style="{ color: item.titleColor }">{{ detail.subTitle }}</text>
              </view>
              <!-- 带圆点的文字（如果有） -->
              <view v-if="detail.bullet" class="detail-bullet-row">
                <text class="detail-bullet" :style="{ color: item.bulletColor || '#2B7FFF' }">•</text>
                <view class="detail-bullet-content">
                  <rich-text :nodes="detail.bulletHtml"></rich-text>
                </view>
              </view>
              <!-- 普通文字 -->
              <view v-if="detail.text" class="detail-text-wrap">
                <rich-text :nodes="detail.textHtml"></rich-text>
              </view>
            </view>
          </view>
        </view>

        <!-- 底部鼓励语 -->
        <view class="encourage-card">
          <text class="encourage-emoji">✨</text>
          <view class="encourage-text-wrap">
            <rich-text :nodes="encourageHtml"></rich-text>
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
 * 4-5岁识字学习建议页面
 * 静态内容展示页，提供针对4-5岁儿童的科学识字指导方案
 * 参考 Figma 设计稿 304_8
 */
import { ref, onMounted, onUnmounted } from 'vue'
// #ifdef MP-WEIXIN
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
// #endif
import { getDefaultShareConfig, getDefaultTimelineConfig } from '@/utils/share.js'
import { initAudio, playSound, destroyAudio } from '@/utils/audioManager.js'

/**
 * 建议模块数据（数据驱动渲染）
 * 每个模块包含：emoji、编号、标题、正文、详情框内容、主题色
 */
const adviceList = ref([
  {
    emoji: '📊',
    number: 1,
    title: '明确学习优先级：聚焦核心字频',
    titleColor: '#1447E6',
    bgGradient: 'linear-gradient(135deg, #EFF6FF 0%, #FAF5FF 100%)',
    borderColor: '#BEDBFF',
    bulletColor: '#2B7FFF',
    bodyHtml: '<span style="color:#364153;font-size:14px;">在字库的选择上，必须严格遵循字频分布规律。对于4-5岁的孩子，绝大多数精力应集中在</span><span style="color:#155DFC;font-size:14px;font-weight:600;"> 绝对核心字</span><span style="color:#364153;font-size:14px;">（字频 1-50）， 并在学有余力时适当接触</span><span style="color:#155DFC;font-size:14px;font-weight:600;"> 高频基础字</span><span style="color:#364153;font-size:14px;">（字频 51-200）。</span>',
    details: [
      {
        bullet: true,
        bulletHtml: '<span style="color:#1447E6;font-size:14px;font-weight:600;">绝对核心字</span><span style="color:#364153;font-size:14px;">多为人称代词（如：你、我、他）、基础方位（如：上、下、左、右）和高频自然名词（如：日、月、水、火）。</span>'
      },
      {
        bullet: true,
        bulletHtml: '<span style="color:#364153;font-size:14px;">掌握这些字，能最高效地帮助孩子扫清早期阅读的最大障碍。在此阶段，</span><span style="color:#F54900;font-size:14px;font-weight:600;">不需要也不建议</span><span style="color:#364153;font-size:14px;">引入中频常用字或更低频的汉字，以免增加不必要的认知负担，挫伤孩子的积极性。</span>'
      }
    ]
  },
  {
    emoji: '📖',
    number: 2,
    title: '融入情景阅读：科学启蒙与故事化输入',
    titleColor: '#008236',
    bgGradient: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
    borderColor: '#B9F8CF',
    bulletColor: '#00A63E',
    bodyHtml: '<span style="color:#364153;font-size:14px;">孤立地认字卡效率低下且极易遗忘，将汉字融入到高质量的语境中是最佳策略。 可以尝试引入</span><span style="color:#00A63E;font-size:14px;font-weight:600;">科学主题的绘本故事</span><span style="color:#364153;font-size:14px;">， 在探索自然、宇宙或动植物奥秘的有趣情节中，自然而然地高频复现需要掌握的字词。</span>',
    details: [
      {
        text: true,
        textHtml: '<span style="color:#364153;font-size:14px;">当孩子被浩瀚星空或神奇动物的故事吸引时，顺势引导他们关注关键的</span><span style="color:#00A63E;font-size:14px;font-weight:600;">绝对核心字</span><span style="color:#364153;font-size:14px;">， 做到"</span><span style="color:#F54900;font-size:14px;font-weight:600;">字不离词，词不离句</span><span style="color:#364153;font-size:14px;">"， 让识字成为探索世界的副产品。</span>'
      }
    ]
  },
  {
    emoji: '🎮',
    number: 3,
    title: '建立进阶激励机制：游戏化成长路径',
    titleColor: '#CA3500',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FEFCE8 100%)',
    borderColor: '#FFD6A8',
    bulletColor: '#F54900',
    bodyHtml: '<span style="color:#364153;font-size:14px;">为了维持孩子的学习内驱力并缓解大人的辅导焦虑，可以将识字过程设计成一套清晰的进阶体系。 在了解孩子的初始识字水平后，给孩子设定一个友好的起点。</span>',
    details: [
      {
        text: true,
        textHtml: '<span style="color:#364153;font-size:14px;">例如，从刚刚接触汉字的"</span><span style="color:#F54900;font-size:14px;font-weight:600;">识字新手</span><span style="color:#364153;font-size:14px;">"开始， 随着对</span><span style="color:#F54900;font-size:14px;font-weight:600;">绝对核心字</span><span style="color:#364153;font-size:14px;">和</span><span style="color:#F54900;font-size:14px;font-weight:600;">高频基础字</span><span style="color:#364153;font-size:14px;">的逐步掌握， 不断解锁新的阅读关卡并晋级，最终在幼小衔接阶段成长为自主阅读的 "</span><span style="color:#F54900;font-size:14px;font-weight:600;">识字大师</span><span style="color:#364153;font-size:14px;">"。 这种体系化的正向反馈能极大提升孩子的成就感。</span>'
      }
    ]
  },
  {
    emoji: '⏰',
    number: 4,
    title: '科学复习与生活应用',
    titleColor: '#8200DB',
    bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%)',
    borderColor: '#E9D4FF',
    bulletColor: '#9810FA',
    bodyHtml: '<span style="color:#364153;font-size:14px;">4-5岁孩子的注意力集中时间有限，单次"刻意练习"的时间</span><span style="color:#9810FA;font-size:14px;font-weight:600;">不宜超过10-15分钟</span><span style="color:#364153;font-size:14px;">。</span>',
    details: [
      {
        subEmoji: '👀',
        subTitle: '多感官互动',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:14px;">通过字卡进行"寻宝游戏"、"萝卜蹲"，或者用彩色橡皮泥捏出字形。 调动视觉、听觉和触觉多管齐下。</span>'
      },
      {
        subEmoji: '🏪',
        subTitle: '生活化识记',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:14px;">在街上认商店招牌、在超市找包装袋上的字。让汉字回归工具属性， 向孩子证明"</span><span style="color:#9810FA;font-size:14px;font-weight:600;">识字是有用的</span><span style="color:#4A5565;font-size:14px;">"。</span>'
      }
    ]
  }
])

/**
 * 底部鼓励语 HTML
 */
const encourageHtml = ref(
  '<span style="color:#364153;font-size:16px;">记住，识字是一个</span><span style="color:#E60076;font-size:16px;font-weight:600;">循序渐进</span><span style="color:#364153;font-size:16px;">的过程，\n保持耐心和鼓励，让孩子在快乐中成长！</span>'
)

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
 * 返回上一页
 */
const goBack = () => {
  playSound('button')
  uni.navigateBack()
}

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
/* 页面容器 - 粉紫蓝渐变背景 */
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

/* 返回按钮 - 白色半透明 + 紫色边框（文档流定位） */
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

/* 主内容卡片 - 白色圆角 + 橙色边框 */
.main-card {
  margin-top: 32rpx;
  background: #ffffff;
  border-radius: 48rpx;
  border: 7rpx solid #FFD6A8;
  box-shadow: 0 50rpx 100rpx -24rpx rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

/* 顶部 Banner - 紫粉橙渐变 */
.banner {
  background: linear-gradient(90deg, #C27AFF 0%, #FB64B6 50%, #FF8904 100%);
  padding: 48rpx 48rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-emoji {
  font-size: 96rpx;
}

.banner-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #ffffff;
  margin-top: 16rpx;
  text-align: center;
  letter-spacing: 1rpx;
}

.banner-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.90);
  margin-top: 8rpx;
  text-align: center;
}

/* 建议模块列表 */
.advice-list {
  padding: 48rpx;
}

/* 建议卡片 */
.advice-card {
  border-radius: 32rpx;
  border-width: 3rpx;
  border-style: solid;
  padding: 42rpx;
  margin-bottom: 48rpx;
  box-shadow: 0 4rpx 8rpx -4rpx rgba(0, 0, 0, 0.1), 0 8rpx 12rpx -2rpx rgba(0, 0, 0, 0.1);
}

/* 模块标题行 */
.advice-header {
  display: flex;
  align-items: flex-start;
}

.advice-emoji {
  font-size: 60rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.advice-title-wrap {
  flex: 1;
  padding-top: 4rpx;
}

.advice-title {
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1.4;
}

/* 正文描述 */
.advice-body {
  margin-top: 24rpx;
  line-height: 1.7;
}

/* 白色详情框 */
.advice-detail-box {
  background: #ffffff;
  border-radius: 28rpx;
  padding: 32rpx;
  margin-top: 24rpx;
}

/* 详情项 */
.detail-item {
  padding-top: 0;
  padding-bottom: 0;
}

.detail-item + .detail-item {
  margin-top: 24rpx;
}

/* 带分隔线的详情项 */
.detail-item-border {
  border-top: 1rpx solid #E5E7EB;
  padding-top: 24rpx;
}

/* 子标题行 */
.detail-sub-header {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.detail-sub-emoji {
  font-size: 40rpx;
  margin-right: 14rpx;
}

.detail-sub-title {
  font-size: 36rpx;
  font-weight: 600;
}

/* 圆点列表行 */
.detail-bullet-row {
  display: flex;
  align-items: flex-start;
}

.detail-bullet {
  font-size: 28rpx;
  font-weight: 700;
  margin-right: 16rpx;
  flex-shrink: 0;
  line-height: 1.7;
}

.detail-bullet-content {
  flex: 1;
  line-height: 1.7;
}

/* 普通文字 */
.detail-text-wrap {
  line-height: 1.7;
}

/* 底部鼓励语卡片 */
.encourage-card {
  background: linear-gradient(90deg, #FCE7F3 0%, #F3E8FF 100%);
  border-radius: 32rpx;
  border: 3rpx solid #FDA5D5;
  padding: 42rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.encourage-emoji {
  font-size: 60rpx;
}

.encourage-text-wrap {
  margin-top: 16rpx;
  text-align: center;
  line-height: 1.8;
}


</style>

<template>
  <!-- 5-6岁识字学习建议页面 -->
  <view class="page-container">
    <!-- 顶部安全区域 -->
    <view class="safe-area-top"></view>

    <!-- 返回按钮（文档流定位，与4-5岁页面完全一致） -->
    <view class="back-btn" @tap="goBack">
      <text class="back-text">← 返回</text>
    </view>

    <!-- 主内容卡片 -->
    <view class="main-card">
      <!-- 顶部 Banner 区域 -->
      <view class="banner">
        <text class="banner-emoji">🎯</text>
        <text class="banner-title">5-6岁 识字学习建议</text>
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
 * 5-6岁识字学习建议页面
 * 静态内容展示页，提供针对5-6岁儿童的科学识字指导方案
 * 参考 Figma 设计稿 320_2
 * 页面结构严格对齐 4-5岁页面（literacy-advice.vue）
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
 * 数据来源：Figma 设计稿 320_2
 */
const adviceList = ref([
  {
    emoji: '📊',
    number: 1,
    title: '梯度覆盖：从"核心"向"基础"稳步扩张',
    titleColor: '#1447E6',
    bgGradient: 'linear-gradient(135deg, #EFF6FF 0%, #FAF5FF 100%)',
    borderColor: '#BEDBFF',
    bulletColor: '#2B7FFF',
    bodyHtml: '<span style="color:#364153;font-size:14px;">在 5-6 岁阶段，认字不应是随机的，而应基于字频分布进行科学的"扫盲"。</span>',
    details: [
      {
        subEmoji: '🥇',
        subTitle: '第一优先级',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">字频分类：</span><span style="color:#C10007;font-size:12px;font-weight:600;">绝对核心字 (1-50)</span><span style="color:#4A5565;font-size:12px;">　建议占比：</span><span style="color:#C10007;font-size:12px;font-weight:600;">20%</span><br/><span style="color:#E7000B;font-size:12px;font-weight:600;">目标：</span><span style="color:#364153;font-size:12px;">必须达到 100% 识别，并能准确口头造句。</span>'
      },
      {
        subEmoji: '🥈',
        subTitle: '第二优先级',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">字频分类：</span><span style="color:#1447E6;font-size:12px;font-weight:600;">高频基础字 (51-200)</span><span style="color:#4A5565;font-size:12px;">　建议占比：</span><span style="color:#1447E6;font-size:12px;font-weight:600;">50%</span><br/><span style="color:#155DFC;font-size:12px;font-weight:600;">目标：</span><span style="color:#364153;font-size:12px;">本阶段的攻坚重点，需掌握字形与语义的深度关联。</span>'
      },
      {
        subEmoji: '🥉',
        subTitle: '第三优先级',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">字频分类：</span><span style="color:#008236;font-size:12px;font-weight:600;">中频常用字 (201-500)</span><span style="color:#4A5565;font-size:12px;">　建议占比：</span><span style="color:#008236;font-size:12px;font-weight:600;">30%</span><br/><span style="color:#00A63E;font-size:12px;font-weight:600;">目标：</span><span style="color:#364153;font-size:12px;">作为拓展，在阅读中"混个眼熟"，不强求独立默写。</span>'
      },
      {
        subEmoji: '💡',
        subTitle: '专家提示',
        text: true,
        textHtml: '<span style="color:#364153;font-size:12px;">若孩子在测试中连"绝对核心字"都有遗漏，应立即暂停新字学习，优先回滚复习， 因为这些字是构成所有中文句子的骨架。</span>'
      }
    ]
  },
  {
    emoji: '🧩',
    number: 2,
    title: '逻辑进阶：从"象形"转向"部首拆解"',
    titleColor: '#8200DB',
    bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%)',
    borderColor: '#E9D4FF',
    bulletColor: '#9810FA',
    bodyHtml: '<span style="color:#364153;font-size:14px;">5-6 岁孩子的逻辑思维开始发育，可以引入汉字构造的规律，提高识字效率。</span>',
    details: [
      {
        subEmoji: '🔤',
        subTitle: '部首归类法',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">利用汉字"形声"的特点，将同部首的字放在一起。例如，通过"氵"引出</span><span style="color:#9810FA;font-size:12px;font-weight:600;">水、河、湖、海</span><span style="color:#4A5565;font-size:12px;">， 让孩子理解左边代表意思（水），右边往往代表读音。</span>'
      },
      {
        subEmoji: '⛓️',
        subTitle: '字族延伸',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">从一个核心字出发，像滚雪球一样学习。比如从</span><span style="color:#9810FA;font-size:12px;font-weight:600;">"青"</span><span style="color:#4A5565;font-size:12px;">衍生出</span><span style="color:#9810FA;font-size:12px;font-weight:600;">请、清、情、晴</span><span style="color:#4A5565;font-size:12px;">。 这种方式能显著降低记忆负荷。</span>'
      }
    ]
  },
  {
    emoji: '📚',
    number: 3,
    title: '语境浸润：科学主题绘本与功能性阅读',
    titleColor: '#008236',
    bgGradient: 'linear-gradient(135deg, #F0FDF4 0%, #F0FDFA 100%)',
    borderColor: '#B9F8CF',
    bulletColor: '#00A63E',
    bodyHtml: '<span style="color:#364153;font-size:14px;">随着认字量突破 100 字，孤立的字卡已经无法满足认知需求，必须进入"长文本"时代。</span>',
    details: [
      {
        subEmoji: '🔬',
        subTitle: '科学故事化',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">推荐引入带有</span><span style="color:#00A63E;font-size:12px;font-weight:600;">科普性质的原创故事</span><span style="color:#4A5565;font-size:12px;">。 5-6 岁的孩子好奇心极强，通过讲述恐龙进化、太空探索或人体奥秘的故事， 将</span><span style="color:#00A63E;font-size:12px;font-weight:600;">高频基础字</span><span style="color:#4A5565;font-size:12px;">埋入情节中。 当孩子为了读懂"霸王龙为什么厉害"而主动去识字时，学习动机是最强的。</span>'
      },
      {
        subEmoji: '🎭',
        subTitle: '角色扮演阅读',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">家长与孩子分角色朗读，鼓励孩子</span><span style="color:#00A63E;font-size:12px;font-weight:600;">指读</span><span style="color:#4A5565;font-size:12px;">。 指读能有效解决"小和尚念经——有口无心"的问题，确保视觉注意力精准落在字形上。</span>'
      }
    ]
  },
  {
    emoji: '🏆',
    number: 4,
    title: '评估与反馈：建立"等级成就感"',
    titleColor: '#CA3500',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 100%)',
    borderColor: '#FFD6A8',
    bulletColor: '#F54900',
    bodyHtml: '<span style="color:#364153;font-size:14px;">为了避免孩子产生畏难情绪，建议参考</span><span style="color:#F54900;font-size:14px;font-weight:600;">正态分布原则</span><span style="color:#364153;font-size:14px;">建立一套透明的进度体系：</span>',
    details: [
      {
        bullet: true,
        bulletHtml: '<span style="color:#CA3500;font-size:12px;font-weight:600;">分级测评</span><br/><span style="color:#4A5565;font-size:12px;">将 200-300 个目标字分为不同的难度阶梯。</span>'
      },
      {
        bullet: true,
        bulletHtml: '<span style="color:#CA3500;font-size:12px;font-weight:600;">勋章激励</span><br/><span style="color:#4A5565;font-size:12px;">每掌握一个等级（如：从识别 50 字的"萌芽"状态到 200 字的"精英"状态）， 给予明确的仪式感奖励。这种"闯关式"体验非常符合大班孩子的竞争心理。</span>'
      }
    ]
  },
  {
    emoji: '⏰',
    number: 5,
    title: '科学复习：利用碎片化时间',
    titleColor: '#C6005C',
    bgGradient: 'linear-gradient(135deg, #FDF2F8 0%, #FFF1F2 100%)',
    borderColor: '#FCCEE8',
    bulletColor: '#E60076',
    bodyHtml: '',
    details: [
      {
        subEmoji: '🔄',
        subTitle: '高频复现',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">一个新字通常需要</span><span style="color:#E60076;font-size:12px;font-weight:600;">7-15 次高质量的见面</span><span style="color:#4A5565;font-size:12px;">才能进入长时记忆。</span>'
      },
      {
        subEmoji: '🏠',
        subTitle: '家庭实验室',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">在家里张贴"字物标签"，或者在睡前进行 5 分钟的"认字挑战"。</span>'
      }
    ]
  }
])

/**
 * 底部鼓励语 HTML
 */
const encourageHtml = ref(
  '<span style="color:#364153;font-size:16px;">5-6 岁是识字的</span><span style="color:#4F39F6;font-size:16px;font-weight:600;">黄金期</span><span style="color:#364153;font-size:16px;">，\n抓住这个关键阶段，为幼小衔接打下坚实基础！</span>'
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

/* 返回按钮 - 白色半透明 + 紫色边框（文档流定位，与4-5岁页面一致） */
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
  background: linear-gradient(90deg, #E0E7FF 0%, #F3E8FF 100%);
  border-radius: 32rpx;
  border: 3rpx solid #A3B3FF;
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

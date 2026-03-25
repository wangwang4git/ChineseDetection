<template>
  <!-- 幼小衔接识字学习建议页面 -->
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
        <text class="banner-title">幼小衔接 识字学习建议</text>
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
          <text class="encourage-emoji">🎓</text>
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
 * 幼小衔接识字学习建议页面
 * 静态内容展示页，提供针对幼小衔接阶段儿童的科学识字指导方案
 * 参考 Figma 设计稿 320_191
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
 * 数据来源：Figma 设计稿 320_191
 */
const adviceList = ref([
  {
    emoji: '🏗️',
    number: 1,
    title: '科学分层：建立"字频塔"学习模型',
    titleColor: '#1447E6',
    bgGradient: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)',
    borderColor: '#BEDBFF',
    bulletColor: '#2B7FFF',
    bodyHtml: '<span style="color:#364153;font-size:14px;">在 300-500 字的跨越中，乱序识字是效率低下的根源。建议将目标字库严格按照字频进行优先级拆解：</span>',
    details: [
      {
        subEmoji: '🎯',
        subTitle: '第一阶段：巩固"地基"',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">必须 100% 掌握</span><span style="color:#E7000B;font-size:12px;font-weight:600;">绝对核心字</span><span style="color:#4A5565;font-size:12px;">（字频 1-50）和</span><span style="color:#E7000B;font-size:12px;font-weight:600;">高频基础字</span><span style="color:#4A5565;font-size:12px;">（字频 51-200）。 这些字构成了中文书面语约 50% 的出现率，是阅读的"入场券"。</span>'
      },
      {
        subEmoji: '🚀',
        subTitle: '第二阶段：拓展"骨干"',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">重点突破</span><span style="color:#155DFC;font-size:12px;font-weight:600;">中频常用字</span><span style="color:#4A5565;font-size:12px;">（字频 201-500）。 这些字多涉及抽象概念和复杂的动作描述（如：思、考、准备、虽然），是理解句意的关键。</span>'
      },
      {
        subEmoji: '⚠️',
        subTitle: '第三阶段：预警与规避',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">对于</span><span style="color:#D08700;font-size:12px;font-weight:600;">次常用字</span><span style="color:#4A5565;font-size:12px;">及之后的</span><span style="color:#D08700;font-size:12px;font-weight:600;">生僻/书面字</span><span style="color:#4A5565;font-size:12px;">， 此阶段仅需在阅读中"偶遇"即可，严禁进行高强度背诵，以免挫伤学习积极性。</span>'
      }
    ]
  },
  {
    emoji: '🧠',
    number: 2,
    title: '逻辑进阶：从"图形记忆"转向"结构解构"',
    titleColor: '#8200DB',
    bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%)',
    borderColor: '#E9D4FF',
    bulletColor: '#9810FA',
    bodyHtml: '<span style="color:#364153;font-size:14px;">幼小衔接的孩子具象思维已趋于成熟，应引入</span><span style="color:#9810FA;font-size:14px;font-weight:600;">汉字部件分析法</span><span style="color:#364153;font-size:14px;">， 利用逻辑减少记忆负担：</span>',
    details: [
      {
        subEmoji: '📋',
        subTitle: '部首语义归类',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">引导孩子发现规律。例如，</span><span style="color:#9810FA;font-size:12px;font-weight:600;">"犭"部</span><span style="color:#4A5565;font-size:12px;">（狼、狗、狮、猫）多与动物有关，</span><span style="color:#9810FA;font-size:12px;font-weight:600;">"忄"部</span><span style="color:#4A5565;font-size:12px;">（情、惊、怕、忙）多与心理有关。</span>'
      },
      {
        subEmoji: '🔊',
        subTitle: '形声字推导',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">通过"声旁"预测读音。如</span><span style="color:#9810FA;font-size:12px;font-weight:600;">"青"字族</span><span style="color:#4A5565;font-size:12px;">（清、情、晴、请、睛），让孩子理解汉字是可以被"推导"出来的，而非死记硬背的图形。</span>'
      }
    ]
  },
  {
    emoji: '📚',
    number: 3,
    title: '语境实战：从"短句阅读"迈向"科学主题探索"',
    titleColor: '#008236',
    bgGradient: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
    borderColor: '#B9F8CF',
    bulletColor: '#00C950',
    bodyHtml: '<span style="color:#364153;font-size:14px;">孤立的识字无法转化为阅读能力。建议通过</span><span style="color:#00A63E;font-size:14px;font-weight:600;">科学主题故事</span><span style="color:#364153;font-size:14px;">进行沉浸式学习：</span>',
    details: [
      {
        bullet: true,
        bulletHtml: '<span style="color:#008236;font-size:14px;font-weight:600;">跨学科融合</span><br/><span style="color:#4A5565;font-size:12px;">选择关于自然科学（如物种演化、二十四节气）的科普读物。在探索"种子如何发芽"的过程中， 反复接触</span><span style="color:#00A63E;font-size:12px;font-weight:600;">绝对核心字</span><span style="color:#4A5565;font-size:12px;">和</span><span style="color:#00A63E;font-size:12px;font-weight:600;">高频基础字</span><span style="color:#4A5565;font-size:12px;">。</span>'
      },
      {
        bullet: true,
        bulletHtml: '<span style="color:#008236;font-size:14px;font-weight:600;">高频复现率</span><br/><span style="color:#4A5565;font-size:12px;">确保目标汉字在阅读材料中的复现率达到</span><span style="color:#00A63E;font-size:12px;font-weight:600;">7-10 次</span><span style="color:#4A5565;font-size:12px;">。 对于不认识的字，鼓励孩子结合上下文语境进行"猜读"，这是小学语文核心能力的预演。</span>'
      }
    ]
  },
  {
    emoji: '📊',
    number: 4,
    title: '评估与诊断：建立"五级能力矩阵"',
    titleColor: '#CA3500',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 100%)',
    borderColor: '#FFD6A8',
    bulletColor: '#F54900',
    bodyHtml: '<span style="color:#364153;font-size:14px;">为了精准掌握进度，建议将孩子的识字状态划分为五个能力等级，进行动态追踪：</span>',
    details: [
      {
        subEmoji: '🌱',
        subTitle: '新手级（0-100 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;font-weight:600;">认知特征：</span><span style="color:#4A5565;font-size:12px;">仅认识少数象形字、数字。</span><br/><span style="color:#F54900;font-size:12px;font-weight:600;">核心任务：</span><span style="color:#4A5565;font-size:12px;">攻克绝对核心字。</span>'
      },
      {
        subEmoji: '🔍',
        subTitle: '探索级（101-200 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;font-weight:600;">认知特征：</span><span style="color:#4A5565;font-size:12px;">能识别常见基础字，阅读依赖拼音。</span><br/><span style="color:#F54900;font-size:12px;font-weight:600;">核心任务：</span><span style="color:#4A5565;font-size:12px;">熟练掌握高频基础字。</span>'
      },
      {
        subEmoji: '📈',
        subTitle: '进阶级（201-350 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;font-weight:600;">认知特征：</span><span style="color:#4A5565;font-size:12px;">能阅读短篇故事，开始理解部首。</span><br/><span style="color:#F54900;font-size:12px;font-weight:600;">核心任务：</span><span style="color:#4A5565;font-size:12px;">大量输入中频常用字。</span>'
      },
      {
        subEmoji: '⭐',
        subTitle: '卓越级（351-500 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;font-weight:600;">认知特征：</span><span style="color:#4A5565;font-size:12px;">具备初步自主阅读能力，能猜读。</span><br/><span style="color:#F54900;font-size:12px;font-weight:600;">核心任务：</span><span style="color:#4A5565;font-size:12px;">建立字与字之间的逻辑链。</span>'
      },
      {
        subEmoji: '👑',
        subTitle: '大师级（500+ 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;font-weight:600;">认知特征：</span><span style="color:#4A5565;font-size:12px;">能够流利阅读小学低年级课外书。</span><br/><span style="color:#F54900;font-size:12px;font-weight:600;">核心任务：</span><span style="color:#4A5565;font-size:12px;">保持阅读习惯，防止遗忘。</span>'
      }
    ]
  },
  {
    emoji: '⏰',
    number: 5,
    title: '习惯养成：模拟小学课堂的"专注力训练"',
    titleColor: '#C6005C',
    bgGradient: 'linear-gradient(135deg, #FDF2F8 0%, #FAF5FF 100%)',
    borderColor: '#FCCEE8',
    bulletColor: '#F6339A',
    bodyHtml: '',
    details: [
      {
        bullet: true,
        bulletHtml: '<span style="color:#C6005C;font-size:14px;font-weight:600;">限时识读</span><br/><span style="color:#4A5565;font-size:12px;">模仿小学课堂，进行</span><span style="color:#E60076;font-size:12px;font-weight:600;">15-20 分钟</span><span style="color:#4A5565;font-size:12px;">的专注识读练习。</span>'
      },
      {
        bullet: true,
        bulletHtml: '<span style="color:#C6005C;font-size:14px;font-weight:600;">从"认"到"用"</span><br/><span style="color:#4A5565;font-size:12px;">鼓励孩子用新学会的字口头编故事，或者在生活场景（如说明书、路牌）中寻找学过的字， 完成从</span><span style="color:#E60076;font-size:12px;font-weight:600;">"被动识字"</span><span style="color:#4A5565;font-size:12px;">到</span><span style="color:#E60076;font-size:12px;font-weight:600;">"主动应用"</span><span style="color:#4A5565;font-size:12px;">的转换。</span>'
      }
    ]
  }
])

/**
 * 底部鼓励语 HTML
 */
const encourageHtml = ref(
  '<span style="color:#364153;font-size:16px;">幼小衔接是关键阶段，</span><span style="color:#155DFC;font-size:16px;font-weight:600;">科学规划、稳步推进</span><span style="color:#364153;font-size:16px;">，\n为小学学习奠定坚实基础！</span>'
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
  background: linear-gradient(90deg, #DBEAFE 0%, #F3E8FF 100%);
  border-radius: 32rpx;
  border: 3rpx solid #8EC5FF;
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

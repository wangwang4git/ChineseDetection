<template>
  <!-- 1-2年级识字学习建议页面 -->
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
        <text class="banner-title">1～2年级 识字学习建议</text>
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
          <text class="encourage-emoji">📖</text>
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
 * 1-2年级识字学习建议页面
 * 静态内容展示页，提供针对1-2年级儿童的科学识字指导方案
 * 参考 Figma 设计稿 320_384
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
 * 数据来源：Figma 设计稿 320_384
 */
const adviceList = ref([
  {
    emoji: '🎯',
    number: 1,
    title: '目标拆解：基于"字频金字塔"的 1600 字路径',
    titleColor: '#1447E6',
    bgGradient: 'linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)',
    borderColor: '#BEDBFF',
    bulletColor: '#2B7FFF',
    bodyHtml: '<span style="color:#364153;font-size:14px;">面对 1600 字的巨大体量，必须按字频优先级分步"蚕食"，避免平均用力：</span>',
    details: [
      {
        subEmoji: '🥇',
        subTitle: '第一梯队：自动化识别（1-500 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">涵盖</span><span style="color:#00A63E;font-size:12px;font-weight:600;">绝对核心字</span><span style="color:#4A5565;font-size:12px;">与</span><span style="color:#00A63E;font-size:12px;font-weight:600;">高频基础字</span><span style="color:#4A5565;font-size:12px;">。</span><br/><span style="color:#008236;font-size:12px;font-weight:600;">目标：</span><span style="color:#364153;font-size:12px;">达到"秒认"水平，不经大脑思考即可脱口而出。这是阅读流畅度的核心保证。</span>'
      },
      {
        subEmoji: '🥈',
        subTitle: '第二梯队：阅读攻坚（501-1000 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">涵盖</span><span style="color:#155DFC;font-size:12px;font-weight:600;">中频常用字</span><span style="color:#4A5565;font-size:12px;">与</span><span style="color:#155DFC;font-size:12px;font-weight:600;">次常用字</span><span style="color:#4A5565;font-size:12px;">。</span><br/><span style="color:#1447E6;font-size:12px;font-weight:600;">目标：</span><span style="color:#364153;font-size:12px;">通过部首和语境能准确辨析。这些字是童话故事、看图写话中的高频词汇。</span>'
      },
      {
        subEmoji: '🥉',
        subTitle: '第三梯队：词汇拓展（1001-1600 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">涵盖</span><span style="color:#9810FA;font-size:12px;font-weight:600;">低频拓展字</span><span style="color:#4A5565;font-size:12px;">及部分</span><span style="color:#9810FA;font-size:12px;font-weight:600;">生僻/书面字</span><span style="color:#4A5565;font-size:12px;">。</span><br/><span style="color:#8200DB;font-size:12px;font-weight:600;">目标：</span><span style="color:#364153;font-size:12px;">在特定语境下理解含义，为 3 年级及之后的整本书阅读打基础。</span>'
      }
    ]
  },
  {
    emoji: '🧠',
    number: 2,
    title: '方法进阶：从"单字记忆"转向"逻辑解构"',
    titleColor: '#8200DB',
    bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%)',
    borderColor: '#E9D4FF',
    bulletColor: '#9810FA',
    bodyHtml: '<span style="color:#364153;font-size:14px;">1-2 年级孩子已具备较强的抽象思维能力，应利用汉字的结构规律实现"成串识记"：</span>',
    details: [
      {
        subEmoji: '🔍',
        subTitle: '部首归类与溯源',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">利用"形旁表义"规律。比如，学习</span><span style="color:#9810FA;font-size:12px;font-weight:600;">"提手旁（扌）"</span><span style="color:#4A5565;font-size:12px;">时， 一次性串联</span><span style="color:#9810FA;font-size:12px;font-weight:600;">推、拉、提、拔、扛</span><span style="color:#4A5565;font-size:12px;">等动作词。 通过理解部首含义，孩子能实现从"背字"到"解字"的飞跃。</span>'
      },
      {
        subEmoji: '🔊',
        subTitle: '形声字"声旁"推断',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">教会孩子观察"右半部分"的读音线索（如：</span><span style="color:#9810FA;font-size:12px;font-weight:600;">请、清、情、晴</span><span style="color:#4A5565;font-size:12px;">）。 这种方法能让孩子在遇到陌生字时，具备 60% 以上的准确猜读能力。</span>'
      },
      {
        subEmoji: '📝',
        subTitle: '字族文识字',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">将字形相近的字编成儿歌或短文，在对比中加深印象，有效减少低年级常见的"错别字"现象。</span>'
      }
    ]
  },
  {
    emoji: '📚',
    number: 3,
    title: '语境实战：从"图文书"迈向"纯文字阅读"',
    titleColor: '#008236',
    bgGradient: 'linear-gradient(135deg, #F0FDF4 0%, #F0FDFA 100%)',
    borderColor: '#B9F8CF',
    bulletColor: '#00A63E',
    bodyHtml: '<span style="color:#364153;font-size:14px;">为了巩固 1600 字的识字量，阅读必须从"被动听"转向"主动读"：</span>',
    details: [
      {
        subEmoji: '🌉',
        subTitle: '桥梁书过渡',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">选择文字量适中、配有少量插图的"桥梁书"。这些书的遣词造句多采用</span><span style="color:#00A63E;font-size:12px;font-weight:600;">次常用字</span><span style="color:#4A5565;font-size:12px;">和</span><span style="color:#00A63E;font-size:12px;font-weight:600;">中频常用字</span><span style="color:#4A5565;font-size:12px;">， 非常适合 1 年级下学期的孩子。</span>'
      },
      {
        subEmoji: '🔬',
        subTitle: '科学与百科阅读',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">引入</span><span style="color:#00A63E;font-size:12px;font-weight:600;">科学主题故事</span><span style="color:#4A5565;font-size:12px;">。 当孩子在阅读关于"气象变化"或"人体结构"的内容时，会接触到大量特定的</span><span style="color:#00A63E;font-size:12px;font-weight:600;">低频拓展字</span><span style="color:#4A5565;font-size:12px;">。 这些词汇在生活场景中少见，但在书面语中极具价值。</span>'
      },
      {
        subEmoji: '📖',
        subTitle: '大声朗读与指读习惯',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">坚持每天</span><span style="color:#00A63E;font-size:12px;font-weight:600;">15 分钟</span><span style="color:#4A5565;font-size:12px;">的大声朗读， 能通过"声画同步"强化大脑对字形的深层记忆。</span>'
      }
    ]
  },
  {
    emoji: '🚦',
    number: 4,
    title: '评估诊断：建立"识字红绿灯"监控体系',
    titleColor: '#CA3500',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FEF2F2 100%)',
    borderColor: '#FFD6A8',
    bulletColor: '#F54900',
    bodyHtml: '<span style="color:#364153;font-size:14px;">家长需定期对比"实测识字量"与"标准目标"，关注孩子的不认识汉字分布：</span>',
    details: [
      {
        subEmoji: '🟢',
        subTitle: '绿色通行',
        text: true,
        textHtml: '<span style="color:#00A63E;font-size:12px;font-weight:600;">绝对核心字</span><span style="color:#364153;font-size:12px;">（1-50） 掌握率 </span><span style="color:#008236;font-size:12px;font-weight:700;">100%</span><span style="color:#364153;font-size:12px;">。</span>'
      },
      {
        subEmoji: '🟡',
        subTitle: '黄色预警',
        text: true,
        textHtml: '<span style="color:#D08700;font-size:12px;font-weight:600;">高频基础字</span><span style="color:#364153;font-size:12px;">（51-200） 存在 </span><span style="color:#A65F00;font-size:12px;font-weight:700;">10% 以上</span><span style="color:#364153;font-size:12px;">的遗漏。 这会直接导致阅读时的顿挫感，需通过强化复习解决。</span>'
      },
      {
        subEmoji: '🔴',
        subTitle: '红色预警',
        text: true,
        textHtml: '<span style="color:#E7000B;font-size:12px;font-weight:600;">中频常用字</span><span style="color:#364153;font-size:12px;">（201-500） 掌握率低于 </span><span style="color:#C10007;font-size:12px;font-weight:700;">70%</span><span style="color:#364153;font-size:12px;">。 这预示着孩子在 2 年级可能会出现阅读理解困难。</span>'
      }
    ]
  },
  {
    emoji: '✍️',
    number: 5,
    title: '应用转型：从"识字"到"写字"与"造句"',
    titleColor: '#C6005C',
    bgGradient: 'linear-gradient(135deg, #FDF2F8 0%, #FAF5FF 100%)',
    borderColor: '#FCCEE8',
    bulletColor: '#F6339A',
    bodyHtml: '<span style="color:#364153;font-size:14px;">1-2 年级识字的最终目的是为了"用"。</span>',
    details: [
      {
        bullet: true,
        bulletHtml: '<span style="color:#C6005C;font-size:14px;font-weight:600;">词组扩展</span><br/><span style="color:#4A5565;font-size:12px;">每学一个新字，尝试组 3 个以上的词（如：学——</span><span style="color:#E60076;font-size:12px;font-weight:600;">学生、学习、学问</span><span style="color:#4A5565;font-size:12px;">）。</span>'
      },
      {
        bullet: true,
        bulletHtml: '<span style="color:#C6005C;font-size:14px;font-weight:600;">生活应用</span><br/><span style="color:#4A5565;font-size:12px;">鼓励孩子写"每日一句话"或简单的生活便签。当孩子发现学过的</span><span style="color:#E60076;font-size:12px;font-weight:600;">高频基础字</span><span style="color:#4A5565;font-size:12px;">能变成他表达情感的工具时，识字的内驱力将不可阻挡。</span>'
      }
    ]
  }
])

/**
 * 底部鼓励语 HTML
 */
const encourageHtml = ref(
  '<span style="color:#364153;font-size:16px;">1-2 年级是</span><span style="color:#00A63E;font-size:16px;font-weight:600;">识字能力系统化建设</span><span style="color:#364153;font-size:16px;">的关键期，\n循序渐进，稳扎稳打！</span>'
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
  background: linear-gradient(90deg, #DCFCE7 0%, #DBEAFE 100%);
  border-radius: 32rpx;
  border: 3rpx solid #7BF1A8;
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

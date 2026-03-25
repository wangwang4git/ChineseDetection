<template>
  <!-- 3-4年级识字学习建议页面 -->
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
        <text class="banner-title">3～4年级 识字学习建议</text>
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
          <text class="encourage-emoji">🚀</text>
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
 * 3-4年级识字学习建议页面
 * 静态内容展示页，提供针对3-4年级儿童的科学识字指导方案
 * 参考 Figma 设计稿 320_577
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
 * 数据来源：Figma 设计稿 320_577
 */
const adviceList = ref([
  {
    emoji: '🎯',
    number: 1,
    title: '目标聚焦：攻克字频金字塔的"最后一公里"',
    titleColor: '#432DD7',
    bgGradient: 'linear-gradient(135deg, #EEF2FF 0%, #EFF6FF 100%)',
    borderColor: '#C6D2FF',
    bulletColor: '#432DD7',
    bodyHtml: '<span style="color:#364153;font-size:14px;">在已掌握约 1600 字的基础上，3-4 年级的核心任务是完成从常用字到书面语词汇的跨越：</span>',
    details: [
      {
        subEmoji: '🥇',
        subTitle: '第一优先级：补齐缺漏（1-1000 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">确保</span><span style="color:#E7000B;font-size:12px;font-weight:600;">绝对核心字</span><span style="color:#4A5565;font-size:12px;">、</span><span style="color:#E7000B;font-size:12px;font-weight:600;">高频基础字</span><span style="color:#4A5565;font-size:12px;">到</span><span style="color:#E7000B;font-size:12px;font-weight:600;">次常用字</span><span style="color:#4A5565;font-size:12px;">无死角。 如果这些字仍有遗漏，会直接影响对数学概念和科学定义的准确理解。</span>'
      },
      {
        subEmoji: '🥈',
        subTitle: '第二优先级：攻坚书面语（1001-2500 字）',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">重点学习</span><span style="color:#155DFC;font-size:12px;font-weight:600;">低频拓展字</span><span style="color:#4A5565;font-size:12px;">（1001-1500）与</span><span style="color:#155DFC;font-size:12px;font-weight:600;">生僻/书面字</span><span style="color:#4A5565;font-size:12px;">（1501-2500）。</span><br/><span style="color:#364153;font-size:12px;">这些字大量出现在科普读物、历史典故和文学名著中， 是孩子从"口语表达"迈向"书面雅言"的桥梁。</span>'
      }
    ]
  },
  {
    emoji: '🔬',
    number: 2,
    title: '方法革新：从"结构识字"提升为"语义解构"',
    titleColor: '#8200DB',
    bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
    borderColor: '#E9D4FF',
    bulletColor: '#9810FA',
    bodyHtml: '<span style="color:#364153;font-size:14px;">利用 3-4 年级孩子更强的逻辑分析能力，采用更高效的推导识字法：</span>',
    details: [
      {
        subEmoji: '📖',
        subTitle: '字族文与同音字辨析',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">此阶段极易出现同音错别字（如：</span><span style="color:#9810FA;font-size:12px;font-weight:600;">辨、辩、瓣、辫</span><span style="color:#4A5565;font-size:12px;">）。 通过对比其部首的含义（</span><span style="color:#9810FA;font-size:12px;font-weight:600;">辛、言、瓜、纟</span><span style="color:#4A5565;font-size:12px;">） 进行深度区分，从根源上解决错别字问题。</span>'
      },
      {
        subEmoji: '📜',
        subTitle: '字理溯源与文化浸润',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">引入汉字的演变历史。通过了解一个字从甲骨文到小篆再到楷书的过程， 让孩子理解汉字背后的文化逻辑。</span>'
      },
      {
        subEmoji: '🌐',
        subTitle: '多义字与词丛扩展',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">不再孤立记字，而是通过"一字多词"建立词汇网络。例如学习</span><span style="color:#9810FA;font-size:12px;font-weight:600;">"临"</span><span style="color:#4A5565;font-size:12px;">字， 同时掌握</span><span style="color:#9810FA;font-size:12px;font-weight:600;">临死、临摹、临近、身临其境</span><span style="color:#4A5565;font-size:12px;">， 理解其在不同语境下的语义偏移。</span>'
      }
    ]
  },
  {
    emoji: '📚',
    number: 3,
    title: '语境实战：跨学科的"功能性阅读"',
    titleColor: '#008236',
    bgGradient: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
    borderColor: '#B9F8CF',
    bulletColor: '#00A63E',
    bodyHtml: '<span style="color:#364153;font-size:14px;">3-4 年级是科学、历史、地理知识爆发的时期，识字应与知识获取深度融合：</span>',
    details: [
      {
        subEmoji: '🔭',
        subTitle: '科学主题故事与深度科普',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">利用孩子对世界的好奇心，引入关于宇宙、生命科学或工程技术的</span><span style="color:#00A63E;font-size:12px;font-weight:600;">科学主题故事</span><span style="color:#4A5565;font-size:12px;">。 在这些硬核内容的阅读中，孩子会自然接触到大量</span><span style="color:#00A63E;font-size:12px;font-weight:600;">低频拓展字</span><span style="color:#4A5565;font-size:12px;">。 这种基于兴趣的"被动识字"记忆效果远好于机械背诵。</span>'
      },
      {
        subEmoji: '📕',
        subTitle: '整本书阅读计划',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">从桥梁书彻底过渡到纯文字的青少年文学、科普名著。 要求孩子在阅读时不仅"识其字"，更要"通其意"， 培养在复杂文本中通过上下文推断生僻字含义的能力。</span>'
      },
      {
        subEmoji: '📖',
        subTitle: '工具书的自主应用',
        text: true,
        textHtml: '<span style="color:#4A5565;font-size:12px;">培养孩子在遇到</span><span style="color:#00A63E;font-size:12px;font-weight:600;">生僻/书面字</span><span style="color:#4A5565;font-size:12px;">时， 熟练使用字典或数字化检索工具的习惯， 完成从"依赖他人"到"自我增量"的转变。</span>'
      }
    ]
  },
  {
    emoji: '📊',
    number: 4,
    title: '评估与监控：建立"精密识字坐标系"',
    titleColor: '#CA3500',
    bgGradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 100%)',
    borderColor: '#FFD6A8',
    bulletColor: '#FF6900',
    bodyHtml: '<span style="color:#364153;font-size:14px;">建议家长或老师利用数据化的方式，对孩子的识字进度进行梯度分析：</span>',
    details: [
      {
        bullet: true,
        bulletHtml: '<span style="color:#CA3500;font-size:14px;font-weight:600;">定期"地毯式"扫描</span><br/><span style="color:#4A5565;font-size:12px;">针对</span><span style="color:#F54900;font-size:12px;font-weight:600;">2500 个常用汉字</span><span style="color:#4A5565;font-size:12px;">进行分级测试， 识别出孩子在</span><span style="color:#F54900;font-size:12px;font-weight:600;">低频拓展字</span><span style="color:#4A5565;font-size:12px;">分组中的具体薄弱项。</span>'
      },
      {
        bullet: true,
        bulletHtml: '<span style="color:#CA3500;font-size:14px;font-weight:600;">建立"误字库"</span><br/><span style="color:#4A5565;font-size:12px;">将阅读和写作中出现的错误，按照字频进行标记。 如果错误出现在</span><span style="color:#F54900;font-size:12px;font-weight:600;">绝对核心字</span><span style="color:#4A5565;font-size:12px;">范畴， 需发出"高能预警"并进行专项矫正。</span>'
      }
    ]
  },
  {
    emoji: '✍️',
    number: 5,
    title: '输出驱动：从"识记"向"精准表达"转化',
    titleColor: '#C6005C',
    bgGradient: 'linear-gradient(135deg, #FDF2F8 0%, #FFF1F2 100%)',
    borderColor: '#FCCEE8',
    bulletColor: '#F6339A',
    bodyHtml: '',
    details: [
      {
        bullet: true,
        bulletHtml: '<span style="color:#C6005C;font-size:14px;font-weight:600;">创意写作与读书笔记</span><br/><span style="color:#4A5565;font-size:12px;">鼓励孩子在写作中尝试使用新学会的</span><span style="color:#E60076;font-size:12px;font-weight:600;">书面字</span><span style="color:#4A5565;font-size:12px;">。 从简单的"看图说话"转向有逻辑、有修辞的"主题作文"。</span>'
      },
      {
        bullet: true,
        bulletHtml: '<span style="color:#C6005C;font-size:14px;font-weight:600;">词汇地图（Vocabulary Mapping）</span><br/><span style="color:#4A5565;font-size:12px;">引导孩子围绕一个核心主题（如"情绪"、"自然景观"），绘制词汇地图， 将相关的</span><span style="color:#E60076;font-size:12px;font-weight:600;">中频常用字</span><span style="color:#4A5565;font-size:12px;">和</span><span style="color:#E60076;font-size:12px;font-weight:600;">低频拓展字</span><span style="color:#4A5565;font-size:12px;">串联起来， 形成结构化的表达体系。</span>'
      }
    ]
  }
])

/**
 * 底部鼓励语 HTML
 */
const encourageHtml = ref(
  '<span style="color:#364153;font-size:16px;">3-4 年级是</span><span style="color:#4F39F6;font-size:16px;font-weight:600;">识字能力质变</span><span style="color:#364153;font-size:16px;">的关键期，\n从常用字迈向书面语，开启深度阅读之旅！</span>'
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

<template>
  <!-- ua-markdown 组件 - 基于 mp-html 的 Markdown 渲染 -->
  <mp-html 
    class="ua-markdown"
    :content="source" 
    :markdown="true"
    :tag-style="tagStyle"
    :selectable="selectable"
    :lazy-load="lazyLoad"
    @ready="onReady"
    @error="onError"
  />
</template>

<script setup>
/**
 * ua-markdown 组件
 * 基于 mp-html 组件实现 Markdown 渲染
 * 使用 mp-html 内置的 markdown 插件直接解析
 */
defineProps({
  source: { type: String, default: '' },
  selectable: { type: Boolean, default: true },
  lazyLoad: { type: Boolean, default: true }
})

const emit = defineEmits(['ready', 'error'])

// mp-html 标签样式配置
const tagStyle = {
  p: 'margin: 6px 0; line-height: 1.7; font-size: 14px; color: #1E2939;',
  strong: 'font-weight: 600; color: #1E2939;',
  b: 'font-weight: 600; color: #1E2939;',
  em: 'font-style: italic;',
  ul: 'padding-left: 20px; margin: 6px 0;',
  ol: 'padding-left: 20px; margin: 6px 0;',
  li: 'margin: 4px 0; line-height: 1.6;',
  blockquote: 'margin: 8px 0; padding: 8px 10px; background: rgba(194, 122, 255, 0.1); border-left: 3px solid #C27AFF; border-radius: 0 6px 6px 0; color: #4A5565; font-style: italic;',
  code: 'font-family: Consolas, Monaco, monospace; font-size: 13px; background: rgba(194, 122, 255, 0.15); padding: 2px 6px; border-radius: 4px; color: #9810FA;',
  pre: 'margin: 8px 0; padding: 10px; background: #1E2939; border-radius: 6px; overflow-x: auto; color: #E5E7EB;',
  a: 'color: #51A2FF; text-decoration: underline;',
  h1: 'font-size: 20px; font-weight: 700; color: #1E2939; margin: 12px 0 8px 0;',
  h2: 'font-size: 18px; font-weight: 600; color: #1E2939; margin: 10px 0 7px 0;',
  h3: 'font-size: 16px; font-weight: 600; color: #1E2939; margin: 9px 0 6px 0;',
  hr: 'height: 1px; background: #E5E7EB; margin: 12px 0; border: none;'
}

const onReady = () => emit('ready')
const onError = (e) => emit('error', e)
</script>

<style scoped>
.ua-markdown {
  font-size: 28rpx;
  color: #1E2939;
  line-height: 1.7;
  word-break: break-all;
}
</style>

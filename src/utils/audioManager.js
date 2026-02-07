/**
 * 音频管理器
 * 为微信小程序环境下的按钮点击音效播放提供统一管理能力
 * 采用单例音频实例池模式，为每种音效维护独立的 InnerAudioContext 实例
 */

// 音效类型到文件路径的映射
const AUDIO_MAP = {
  button: '/static/audio/button-pressed.mp3',
  success: '/static/audio/success.mp3',
  fail: '/static/audio/fail.mp3'
}

// 音频实例池
let audioInstances = null

// 引用计数：跟踪有多少个页面正在使用音频实例池
let refCount = 0

/**
 * 初始化音频实例池
 * 为每种音效预创建独立的 InnerAudioContext 实例
 * 采用引用计数机制，多个页面共享同一实例池，避免后卸载的页面误销毁前一个页面仍在使用的实例
 * 应在页面 onLoad / onMounted 时调用
 */
export function initAudio() {
  // #ifdef MP-WEIXIN
  refCount++
  if (audioInstances) return

  audioInstances = {}

  Object.entries(AUDIO_MAP).forEach(([type, src]) => {
    const ctx = uni.createInnerAudioContext()
    ctx.src = src
    ctx.obeyMuteSwitch = false
    ctx.useWebAudioImplement = true
    ctx.volume = 1

    ctx.onError((err) => {
      console.error(`[audioManager] ${type} 播放错误:`, err)
    })

    audioInstances[type] = ctx
  })
  // #endif
}

/**
 * 播放指定类型的音效
 * 快速连续点击时：pause → seek(0) → play，确保每次点击都能听到完整音效开头
 * 注意：使用 pause() 而非 stop()，因为 stop() 会清除已加载的音频 buffer，导致后续播放静默失败
 * @param {'button' | 'success' | 'fail'} type - 音效类型
 */
export function playSound(type) {
  // #ifdef MP-WEIXIN
  if (!audioInstances) return

  const ctx = audioInstances[type]
  if (!ctx) {
    console.warn(`[audioManager] 未知音效类型: ${type}`)
    return
  }

  ctx.pause()
  ctx.seek(0)
  ctx.play()
  // #endif
}

/**
 * 销毁所有音频实例
 * 采用引用计数机制，仅当最后一个使用者卸载时才真正销毁实例
 * 应在页面 onUnmounted 时调用，防止内存泄漏
 */
export function destroyAudio() {
  // #ifdef MP-WEIXIN
  if (!audioInstances) return

  refCount--
  if (refCount > 0) return

  Object.values(audioInstances).forEach((ctx) => {
    ctx.stop()
    ctx.destroy()
  })

  audioInstances = null
  // #endif
}

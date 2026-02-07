# Design: 按钮点击音效

## 架构方案

### 音频管理器（audioManager.js）

采用**单例音频实例池 + 引用计数**模式，为每种音效维护独立的 `InnerAudioContext` 实例，多个页面共享同一实例池。

```
audioManager.js
├── init()          // 初始化所有音频实例（页面 onLoad 时调用），引用计数 +1
├── play(type)      // 播放指定类型音效：'button' | 'success' | 'fail'
├── destroy()       // 引用计数 -1，降为 0 时销毁所有音频实例（页面 onUnmounted 时调用）
└── 内部
    ├── audioInstances: Map<string, InnerAudioContext>  // 实例池
    ├── refCount: number                                // 引用计数
    └── AUDIO_MAP: { button, success, fail } → 文件路径映射
```

### 为什么用实例池而不是单实例

**问题**：单个 `InnerAudioContext` 实例切换 `src` 后需要重新加载，存在延迟。快速点击不同按钮时会出现音效错乱。

**方案**：为每种音效（button/success/fail）各创建一个独立实例，`src` 在 `init()` 时一次性设定，之后 `play()` 仅调用 `pause()` + `seek(0)` + `play()`，无需重新加载资源。

### 快速连续点击处理

当用户快速连续点击同一按钮时：

1. 调用当前实例的 `pause()` 暂停正在播放的音效（保留已加载的音频 buffer）
2. 调用 `seek(0)` 将播放位置重置到起始
3. 调用 `play()` 重新开始播放

> **注意**：此处使用 `pause()` 而非 `stop()`。微信小程序中 `stop()` 会将音频状态重置为未加载状态，导致后续 `seek(0)` 无效、`play()` 因资源未就绪而静默失败。`pause()` 仅暂停播放而不清除已加载的音频 buffer，确保 `seek(0)` + `play()` 能立即生效。

这确保每次点击都能听到完整的音效开头，不会出现音效叠加或无反馈的情况。

### 引用计数与页面生命周期

`audioInstances` 是模块级全局单例，所有页面共享。在小程序页面栈中，页面 A 跳转到页面 B 时，A 不会卸载（仍在栈底），B 卸载时如果直接销毁实例池，A 将无法播放音效。

**解决方案**：引入 `refCount` 引用计数：

- `initAudio()`：`refCount++`，若实例池已存在则跳过创建
- `destroyAudio()`：`refCount--`，仅当 `refCount` 降为 0 时才真正销毁实例

典型场景（首页 → 科学原理 → 返回）：

1. 首页 `onMounted` → `initAudio()` → refCount=1，创建实例池
2. 科学原理页 `onMounted` → `initAudio()` → refCount=2，实例池已存在跳过
3. 科学原理页 `onUnmounted` → `destroyAudio()` → refCount=1 > 0，**不销毁**
4. 回到首页，按钮正常播放 ✅

### 条件编译策略

整个 `audioManager.js` 在导出函数内部使用条件编译：

```javascript
export function initAudio() {
  // #ifdef MP-WEIXIN
  // 实际初始化逻辑
  // #endif
}

export function playSound(type) {
  // #ifdef MP-WEIXIN
  // 实际播放逻辑
  // #endif
}
```

调用方无需关心平台差异，非微信小程序平台下函数为空操作（no-op）。

### iOS 静音开关处理

在 `init()` 中对每个实例设置 `obeyMuteSwitch = false`，确保 iOS 设备即使开启静音开关也能播放音效。

### 音频文件路径

微信小程序中 `InnerAudioContext.src` 使用绝对路径引用本地文件：

```
/static/audio/button-pressed.mp3
/static/audio/success.mp3
/static/audio/fail.mp3
```

### 集成方式

各页面通过 `import { initAudio, playSound, destroyAudio } from '@/utils/audioManager.js'` 引入，在合适的生命周期调用：

- `onLoad` / `onMounted`：调用 `initAudio()`
- 按钮 `@tap` 处理函数中：调用 `playSound('button')` / `playSound('success')` / `playSound('fail')`
- `onUnmounted`：调用 `destroyAudio()`

### 完整音效触发点清单

以下列出项目中所有需要播放音效的交互点（共 29 个 @tap 处理器，排除纯弹窗遮罩关闭和 @tap.stop 阻止冒泡的元素）：

#### 测试页 test.vue — 特殊音效

| 组件 | 处理函数 | 音效类型 |
|------|---------|---------|
| "✅ 我认识" 按钮 | `handleKnow` | `success` |
| "❌ 不认识" 按钮 | `handleUnknown` | `fail` |
| 熔断弹窗 "查看结果" 按钮 | `goToResult` | `button` |

#### 首页 home.vue — 通用音效

| 组件 | 处理函数 | 音效类型 |
|------|---------|---------|
| "科学原理查看请参考👉" 链接 | `goToPrinciple` | `button` |
| "🚀 开始检测吧！ 🎉" 按钮 | `startTest` | `button` |

#### 结果页 result.vue — 通用音效

| 组件 | 处理函数 | 音效类型 |
|------|---------|---------|
| "🏠 结束检测" 按钮 | `endTest` | `button` |

#### 个人页 profile.vue — 通用音效

| 组件 | 处理函数 | 音效类型 |
|------|---------|---------|
| 头像区域 | `handleAvatarClick` | `button` |
| 昵称区域 | `handleNicknameClick` | `button` |
| 年龄选择器 | `onAgeChange`（@change 事件） | `button` |
| "🤖 AI辅导" 按钮 | `goToAiAssistant` | `button` |
| 历史记录列表项 | `goToDetail(record.id)` | `button` |
| 生字本入口卡片 | `goToVocabularyNotebook` | `button` |
| 引导弹窗 "我知道了" 按钮 | `closeGuideModal` | `button` |

> **排除项**：弹窗遮罩层点击 (`closeGuideModal` 遮罩）和 `@tap.stop` 阻止冒泡元素不播放音效。

#### 生字本页 vocabulary-notebook.vue — 通用音效

| 组件 | 处理函数 | 音效类型 |
|------|---------|---------|
| "← 返回" 导航按钮 | `goBack` | `button` |
| 生字卡片（v-for 循环） | `handleCharTap(char)` | `button` |

#### 历史详情页 history-detail.vue — 通用音效

| 组件 | 处理函数 | 音效类型 |
|------|---------|---------|
| "← 返回" 导航按钮 | `goBack` | `button` |

#### 科学原理页 science-principle.vue — 通用音效

| 组件 | 处理函数 | 音效类型 |
|------|---------|---------|
| "← 返回" 导航按钮 | `goBack` | `button` |

#### AI 助手页 ai-assistant.vue — 通用音效

| 组件 | 处理函数 | 音效类型 |
|------|---------|---------|
| "← 返回" 导航按钮 | `goBack` | `button` |
| "➤" 发送按钮 | `sendMessage` | `button` |

> **排除项**：H5 提示弹窗 "我知道了" 按钮仅在 H5 平台显示，而音效仅在微信小程序生效，无需处理。H5 提示弹窗遮罩和 `@tap.stop` 元素也不播放音效。

#### CustomTabBar.vue — 通用音效

| 组件 | 处理函数 | 音效类型 |
|------|---------|---------|
| "🏠 首页" 标签 | `switchTab('home')` | `button` |
| "👤 我的" 标签 | `switchTab('profile')` | `button` |

### 不播放音效的交互

以下交互**不**播放音效：

| 交互 | 原因 |
|------|------|
| profile.vue 弹窗遮罩层点击 | 纯关闭操作，非按钮交互 |
| profile.vue / ai-assistant.vue `@tap.stop` | 阻止冒泡用途，非用户交互 |
| ai-assistant.vue H5 提示弹窗 "我知道了" | 仅 H5 平台显示，音效仅微信小程序生效 |
| ai-assistant.vue H5 提示弹窗遮罩层 | 同上 |
| profile.vue `@chooseavatar` | 系统行为回调，非用户点击触发 |
| profile.vue `@blur` / `@confirm` | 输入框焦点事件，非按钮点击 |
| profile.vue `@change`（年龄 picker） | picker 选择完成事件，音效在点击时已由 picker 原生交互覆盖，但 `onAgeChange` 回调中可播放音效 |
| test.vue 🔊 喇叭按钮 `handleSpeakerTap` | 喇叭按钮用于播放汉字发音，非通用按钮交互，不播放按钮音效 |
| CharacterCard.vue `handleTap` | 此组件在 test.vue 中使用时由父组件处理音效（test.vue 的 handleKnow/handleUnknown） |
| GradientButton.vue `handleTap` | 通用组件，由使用它的父页面负责音效 |

### 与现有音频系统的关系

`test.vue` 中已有基于 WechatSI 插件的**汉字发音**音频系统（`innerAudioContext` + 播放队列）。新增的按钮音效系统与其**完全独立**：

- 汉字发音：使用 TTS 合成 → `innerAudioContext` 播放
- 按钮音效：使用本地 mp3 文件 → 独立的 `InnerAudioContext` 实例池

两套系统互不干扰，可同时工作。

# components Specification Delta

## ADDED Requirements

### Requirement: 音频管理器 (audioManager)

应用 SHALL 提供 `src/utils/audioManager.js` 工具模块，为微信小程序环境下的按钮点击音效播放提供统一管理能力。采用引用计数机制，多个页面共享同一实例池，避免页面卸载时误销毁其他页面仍在使用的实例。

#### Scenario: 初始化音频实例池

- **Given**: 页面在微信小程序环境中加载
- **When**: 调用 `initAudio()` 函数
- **Then**: 引用计数 +1
- **And**: 若实例池尚未创建，为 button、success、fail 三种音效各创建一个 `InnerAudioContext` 实例
- **And**: 若实例池已存在，跳过创建（仅增加引用计数）
- **And**: 每个实例的 `src` 设置为对应的本地 mp3 文件路径
- **And**: 每个实例的 `obeyMuteSwitch` 设置为 `false`（iOS 下不遵循系统静音开关）
- **And**: 建议开启 `useWebAudioImplement` 以优化短音频播放性能

#### Scenario: 播放按钮点击音效

- **Given**: 音频实例池已初始化
- **When**: 调用 `playSound('button')`
- **Then**: 播放 `/static/audio/button-pressed.mp3` 音效

#### Scenario: 播放认识成功音效

- **Given**: 音频实例池已初始化
- **When**: 调用 `playSound('success')`
- **Then**: 播放 `/static/audio/success.mp3` 音效

#### Scenario: 播放不认识失败音效

- **Given**: 音频实例池已初始化
- **When**: 调用 `playSound('fail')`
- **Then**: 播放 `/static/audio/fail.mp3` 音效

#### Scenario: 快速连续点击时音效不叠加

- **Given**: 音频实例池已初始化
- **And**: 某种音效正在播放中
- **When**: 用户快速再次触发同一种音效
- **Then**: 暂停当前播放（使用 `pause()` 保留音频 buffer，而非 `stop()` 清除状态），重置播放位置，立即重新播放
- **And**: 用户听到完整的音效开头，不会出现声音叠加

#### Scenario: 非微信小程序平台无副作用

- **Given**: 应用运行在 H5 或其他非微信小程序平台
- **When**: 调用 `initAudio()`、`playSound()` 或 `destroyAudio()`
- **Then**: 函数为空操作（no-op），不产生错误或副作用

#### Scenario: 页面卸载时销毁音频实例

- **Given**: 音频实例池已初始化，引用计数 > 0
- **When**: 页面卸载时调用 `destroyAudio()`
- **Then**: 引用计数 -1
- **And**: 若引用计数降为 0，所有 `InnerAudioContext` 实例被停止并销毁
- **And**: 若引用计数仍 > 0（其他页面仍在使用），实例池保持不变
- **And**: 不存在内存泄漏

#### Scenario: 跨页面导航时实例池不被误销毁

- **Given**: 页面 A 已调用 `initAudio()`（引用计数=1）
- **And**: 用户从页面 A 导航到页面 B，页面 B 也调用 `initAudio()`（引用计数=2）
- **When**: 用户返回页面 A，页面 B 卸载并调用 `destroyAudio()`（引用计数=1）
- **Then**: 实例池不被销毁
- **And**: 页面 A 的音效播放正常工作

### Requirement: 检测页按钮音效

测试页 `test.vue` 的"我认识"和"不认识"按钮 SHALL 在微信小程序环境下播放对应音效，熔断弹窗"查看结果"按钮播放通用按钮音效。

#### Scenario: 点击"我认识"播放成功音效

- **Given**: 用户在检测页进行汉字测试（微信小程序环境）
- **When**: 用户点击"✅ 我认识"按钮
- **Then**: 播放 success.mp3 音效
- **And**: 正常执行原有的认识逻辑（记录答案、下一个汉字）

#### Scenario: 点击"不认识"播放失败音效

- **Given**: 用户在检测页进行汉字测试（微信小程序环境）
- **When**: 用户点击"❌ 不认识"按钮
- **Then**: 播放 fail.mp3 音效
- **And**: 正常执行原有的不认识逻辑（记录答案、下一个汉字）

#### Scenario: 点击熔断弹窗"查看结果"播放通用音效

- **Given**: 用户触发熔断机制，弹窗显示（微信小程序环境）
- **When**: 用户点击"查看结果"按钮
- **Then**: 播放 button-pressed.mp3 音效
- **And**: 正常跳转到结果页

#### Scenario: 喇叭按钮不播放按钮音效

- **Given**: 用户在检测页进行汉字测试（微信小程序环境）
- **When**: 用户点击 🔊 喇叭按钮
- **Then**: 不播放 button-pressed.mp3 按钮音效
- **And**: 仅执行汉字发音逻辑（WechatSI TTS）

### Requirement: 通用按钮点击音效

应用中所有页面的可点击交互元素 SHALL 在微信小程序环境下播放通用按钮点击音效（button-pressed.mp3）。

#### Scenario: 首页按钮音效

- **Given**: 用户在首页（微信小程序环境）
- **When**: 用户点击"🚀 开始检测吧！ 🎉"按钮或"科学原理查看请参考👉"链接
- **Then**: 播放 button-pressed.mp3 音效
- **And**: 正常执行页面跳转

#### Scenario: 结果页"结束检测"按钮音效

- **Given**: 用户在结果页（微信小程序环境）
- **When**: 用户点击"🏠 结束检测"按钮
- **Then**: 播放 button-pressed.mp3 音效
- **And**: 正常保存记录并返回首页

#### Scenario: 个人页交互元素音效

- **Given**: 用户在个人页（微信小程序环境）
- **When**: 用户点击以下任一元素：头像区域、昵称区域、年龄选择器、"AI 辅导"按钮、历史记录列表项、生字本入口卡片、引导弹窗"我知道了"按钮
- **Then**: 播放 button-pressed.mp3 音效
- **And**: 正常执行对应的交互逻辑

#### Scenario: 生字本页交互元素音效

- **Given**: 用户在生字本页（微信小程序环境）
- **When**: 用户点击"← 返回"导航按钮或任一生字卡片
- **Then**: 播放 button-pressed.mp3 音效
- **And**: 正常执行返回或进入学习模式

#### Scenario: 历史详情页返回按钮音效

- **Given**: 用户在历史详情页（微信小程序环境）
- **When**: 用户点击"← 返回"导航按钮
- **Then**: 播放 button-pressed.mp3 音效
- **And**: 正常返回上一页

#### Scenario: 科学原理页返回按钮音效

- **Given**: 用户在科学原理页（微信小程序环境）
- **When**: 用户点击"← 返回"导航按钮
- **Then**: 播放 button-pressed.mp3 音效
- **And**: 正常返回上一页

#### Scenario: AI 助手页按钮音效

- **Given**: 用户在 AI 助手页（微信小程序环境）
- **When**: 用户点击"← 返回"导航按钮或"➤"发送按钮
- **Then**: 播放 button-pressed.mp3 音效
- **And**: 正常执行返回或发送消息

#### Scenario: TabBar 切换音效

- **Given**: 用户在任意 TabBar 页面（微信小程序环境）
- **When**: 用户点击 TabBar 切换到另一个页面
- **Then**: 播放 button-pressed.mp3 音效
- **And**: 正常切换到目标页面

#### Scenario: 弹窗遮罩层点击不播放音效

- **Given**: 用户在有弹窗显示的页面（微信小程序环境）
- **When**: 用户点击弹窗遮罩层关闭弹窗
- **Then**: 不播放任何音效
- **And**: 正常关闭弹窗

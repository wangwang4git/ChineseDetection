# character-pronunciation Specification

## Purpose
TBD - created by archiving change add-character-pronunciation. Update Purpose after archive.
## Requirements
### Requirement: 音频上下文生命周期管理

在微信小程序环境下，检测页 SHALL 管理 innerAudioContext 音频上下文的完整生命周期。

#### Scenario: 进入检测页时创建音频上下文

- **Given** 用户在微信小程序环境
- **When** 用户进入检测页
- **Then** 系统 SHALL 创建 innerAudioContext 实例
- **And** 注册 onError 错误处理回调

#### Scenario: 离开检测页时销毁音频上下文

- **Given** 用户在检测页且音频上下文已创建
- **When** 用户离开检测页（返回或跳转）
- **Then** 系统 SHALL 停止当前播放
- **And** 销毁 innerAudioContext 实例
- **And** 释放相关资源

#### Scenario: 非微信小程序环境不创建音频上下文

- **Given** 用户在 H5 或其他小程序环境
- **When** 用户进入检测页
- **Then** 系统 SHALL NOT 创建音频上下文
- **And** 不执行任何音频相关初始化

### Requirement: 汉字自动发音

展示新汉字时，系统 SHALL 自动播放该汉字的发音。

#### Scenario: 展示新汉字后自动播放发音

- **Given** 用户在微信小程序检测页
- **And** 音频上下文已创建
- **When** 系统展示一个新的汉字
- **Then** 系统 SHALL 延时 100ms 后调用语音合成
- **And** 使用 WechatSI 插件的 textToSpeech 方法
- **And** 播放合成的语音文件

#### Scenario: 快速切换汉字时停止上一个发音

- **Given** 用户在微信小程序检测页
- **And** 当前正在播放某汉字发音
- **When** 系统展示下一个汉字
- **Then** 系统 SHALL 先停止当前播放
- **And** 再播放新汉字的发音

#### Scenario: 语音合成失败时静默处理

- **Given** 用户在微信小程序检测页
- **When** 语音合成调用失败
- **Then** 系统 SHALL 在控制台输出错误日志
- **And** 不弹窗或提示用户
- **And** 不影响测试流程继续

### Requirement: 手动播放发音按钮

在米字格组件右侧 SHALL 显示喇叭按钮，支持用户手动重播当前汉字发音。

#### Scenario: 微信小程序显示喇叭按钮

- **Given** 用户在微信小程序检测页
- **When** 检测页加载完成
- **Then** 米字格组件右侧 SHALL 显示喇叭按钮
- **And** 按钮样式为圆形白色半透明背景
- **And** 按钮内显示喇叭图标

#### Scenario: 点击喇叭按钮播放发音

- **Given** 用户在微信小程序检测页
- **And** 当前展示某汉字
- **When** 用户点击喇叭按钮
- **Then** 系统 SHALL 播放当前汉字的发音
- **And** 按钮显示点击反馈效果

#### Scenario: 非微信小程序隐藏喇叭按钮

- **Given** 用户在 H5 或其他小程序环境
- **When** 检测页加载完成
- **Then** SHALL NOT 显示喇叭按钮
- **And** 米字格组件保持居中显示

### Requirement: 微信同声传译插件集成

系统 SHALL 使用微信同声传译插件（WechatSI）实现文本转语音功能。

#### Scenario: 调用插件进行语音合成

- **Given** 系统需要播放汉字发音
- **When** 调用 WechatSI.textToSpeech 方法
- **Then** SHALL 传入参数 lang 为 'zh_CN'
- **And** 传入参数 tts 为 true
- **And** 传入参数 content 为目标汉字
- **And** 成功回调返回音频文件路径

#### Scenario: 使用返回的音频文件播放

- **Given** 语音合成成功
- **And** 返回音频文件路径
- **When** 系统播放该音频
- **Then** SHALL 设置 innerAudioContext.src 为文件路径
- **And** 调用 innerAudioContext.play()

### Requirement: 条件编译处理平台差异

开发者 SHALL 使用 uni-app 条件编译确保代码仅在微信小程序环境执行。

#### Scenario: 音频相关代码使用条件编译

- **Given** 开发者编写音频相关代码
- **When** 代码涉及 innerAudioContext 或 WechatSI 插件
- **Then** SHALL 使用 `// #ifdef MP-WEIXIN` 和 `// #endif` 包裹
- **And** 确保其他平台编译时不包含这些代码

#### Scenario: 喇叭按钮使用条件编译

- **Given** 开发者编写喇叭按钮模板
- **When** 按钮仅在微信小程序显示
- **Then** SHALL 使用 `<!-- #ifdef MP-WEIXIN -->` 和 `<!-- #endif -->` 包裹

### Requirement: 音频播放错误处理

系统 SHALL 妥善处理音频播放过程中可能出现的错误。

#### Scenario: 音频上下文错误处理

- **Given** 音频上下文已创建
- **When** 音频播放出错
- **Then** onError 回调 SHALL 被触发
- **And** 错误信息输出到控制台
- **And** 不影响页面其他功能

#### Scenario: 空汉字不触发播放

- **Given** 用户在检测页
- **When** currentChar 为空字符串
- **Then** SHALL NOT 调用语音合成
- **And** 不触发任何播放行为


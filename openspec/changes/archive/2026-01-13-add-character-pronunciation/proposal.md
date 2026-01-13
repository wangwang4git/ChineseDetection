# add-character-pronunciation

## Summary

为检测页添加汉字发音功能，在微信小程序环境下，每展示一个新汉字时自动播放发音，同时在米字格旁添加喇叭按钮支持用户手动重播。

## Motivation

当前检测页仅展示汉字，对于识字能力较弱的儿童，听到汉字发音有助于：
1. 确认是否真正认识该字（而非仅凭字形猜测）
2. 提升测试的互动性和趣味性
3. 帮助儿童在测试过程中学习正确发音

## Scope

### In Scope
- 微信小程序环境下的汉字发音功能
- 使用微信同声传译插件（WechatSI）进行文本转语音
- 进入检测页时创建 innerAudioContext 音频上下文
- 离开检测页时销毁音频上下文释放资源
- 展示新汉字后延时 100ms 自动播放发音
- 米字格组件右侧添加喇叭按钮，支持手动播放
- 使用 `#ifdef MP-WEIXIN` 条件编译处理平台差异

### Out of Scope
- H5 或其他小程序平台的语音功能（后续可扩展）
- 语音设置（语速、音量等）的用户自定义
- 离线语音包

## Technical Approach

### 1. 微信同声传译插件
项目已配置 WechatSI 插件（provider: wx069ba97219f66d99），使用其 `textToSpeech` 方法将汉字转为语音文件。

### 2. 音频播放
使用 uni-app 的 `uni.createInnerAudioContext()` 创建音频上下文：
- 页面 onLoad 时创建
- 页面 onUnload 时销毁
- 支持设置 src 并调用 play()

### 3. 发音流程
```
展示新汉字 → 延时 100ms → 调用 textToSpeech → 获取音频文件 → 播放
```

### 4. UI 交互
在米字格组件右侧添加喇叭图标按钮，点击后重新播放当前汉字发音。

## Dependencies

- 微信同声传译插件 WechatSI（已配置）
- uni-app innerAudioContext API

## Risks & Mitigations

| 风险 | 缓解措施 |
|------|----------|
| 插件调用失败 | 添加错误处理，失败时静默降级 |
| 音频播放冲突 | 播放前先停止当前音频 |
| 用户快速切换汉字 | 使用防抖或取消上一次请求 |

## Status

- [x] Proposal created
- [ ] Design completed
- [ ] Specs drafted
- [ ] Tasks defined
- [ ] Validated

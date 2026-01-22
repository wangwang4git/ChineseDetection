## ADDED Requirements

### Requirement: 笔画动画按钮

检测页面 SHALL 在大米字格右侧提供笔画动画按钮，用户点击后播放当前汉字的笔画书写动画。H5 和微信小程序均支持此功能。

#### Scenario: 笔画按钮展示
- **WHEN** 访问检测页面（H5 或小程序环境）
- **THEN** 在大米字格右侧显示笔画按钮
- **AND** 笔画按钮为粉色圆形（背景 #FCCEE8）
- **AND** 按钮尺寸 48x48px（96x96rpx）
- **AND** 按钮显示笔画图标
- **AND** 按钮有阴影效果
- **AND** 笔画按钮位于喇叭按钮下方（垂直排列）

#### Scenario: 点击播放笔画动画
- **WHEN** 用户点击笔画按钮
- **THEN** 触发当前大米字格汉字的笔画书写动画
- **AND** 动画按正确笔顺逐笔绘制
- **AND** 动画过程中显示汉字轮廓

#### Scenario: 动画播放中点击
- **WHEN** 动画正在播放时用户再次点击笔画按钮
- **THEN** 重新开始播放动画

### Requirement: 使用 HanziGrid 替换米字格

检测页面的大米字格和词语小米字格展示区域 SHALL 使用 HanziGrid 组件替换原有的 RiceGrid 组件。

#### Scenario: 大米字格使用 HanziGrid
- **WHEN** 检测页面渲染大米字格
- **THEN** 使用 HanziGrid 组件展示汉字
- **AND** 组件尺寸为 488rpx
- **AND** 显示金色边框
- **AND** 支持笔画动画功能

#### Scenario: 词语小米字格使用 HanziGrid
- **WHEN** 检测页面渲染词语示例区域
- **THEN** 使用 HanziGrid 组件展示词语汉字
- **AND** 组件尺寸为 160rpx
- **AND** 不显示边框（`showBorder: false`）
- **AND** 不支持笔画动画（无按钮触发）

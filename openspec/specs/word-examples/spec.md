# word-examples Specification

## Purpose
TBD - created by archiving change add-word-examples. Update Purpose after archive.
## Requirements
### Requirement: 词语数据加载

系统 SHALL 从 `top_2500_chars_with_words.json` 加载汉字数据，包含每个汉字对应的词语列表。

#### Scenario: 加载包含词语的汉字数据

- **Given** 系统初始化测试
- **When** 调用 `getLayeredTestCharacters` 接口
- **Then** 系统 SHALL 返回包含 `words` 字段的汉字数据
- **And** 每个汉字的 `words` 字段包含两个常用词语

#### Scenario: 获取当前汉字的词语列表

- **Given** 用户在检测页
- **And** 当前展示某汉字
- **When** 系统计算 `currentWords`
- **Then** SHALL 返回当前汉字对应的两个词语
- **And** 若词语数据缺失则返回空数组

### Requirement: 词语展示区域

检测页 SHALL 在主米字格下方展示当前汉字对应的两个词语示例。

#### Scenario: 展示词语示例标题

- **Given** 用户在检测页
- **And** 当前汉字有词语数据
- **When** 页面渲染完成
- **Then** 主米字格下方 SHALL 显示"📚 词语示例"标题
- **And** 标题颜色为紫色 (#8200DB)

#### Scenario: 展示四个小米字格

- **Given** 用户在检测页
- **And** 当前汉字有两个词语（每个词语两个字）
- **When** 页面渲染完成
- **Then** SHALL 显示四个小米字格（160rpx）
- **And** 左侧两个展示词语1的两个字
- **And** 右侧两个展示词语2的两个字

#### Scenario: 小米字格样式

- **Given** 词语展示区域渲染
- **When** 小米字格显示
- **Then** 小米字格 SHALL 使用白色背景
- **And** 无金色边框
- **And** 有阴影效果
- **And** 字体大小按比例缩小

#### Scenario: 无词语数据时隐藏展示区域

- **Given** 用户在检测页
- **And** 当前汉字无词语数据或词语数量不足
- **When** 页面渲染
- **Then** SHALL NOT 显示词语示例区域
- **And** 不影响测试流程

### Requirement: 词语发音播放

微信小程序环境下，系统 SHALL 在播放汉字发音后依次播放两个词语的发音。

#### Scenario: 自动播放汉字和词语发音

- **Given** 用户在微信小程序检测页
- **And** 当前汉字有词语数据
- **When** 系统展示新汉字
- **Then** 系统 SHALL 延时 100ms 后播放汉字发音
- **And** 汉字发音结束后延时 50ms 播放词语1发音
- **And** 词语1发音结束后延时 50ms 播放词语2发音

#### Scenario: 手动播放完整发音序列

- **Given** 用户在微信小程序检测页
- **And** 当前汉字有词语数据
- **When** 用户点击喇叭按钮
- **Then** 系统 SHALL 播放汉字发音
- **And** 依次播放词语1和词语2发音
- **And** 每个发音间隔 50ms

#### Scenario: 无词语数据时仅播放汉字

- **Given** 用户在微信小程序检测页
- **And** 当前汉字无词语数据
- **When** 触发发音播放
- **Then** 系统 SHALL 仅播放汉字发音
- **And** 不报错

#### Scenario: 发音队列中断处理

- **Given** 正在播放发音队列
- **When** 用户切换到下一个汉字
- **Then** 系统 SHALL 停止当前播放
- **And** 开始播放新汉字的发音序列

### Requirement: RiceGrid 组件扩展

RiceGrid 组件 SHALL 支持通过 prop 控制是否显示金色边框。

#### Scenario: 默认显示金色边框

- **Given** 使用 RiceGrid 组件
- **When** 未指定 `showBorder` prop
- **Then** 组件 SHALL 显示金色边框 (#FDC700)

#### Scenario: 隐藏边框显示

- **Given** 使用 RiceGrid 组件
- **When** 设置 `showBorder="false"`
- **Then** 组件 SHALL NOT 显示金色边框
- **And** 保留白色背景和阴影效果

### Requirement: 条件编译处理

词语发音功能 SHALL 使用条件编译仅在微信小程序环境执行。

#### Scenario: 词语展示跨平台可用

- **Given** 用户在任意平台
- **When** 检测页加载
- **Then** 词语示例区域 SHALL 正常显示

#### Scenario: 词语发音仅微信小程序

- **Given** 用户在非微信小程序环境
- **When** 检测页加载
- **Then** SHALL NOT 执行词语发音相关代码
- **And** 无控制台报错

### Requirement: 汉字接口数据扩展

接口 SHALL 从包含词语数据的数据源返回汉字数据。

#### Scenario: 返回包含词语的汉字数据

- **Given** 调用 `getLayeredTestCharacters` 接口
- **When** 接口返回成功
- **Then** 每个汉字对象 SHALL 包含 `words` 字段
- **And** `words` 为包含两个词语字符串的数组


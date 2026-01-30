# Spec: science-principle-page

识字量测试科学原理页面规范

## ADDED Requirements

### Requirement: 页面基础结构

科学原理页面 MUST 提供完整的测试方法说明，包含数据来源、测试策略、层级划分、熔断机制和计算示例。

#### Scenario: 页面可访问

- Given 用户在首页
- When 用户点击"科学原理查看请参考👉"链接
- Then 跳转到科学原理页面
- And 页面路径为 `/pages/science-principle/science-principle`
- And 页面标题为"识字量测试科学原理"

#### Scenario: 页面布局

- Given 用户打开科学原理页面
- Then 页面从上到下依次展示：
  - 返回按钮
  - Header 卡片（标题区域）
  - 📊 数据来源卡片
  - 🎯 测试策略卡片
  - 📋 常用字层级划分卡片
  - ⚠️ 测试结束机制卡片
  - 💡 计算示例卡片

### Requirement: 返回导航

页面 MUST 提供返回按钮，支持用户返回上一页面。

#### Scenario: 返回上一页

- Given 用户在科学原理页面
- When 用户点击"← 返回"按钮
- Then 返回上一页面

### Requirement: 数据来源展示

数据来源卡片 MUST 展示测试数据的来源和覆盖率信息。

#### Scenario: 展示数据来源信息

- Given 用户在科学原理页面
- Then 数据来源卡片展示以下内容：
  - 基于《现代汉语常用字表》及语料库大数据
  - 精选前 2500个常用字（高亮紫色）
  - 出现累积频率高达 98.5%（高亮紫色）

### Requirement: 测试策略展示

测试策略卡片 MUST 展示分层频率抽样策略和计算公式。

#### Scenario: 展示测试策略和公式

- Given 用户在科学原理页面
- Then 测试策略卡片展示以下内容：
  - 采用分层频率抽样测试策略（高亮绿色）
  - 识字量计算公式展示
  - 公式说明：N_Lx 代表在第 x 层级中实际认读正确的字数

### Requirement: 层级划分表格展示

层级划分卡片 MUST 以表格形式展示六个汉字层级的详细信息。

#### Scenario: 展示六个层级的详细信息

- Given 用户在科学原理页面
- Then 层级划分卡片展示表格，包含以下列：
  - 层级（L1-L6）
  - 字频排名
  - 描述
  - 抽样方式
  - 测试字数
  - 权重

### Requirement: 测试结束机制展示

测试结束机制卡片 MUST 展示动态熔断机制的说明。

#### Scenario: 展示熔断机制

- Given 用户在科学原理页面
- Then 测试结束机制卡片展示以下内容：
  - 任何层级连续5个测试字不认识，立即停止测试
  - 任何层级总错误率超过80%，立即停止测试
  - 提示信息：这样的机制可以避免让孩子产生挫败感，同时提高测试效率

### Requirement: 计算示例展示

计算示例卡片 MUST 提供完整的识字量计算示例。

#### Scenario: 展示完整计算示例

- Given 用户在科学原理页面
- Then 计算示例卡片展示以下内容：
  - 前提说明
  - 假设各层级测试结果
  - 计算过程
  - 最终结果（高亮紫色大字）

### Requirement: 微信分享支持

科学原理页 MUST 支持微信小程序分享功能，包括分享给好友和分享到朋友圈。

#### Scenario: 分享给好友

- Given 用户在科学原理页面（微信小程序环境）
- When 用户点击微信分享按钮
- Then 分享标题为"🔬 识字量测试科学原理 - 了解科学测评方法"
- And 分享路径为 `/pages/science-principle/science-principle`
- And 好友点击分享卡片可直接进入科学原理页

#### Scenario: 分享到朋友圈

- Given 用户在科学原理页面（微信小程序环境）
- When 用户分享到朋友圈
- Then 分享标题为"识字量测试科学原理 - 基于语言学研究的科学测评方法"

#### Scenario: 分享配置函数

- Given share.js 分享工具模块
- Then MUST 提供 `getSciencePrincipleShareConfig()` 函数返回分享好友配置
- And MUST 提供 `getSciencePrincipleTimelineConfig()` 函数返回朋友圈分享配置
- And 配置函数遵循现有代码风格（支持 SHARE_IMAGE_URL 自定义图片）

#### Scenario: 条件编译处理

- Given science-principle.vue 页面
- Then MUST 使用 `#ifdef MP-WEIXIN` 条件编译包裹分享代码
- And MUST 定义 `onShareAppMessage` 方法处理分享给好友
- And MUST 定义 `onShareTimeline` 方法处理分享到朋友圈
- And MUST 使用 `defineExpose` 暴露分享方法



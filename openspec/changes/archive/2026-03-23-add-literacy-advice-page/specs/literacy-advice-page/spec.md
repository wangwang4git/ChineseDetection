## ADDED Requirements

### Requirement: 4-5岁识字学习建议页面

应用 SHALL 提供「4-5岁识字学习建议」页面（`pages/literacy-advice/literacy-advice`），以静态内容形式展示针对4-5岁儿童的科学识字指导方案。页面使用自定义导航栏（`navigationStyle: "custom"`），页面标题为"识字学习建议"。

#### Scenario: 页面整体布局

- **Given** 用户从首页点击4-5岁卡片进入建议页
- **When** 页面加载完成
- **Then** 页面 SHALL 显示粉紫蓝渐变背景 `linear-gradient(135deg, #FCCEE8 0%, #E9D4FF 50%, #BEDBFF 100%)`
- **And** 页面 SHALL 显示白色圆角主卡片容器（圆角 48rpx，橙色边框 #FFD6A8，边框宽度 7rpx，阴影效果）
- **And** 主卡片内顶部 SHALL 显示渐变 Banner 区域 `linear-gradient(90deg, #C27AFF 0%, #FB64B6 50%, #FF8904 100%)`
- **And** Banner 中 SHALL 居中显示 🎯 emoji、标题"4-5岁 识字学习建议"（白色 24px 加粗）、副标题"专业科学的识字指导方案"（白色半透明 14px）

#### Scenario: 建议模块展示

- **Given** 用户在4-5岁识字学习建议页
- **When** 页面加载完成
- **Then** 页面 SHALL 依次显示4个建议模块卡片：
  1. 📊 **明确学习优先级：聚焦核心字频**（蓝色主题，背景渐变 #EFF6FF → #FAF5FF，边框 #BEDBFF，标题色 #1447E6）
  2. 📖 **融入情景阅读：科学启蒙与故事化输入**（绿色主题，背景渐变 #F0FDF4 → #ECFDF5，边框 #B9F8CF，标题色 #008236）
  3. 🎮 **建立进阶激励机制：游戏化成长路径**（橙色主题，背景渐变 #FFF7ED → #FEFCE8，边框 #FFD6A8，标题色 #CA3500）
  4. ⏰ **科学复习与生活应用**（紫色主题，背景渐变 #FAF5FF → #FDF2F8，边框 #E9D4FF，标题色 #8200DB）
- **And** 每个模块卡片 SHALL 包含圆角 32rpx、阴影效果和对应颜色边框
- **And** 每个模块 SHALL 包含 emoji 图标 + 编号标题 + 正文描述 + 白色圆角详情框

#### Scenario: 建议模块内容准确性

- **Given** 用户在4-5岁识字学习建议页查看建议内容
- **When** 用户阅读第1个模块
- **Then** 正文 SHALL 包含关于绝对核心字（字频 1-50）和高频基础字（字频 51-200）的学习优先级建议
- **And** 详情框 SHALL 包含两个要点：核心字包含人称代词、基础方位和高频自然名词的示例，以及不建议过早引入中频常用字的提醒

#### Scenario: 底部鼓励语

- **Given** 用户在4-5岁识字学习建议页
- **When** 滚动到页面底部
- **Then** 页面 SHALL 显示粉紫渐变鼓励语卡片（背景 `linear-gradient(90deg, #FCE7F3 0%, #F3E8FF 100%)`，粉色边框 #FDA5D5）
- **And** 卡片 SHALL 显示 ✨ emoji
- **And** 卡片 SHALL 显示鼓励文案："记住，识字是一个循序渐进的过程，保持耐心和鼓励，让孩子在快乐中成长！"（其中"循序渐进"为粉色加粗 #E60076）

#### Scenario: 返回按钮

- **Given** 用户在4-5岁识字学习建议页
- **When** 用户点击左上角「← 返回」按钮
- **Then** 播放按钮音效
- **And** 返回上一页（首页）

#### Scenario: 微信小程序分享

- **Given** 用户在4-5岁识字学习建议页（微信小程序环境）
- **When** 用户触发分享
- **Then** SHALL 使用默认分享配置（`getDefaultShareConfig` / `getDefaultTimelineConfig`）

### Requirement: 4-5岁识字学习建议页面路由

应用 SHALL 在 `pages.json` 中注册 `pages/literacy-advice/literacy-advice` 页面路由。

#### Scenario: 页面路由配置

- **Given** 应用的路由配置文件 `pages.json`
- **When** 查看页面列表
- **Then** SHALL 包含路由 `pages/literacy-advice/literacy-advice`
- **And** `navigationBarTitleText` 设置为"识字学习建议"
- **And** `navigationStyle` 设置为 `"custom"`

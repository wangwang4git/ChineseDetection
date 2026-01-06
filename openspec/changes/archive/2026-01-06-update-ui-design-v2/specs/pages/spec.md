# Spec Delta: Pages UI Update v2.0

## MODIFIED Requirements

### Requirement: 首页 (HomePage) UI v2.0

首页 SHALL 采用 Figma 2.0 设计稿的视觉风格，包括粉紫蓝渐变背景、banner 图片、浅色渐变卡片和胶囊按钮。

#### Scenario: 页面整体布局

- **Given** 用户进入首页
- **Then** 页面背景 SHALL 显示 135° 粉紫蓝渐变 (`#FCCEE8` → `#E9D4FF` → `#BEDBFF`)
- **And** 顶部 SHALL 显示 banner 图片 (`assets/CodeBubbyAssets/15_264/1.png`)
- **And** 标题 SHALL 显示 "🎓 汉字认字量检测 📚"
- **And** 副标题 SHALL 显示 "一起来测测认识多少字吧！" (颜色 `#6E11B0`)

#### Scenario: 年龄段认字量卡片展示

- **Given** 用户查看首页年龄段参考区间
- **Then** 每个年龄段卡片 SHALL 显示以下元素：
  - 左侧 emoji 图标 (🌱/🌿/🌺/🌻/🌳)
  - 年龄标签 (字号 18px, 颜色 `#1E2939`)
  - "目标认字量" 描述文字 (字号 14px, 颜色 `#4A5565`)
  - 右侧数字范围 (字号 20px, 颜色 `#9810FA`)
  - "个汉字" 单位 (字号 12px, 颜色 `#6A7282`)
- **And** 卡片 SHALL 使用浅色渐变背景 + 金色边框 (`#FFDF20`)
- **And** 卡片圆角 SHALL 为 14px

#### Scenario: 开始检测按钮样式

- **Given** 用户查看开始检测按钮
- **Then** 按钮 SHALL 显示为胶囊形状 (圆角 17529000px)
- **And** 按钮背景 SHALL 为 90° 渐变 (`#FB64B6` → `#C27AFF` → `#51A2FF`)
- **And** 按钮 SHALL 有白色边框 (3.66px)
- **And** 按钮文字 SHALL 为 "🚀 开始检测吧！ 🎉" (白色, 20px)

### Requirement: 个人页 (ProfilePage) UI v2.0

个人页 SHALL 采用 Figma 2.0 设计稿的视觉风格，包括粉紫蓝渐变背景、渐变用户卡片、三色统计卡片。

#### Scenario: 页面整体布局

- **Given** 用户进入个人页
- **Then** 页面背景 SHALL 显示 135° 粉紫蓝渐变 (`#FCCEE8` → `#E9D4FF` → `#BEDBFF`)

#### Scenario: 用户信息卡片展示

- **Given** 用户查看个人信息卡片
- **Then** 卡片背景 SHALL 为 90° 渐变 (`#FDA5D5` → `#DAB2FF` → `#8EC5FF`)
- **And** 卡片 SHALL 有白色边框 (3.66px) 和阴影
- **And** 卡片圆角 SHALL 为 16px
- **And** 头像 SHALL 显示在金黄色渐变圆形背景中 (`#FFDF20` → `#FFB86A`)
- **And** 昵称 SHALL 显示为白色 20px 字体
- **And** 账号 SHALL 显示为白色半透明 14px 字体

#### Scenario: 统计卡片展示

- **Given** 用户查看统计数据
- **Then** 统计区域 SHALL 显示三个独立卡片，横向排列
- **And** "检测次数" 卡片 SHALL 使用绿色渐变 (`#B9F8CF` → `#7BF1A8`) + 绿色边框 (`#05DF72`)
- **And** "最高记录" 卡片 SHALL 使用蓝色渐变 (`#BEDBFF` → `#8EC5FF`) + 蓝色边框 (`#51A2FF`)
- **And** "平均认字" 卡片 SHALL 使用紫色渐变 (`#E9D4FF` → `#DAB2FF`) + 紫色边框 (`#C27AFF`)
- **And** 每个卡片 SHALL 显示 emoji 图标、数值、标签

#### Scenario: 历史记录标题

- **Given** 用户查看历史记录区域
- **Then** 标题 SHALL 显示 "📚 历史检测记录" (颜色 `#6E11B0`, 20px)

#### Scenario: 历史记录卡片展示

- **Given** 用户查看历史检测记录
- **Then** 每条记录卡片 SHALL 使用浅黄渐变背景 (`#FFF5E5` → `white`)
- **And** 卡片 SHALL 有金色边框 (`#FFDF20`, 1.57px)
- **And** 卡片 SHALL 显示：
  - 检测时间 (12px, 颜色 `#4A5565`)
  - "📊 认字量：{数值}" (18px, 颜色 `#9810FA`)
  - "需加强：{数量} 个汉字" (12px, 颜色 `#4A5565`)
  - 右侧 "👉" 箭头图标
